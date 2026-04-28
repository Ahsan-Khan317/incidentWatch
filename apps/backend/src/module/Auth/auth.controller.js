import { registerService, loginService } from "./auth.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ApiResponse } from "@/utils/ApiResponse.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);
  return res.status(201).json(new ApiResponse(201, user, "User registered"));
});

export const loginController = asyncHandler(async (req, res) => {
  const {
    email,

    password,
  } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(new ApiResponse(200, data, "Login successful"));
});
