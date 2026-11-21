import validator from "validator";
import ApiError from "../utils/ApiError.js";

export function validateRegister(req, _res, next) {
  const { name, email, password } = req.body ?? {};
  const errors = [];

  if (
    typeof name !== "string" ||
    !validator.isLength(name.trim(), { min: 1, max: 80 })
  ) {
    errors.push("Name must be between 1 and 80 characters.");
  }

  if (typeof email !== "string" || !validator.isEmail(email.trim())) {
    errors.push("A valid email address is required.");
  }

  if (
    typeof password !== "string" ||
    !validator.isLength(password, { min: 8, max: 72 }) ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    errors.push(
      "Password must be 8 to 72 characters and no more than 72 bytes.",
    );
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Request validation failed.", { errors }));
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}
export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  next();
}
