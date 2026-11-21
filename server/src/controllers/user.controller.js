import { registerUser, loginUser } from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import authCookieOptions from "../utils/authCookieOptions.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });
  const token = generateToken(user.id);
  res.cookie("token", token, authCookieOptions);
  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully.", { user }));
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });

  const token = generateToken(user.id);
  res.cookie("token", token, authCookieOptions);

  res.status(200).json(new ApiResponse(200, "Login successful.", { user }));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", authCookieOptions);
  res.status(200).json(new ApiResponse(200, "Logged out successfully.", null));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json(
    new ApiResponse(200, "Current user fetched successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
      },
    }),
  );
});
