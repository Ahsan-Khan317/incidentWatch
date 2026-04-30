import express from "express";
import {
  registerOrganization,
  verifyEmail,
  loginOrganization,
  get_me,
  inviteUser,
  acceptInvite,
  refreshToken,
  logout,
} from "./Auth.controller.js";
import { orgRegisterValidation, userLoginValidation } from "./auth.validators.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth, org_user_Auth } from "./auth.middleware.js";

const Auth_router = express.Router();

Auth_router.post("/auth/orgregister", orgRegisterValidation, validate, registerOrganization);
Auth_router.get("/verify/email/:id", verifyEmail);
Auth_router.post("/auth/orglogin", userLoginValidation, validate, loginOrganization);
Auth_router.get("/auth/getme", org_user_Auth, get_me);

Auth_router.post("/auth/inviteuser", org_admin_Auth, inviteUser);
Auth_router.post("/auth/acceptinvite", acceptInvite);

Auth_router.get("/refresh_token", refreshToken);
Auth_router.get("/auth/logout", logout);

export default Auth_router;
