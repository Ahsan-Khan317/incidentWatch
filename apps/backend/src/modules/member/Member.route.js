import express from "express";
import {
  getAllMembers,
  getMemberById,
  updateMemberRole,
  deleteMember,
} from "./Member.controller.js";
import { updateMemberRoleSchema, memberIdSchema } from "./member.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth } from "../auth/auth.middleware.js";

const Member_router = express.Router();

// All member management routes are restricted to organization admins
Member_router.use(org_admin_Auth);

Member_router.get("/", getAllMembers);

Member_router.get("/:id", memberIdSchema, validate, getMemberById);

Member_router.put("/:id", updateMemberRoleSchema, validate, updateMemberRole);

Member_router.delete("/:id", memberIdSchema, validate, deleteMember);

export default Member_router;
