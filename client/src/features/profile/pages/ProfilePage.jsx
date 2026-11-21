import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  LuArrowLeft,
  LuCamera,
  LuGraduationCap,
  LuMapPin,
  LuPencil,
  LuSparkles,
  LuUsers,
  LuUserPlus,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LazyImage from "../../../components/LazyImage.jsx";
import { setUser } from "../../../redux/slices/authSlice.js";
import EditProfileModal from "../components/EditProfileModal.jsx";
import {
  getFollowers,
  getFollowing,
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../services/profileApi.js";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(reduxUser);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeList, setActiveList] = useState("followers");
  const [editOpen, setEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!reduxUser?.id) return;

    const loadProfile = async () => {
      try {
        const [profileResponse, followersResponse, followingResponse] =
          await Promise.all([
            getProfile(),
            getFollowers(reduxUser.id),
            getFollowing(reduxUser.id),
          ]);

        const currentUser = profileResponse.data.data.user;
        setProfile(currentUser);
        dispatch(setUser(currentUser));
        setFollowers(followersResponse.data.data);
        setFollowing(followingResponse.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load profile.");
      }
    };

    loadProfile();
  }, [dispatch, reduxUser?.id]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadProfileImage(file);
      const img = response.data.data.img;
      const updatedUser = { ...profile, ...reduxUser, img };
      setProfile(updatedUser);
      dispatch(setUser(updatedUser));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to upload profile image.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (draft) => {
    if (!draft.name?.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const response = await updateProfile(draft);
      const updatedUser = response.data.data.user;
      setProfile(updatedUser);
      dispatch(setUser(updatedUser));
      setEditOpen(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const nameParts = (profile?.name || "").trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0] || "US").slice(0, 2).toUpperCase();

  const visibleUsers = activeList === "following" ? following : followers;

  return (
    <main className="min-h-screen bg-[#fcf9f8] px-4 py-6 text-[#222222] dark:bg-[#1b1c1c] dark:text-[#f3f0ef] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ebebeb] bg-white text-[#222222] transition hover:bg-[#f7f7f7] dark:border-[#393333] dark:bg-[#242323] dark:text-[#f3f0ef]"
            aria-label="Go back"
          >
            <LuArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#222222] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#f7f7f7] dark:border-[#d3c4c3] dark:hover:bg-[#303030]"
          >
            <LuPencil size={16} />
            Edit profile
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#ebebeb] bg-white shadow-[0_6px_20px_rgba(34,34,34,0.08)] dark:border-[#393333] dark:bg-[#242323]">
          <div className="h-44 bg-[#ffdad8] dark:bg-[#3a2526] sm:h-52" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="flex flex-col items-start gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="relative -mt-14 sm:mt-0">
                {profile?.img ? (
                  <LazyImage
                    src={profile.img}
                    alt={profile.name || "Profile"}
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-[0_6px_20px_rgba(34,34,34,0.08)] dark:border-[#242323]"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#ffdad8] text-3xl font-bold text-[#b52330] dark:border-[#242323] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  aria-label="Upload profile image"
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#b52330] text-white transition hover:bg-[#92001b] disabled:opacity-60 dark:border-[#242323]"
                >
                  <LuCamera size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="pb-1 sm:text-right">
                <h1 className="text-3xl font-bold tracking-tight">
                  {profile?.name || "Profile"}
                </h1>
                {profile?.nickname && (
                  <p className="mt-1 text-sm font-semibold text-[#b52330] dark:text-[#ffb3b0]">
                    @{profile.nickname}
                  </p>
                )}
                <p className="mt-1 text-sm text-[#717171] dark:text-[#c7bdbb]">
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#ebebeb] lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)] dark:border-[#393333]">
            <div className="border-b border-[#ebebeb] p-5 sm:p-8 lg:border-b-0 lg:border-r dark:border-[#393333]">
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#717171] dark:text-[#c7bdbb]">
                {profile?.bio || "No bio added yet."}
              </p>
              {profile?.quote && (
                <blockquote className="mt-5 border-l-4 border-[#ff5a5f] pl-4 text-base font-semibold italic leading-7 text-[#222222] dark:text-[#f3f0ef]">
                  “{profile.quote}”
                </blockquote>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {profile?.education && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f7f7] px-3 py-2 text-sm text-[#222222] dark:bg-[#303030] dark:text-[#f3f0ef]">
                    <LuGraduationCap size={17} className="text-[#ff5a5f]" />
                    {profile.education}
                  </span>
                )}
                {profile?.location && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f7f7] px-3 py-2 text-sm text-[#222222] dark:bg-[#303030] dark:text-[#f3f0ef]">
                    <LuMapPin size={17} className="text-[#ff5a5f]" />
                    {profile.location}
                  </span>
                )}
              </div>
              <div className="mt-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#222222] dark:text-[#f3f0ef]">
                  <LuSparkles size={16} className="text-[#ff5a5f]" />
                  Skills
                </h3>
                {profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#e2bebc] bg-[#ffe8e8] px-3 py-1.5 text-xs font-semibold text-[#b52330] dark:border-[#7d5153] dark:bg-[#3a2526] dark:text-[#ffb3b0]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#717171] dark:text-[#c7bdbb]">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex gap-2 border-b border-[#ebebeb] dark:border-[#393333]">
                <button
                  type="button"
                  onClick={() => setActiveList("followers")}
                  className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold ${
                    activeList === "followers"
                      ? "border-[#ff5a5f] text-[#b52330] dark:text-[#ffb3b0]"
                      : "border-transparent text-[#717171]"
                  }`}
                >
                  <LuUsers size={17} />
                  Followers
                  <span>{followers.length}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveList("following")}
                  className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold ${
                    activeList === "following"
                      ? "border-[#ff5a5f] text-[#b52330] dark:text-[#ffb3b0]"
                      : "border-transparent text-[#717171]"
                  }`}
                >
                  <LuUserPlus size={17} />
                  Following
                  <span>{following.length}</span>
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {visibleUsers.length ? (
                  visibleUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#f7f7f7] dark:hover:bg-[#303030]"
                    >
                      {user.img ? (
                        <LazyImage
                          src={user.img}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdad8] text-xs font-bold text-[#b52330] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
                          {(user.name || "US").slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-[#717171] dark:text-[#c7bdbb]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-[#717171] dark:text-[#c7bdbb]">
                    No users found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {editOpen && (
        <EditProfileModal
          open
          profile={profile}
          uploading={uploading}
          saving={saving}
          initials={initials}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </main>
  );
};

export default ProfilePage;
