import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}
