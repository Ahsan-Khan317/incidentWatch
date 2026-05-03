import express from "express";
import { inviteMember, acceptInvite, getInvites, deleteInvite } from "./Invite.controller.js";
import { inviteMemberSchema } from "./invite.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth } from "../auth/auth.middleware.js";

const Invite_router = express.Router();

Invite_router.get("/", org_admin_Auth, getInvites);
Invite_router.delete("/:id", org_admin_Auth, deleteInvite);
Invite_router.post("/", org_admin_Auth, inviteMemberSchema, validate, inviteMember);
Invite_router.get("/accept-invite", validate, acceptInvite);

export default Invite_router;
