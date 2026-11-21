import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 characters long"],
      default: null,
      required: function () {
        return !this.googleId && !this.githubId;
      },
    },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    gender: { type: String, enum: ["male", "female"] },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    location: { type: String, default: "" },
    nickname: { type: String, default: "" },
    img: { type: String, default: "" },

    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);

export default User;
