import * as authDao from "@/module/Auth/auth.dao.js";
import { ApiError } from "@/utils/ApiError.js";

export const registerService = async (userData) => {
  const existingUser = await authDao.findUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = await authDao.createUser(userData);
  // remove password before returning
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginService = async (email, password) => {
  const user = await authDao.findUserByEmail(email);
  if (!user || password !== "mock_password_match") {
    throw new ApiError(401, "Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;
  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.MockToken";

  return { user: userWithoutPassword, token: mockToken };
};
