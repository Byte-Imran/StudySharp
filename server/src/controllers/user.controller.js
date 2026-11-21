import { registerUser, loginUser } from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import authCookieOptions from "../utils/authCookieOptions.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

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
        nickname: user.nickname,
        bio: user.bio,
        education: user.education,
        location: user.location,
        quote: user.quote,
        skills: user.skills,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    }),
  );
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -googleId -githubId",
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isFollowing = user.followers.some(
    (followerId) => followerId.toString() === req.user._id.toString(),
  );

  res.status(200).json(
    new ApiResponse(200, "User profile fetched successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
        bio: user.bio,
        education: user.education,
        location: user.location,
        quote: user.quote,
        skills: user.skills,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      },
    }),
  );
});

export const toggleFollow = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id;

  if (targetId === currentUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself.");
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    throw new ApiError(404, "User not found.");
  }

  const isFollowing = req.user.following.some(
    (followingId) => followingId.toString() === targetId,
  );

  if (isFollowing) {
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetId },
      }),
      User.findByIdAndUpdate(targetId, {
        $pull: { followers: currentUserId },
      }),
    ]);
  } else {
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetId },
      }),
      User.findByIdAndUpdate(targetId, {
        $addToSet: { followers: currentUserId },
      }),
    ]);
  }

  const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetId),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      isFollowing ? "User unfollowed successfully." : "User followed successfully.",
      {
        isFollowing: !isFollowing,
        followersCount: updatedTargetUser.followers.length,
        followingCount: updatedCurrentUser.following.length,
      },
    ),
  );
});

export const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "followers",
    "name email img",
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Followers fetched successfully.", user.followers));
});

export const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "following",
    "name email img",
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Following fetched successfully.", user.following));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please select an image to upload.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new ApiError(
      500,
      "Cloudinary is not configured. Add the Cloudinary environment variables.",
    );
  }

  if (req.user.avatarPublicId) {
    await cloudinary.uploader.destroy(req.user.avatarPublicId);
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studysharp/avatars",
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(req.file.buffer);
  });

  req.user.img = uploadResult.secure_url;
  req.user.avatarPublicId = uploadResult.public_id;
  await req.user.save();

  res.status(200).json(
    new ApiResponse(200, "Profile image uploaded successfully.", {
      img: req.user.img,
    }),
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "nickname",
    "bio",
    "education",
    "location",
    "quote",
    "skills",
  ];
  const updates = {};

  allowedFields.forEach((field) => {
    if (field === "skills" && Array.isArray(req.body.skills)) {
      updates.skills = [
        ...new Map(
          req.body.skills
            .filter((skill) => typeof skill === "string")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
            .slice(0, 20)
            .map((skill) => [skill.toLowerCase(), skill]),
        ).values(),
      ];
    } else if (typeof req.body[field] === "string") {
      updates[field] = req.body[field].trim();
    }
  });

  if (updates.name !== undefined && updates.name.length < 1) {
    throw new ApiError(400, "Name cannot be empty.");
  }

  if (updates.name?.length > 80) {
    throw new ApiError(400, "Name must be 80 characters or fewer.");
  }

  if (updates.quote?.length > 180) {
    throw new ApiError(400, "Quote must be 180 characters or fewer.");
  }

  if (
    updates.skills &&
    updates.skills.some((skill) => skill.length > 40)
  ) {
    throw new ApiError(400, "Each skill must be 40 characters or fewer.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  );

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        img: user.img,
        nickname: user.nickname,
        bio: user.bio,
        education: user.education,
        location: user.location,
        quote: user.quote,
        skills: user.skills,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    }),
  );
});
