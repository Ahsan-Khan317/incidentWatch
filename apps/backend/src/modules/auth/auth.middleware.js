import { verifyAccessToken } from "../../utils/generateToken.js";
import { sessionService } from "../session/session.service.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { memberDao } from "../member/member.dao.js";

/**
 * Shared helper: verify JWT + verify session exists in Redis via sessionService.
 */
const verifySession = async (req) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized access");
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const { id, organizationId, role, sessionId } = decoded;

  if (!sessionId) {
    throw new ApiError(401, "Legacy token — please re-login");
  }

  // Use sessionService for stateful check
  const session = await sessionService.getSession(id, sessionId);

  if (!session) {
    throw new ApiError(401, "Session expired or revoked");
  }

  // Normalize organizationId from token or session
  let finalOrganizationId = organizationId || decoded.orgid;

  if (!finalOrganizationId) {
    const sessionOrgId = session.organizationId || session.orgid;
    if (sessionOrgId) {
      console.log("[AUTH] organizationId recovered from session:", sessionOrgId);
      finalOrganizationId = sessionOrgId;
    }
  }

  if (!finalOrganizationId) {
    console.error(
      "[AUTH] organizationId/orgid missing in both token and session. Decoded:",
      decoded,
      "Session:",
      session,
    );
  }

  // Fetch Member details
  let member = null;
  if (finalOrganizationId) {
    member = await memberDao.findMemberByUserAndOrg(id, finalOrganizationId);
  }

  return { id, organizationId: finalOrganizationId, role: member?.role || role, sessionId, member };
};

export const org_user_Auth = async (req, res, next) => {
  try {
    const userContext = await verifySession(req);
    req.user = userContext;
    if (userContext.member) {
      req.member = {
        organizationId: userContext.organizationId,
        role: userContext.role,
      };
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, "Authentication failed"));
  }
};

export const org_admin_Auth = async (req, res, next) => {
  try {
    const userContext = await verifySession(req);

    if (userContext.role !== "admin") {
      return next(new ApiError(403, "Admin access required"));
    }

    req.user = userContext;
    if (userContext.member) {
      req.member = {
        organizationId: userContext.organizationId,
        role: userContext.role,
      };
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, "Authentication failed"));
  }
};
