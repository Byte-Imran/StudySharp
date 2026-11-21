import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  getUserProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  uploadAvatar,
  updateProfile,
} from "../controllers/user.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }
    callback(null, true);
  },
});

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/me", verifyJWT, updateProfile);
router.get("/:id", verifyJWT, getUserProfile);
router.post("/:id/follow", verifyJWT, toggleFollow);
router.delete("/:id/follow", verifyJWT, toggleFollow);
router.get("/:id/followers", verifyJWT, getFollowers);
router.get("/:id/following", verifyJWT, getFollowing);
router.patch("/me/avatar", verifyJWT, upload.single("image"), uploadAvatar);

export default router;
