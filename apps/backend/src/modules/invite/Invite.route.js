import express from "express";
import { inviteMember, acceptInvite } from "./Invite.controller.js";
import { inviteMemberSchema, acceptInviteSchema } from "./invite.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth } from "../auth/auth.middleware.js";

const Invite_router = express.Router();

Invite_router.post("/invite", org_admin_Auth, inviteMemberSchema, validate, inviteMember);
Invite_router.post("/accept-invite", acceptInviteSchema, validate, acceptInvite);

export default Invite_router;
