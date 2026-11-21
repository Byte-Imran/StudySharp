import jwt from "jsonwebtoken";

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return token;
}

export default generateToken;