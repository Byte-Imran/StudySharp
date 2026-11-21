import axiosInstance from "../../../utils/axiosInstance.js";

export const getProfile = () =>
  axiosInstance.get("/api/v1/users/me");

export const getFollowers = (userId) =>
  axiosInstance.get(`/api/v1/users/${userId}/followers`);

export const getFollowing = (userId) =>
  axiosInstance.get(`/api/v1/users/${userId}/following`);

export const updateProfile = (profile) =>
  axiosInstance.patch("/api/v1/users/me", profile);

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axiosInstance.patch("/api/v1/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
