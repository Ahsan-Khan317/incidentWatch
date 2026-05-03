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
import { orgRegisterValidation, userLoginValidation } from "./auth.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth, org_user_Auth } from "./auth.middleware.js";

const Auth_router = express.Router();

Auth_router.post("/orgregister", orgRegisterValidation, validate, registerOrganization);
Auth_router.get("/verify-email/:id", verifyEmail);
Auth_router.post("/orglogin", userLoginValidation, validate, loginOrganization);
Auth_router.get("/getme", org_user_Auth, get_me);

Auth_router.post("/inviteuser", org_admin_Auth, inviteUser);
Auth_router.post("/acceptinvite", acceptInvite);

Auth_router.get("/refresh_token", refreshToken);

// Logout changed: GET → POST (it mutates state) + requires auth middleware
Auth_router.post("/logout", org_user_Auth, logout);

export default Auth_router;
