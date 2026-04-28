import Router from "express";
import authRouter from "@/module/Auth/auth.route.js";

const router = Router();

// Define module routes here
router.use("/auth", authRouter);

export default router;
