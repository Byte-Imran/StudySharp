import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/user.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
