import { useState } from "react";
import { LuCamera, LuMapPin, LuPlus, LuX } from "react-icons/lu";
import LazyImage from "../../../components/LazyImage.jsx";

const inputClass =
  "mt-2 w-full rounded-lg border border-[#dddddd] bg-[#f7f7f7] px-4 py-3 text-sm text-[#222222] outline-none transition placeholder:text-[#717171] focus:border-[#222222] focus:ring-2 focus:ring-[#ff5a5f]/20 dark:border-[#514746] dark:bg-[#303030] dark:text-[#f3f0ef]";

const EditProfileModal = ({
  open,
  profile,
  uploading,
  saving,
  onClose,
  onSave,
  onAvatarChange,
  initials,
}) => {
  const [draft, setDraft] = useState({
    name: profile?.name || "",
    nickname: profile?.nickname || "",
    bio: profile?.bio || "",
    education: profile?.education || "",
    location: profile?.location || "",
    quote: profile?.quote || "",
    skills: profile?.skills || [],
  });
  const [skillInput, setSkillInput] = useState("");

  if (!open) return null;

  const changeField = (field) => (event) =>
    setDraft((current) => ({ ...current, [field]: event.target.value }));

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    setDraft((current) => {
      const exists = current.skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase(),
      );
      if (exists || current.skills.length >= 20) return current;
      return { ...current, skills: [...current.skills, skill].slice(0, 20) };
    });
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) =>
    setDraft((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));

  const submitDraft = () => onSave(draft);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1b1c1c]/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[#ebebeb] bg-white shadow-[0_12px_40px_rgba(34,34,34,0.18)] dark:border-[#393333] dark:bg-[#242323] sm:max-w-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebebeb] bg-white px-5 py-4 dark:border-[#393333] dark:bg-[#242323] sm:px-7">
          <h2 className="text-xl font-bold text-[#222222] dark:text-[#fcf9f8]">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit profile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#717171] transition hover:bg-[#f7f7f7] hover:text-[#222222] dark:text-[#d3c4c3] dark:hover:bg-[#303030] dark:hover:text-white"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="flex items-center gap-4">
            {profile?.img ? (
              <LazyImage
                src={profile.img}
                alt={profile.name || "Profile"}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ffdad8] text-xl font-bold text-[#b52330] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
                {initials}
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#dddddd] px-4 py-2.5 text-sm font-semibold text-[#222222] transition hover:bg-[#f7f7f7] dark:border-[#514746] dark:text-[#f3f0ef] dark:hover:bg-[#303030]">
              <LuCamera size={18} />
              {uploading ? "Uploading..." : "Change photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={onAvatarChange}
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1]">
              Name
              <input
                value={draft.name}
                onChange={changeField("name")}
                maxLength={80}
                className={inputClass}
                placeholder="Your name"
              />
            </label>
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1]">
              Nickname
              <input
                value={draft.nickname}
                onChange={changeField("nickname")}
                maxLength={40}
                className={inputClass}
                placeholder="@nickname"
              />
            </label>
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1] sm:col-span-2">
              Location
              <span className="relative mt-2 block">
                <LuMapPin className="absolute left-3 top-3.5 text-[#717171]" size={17} />
                <input
                  value={draft.location}
                  onChange={changeField("location")}
                  maxLength={100}
                  className={`${inputClass} mt-0 pl-10`}
                  placeholder="City, country"
                />
              </span>
            </label>
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1] sm:col-span-2">
              Education
              <input
                value={draft.education}
                onChange={changeField("education")}
                maxLength={120}
                className={inputClass}
                placeholder="School or university"
              />
            </label>
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1] sm:col-span-2">
              Bio
              <textarea
                value={draft.bio}
                onChange={changeField("bio")}
                rows={4}
                maxLength={300}
                className={`${inputClass} resize-none`}
                placeholder="Tell the community about yourself"
              />
              <span className="mt-1 block text-right text-xs font-normal text-[#717171]">
                {draft.bio?.length || 0}/300
              </span>
            </label>
            <label className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1] sm:col-span-2">
              Quote
              <textarea
                value={draft.quote}
                onChange={changeField("quote")}
                rows={2}
                maxLength={180}
                className={`${inputClass} resize-none`}
                placeholder="A quote that inspires you"
              />
              <span className="mt-1 block text-right text-xs font-normal text-[#717171]">
                {draft.quote?.length || 0}/180
              </span>
            </label>
            <div className="text-sm font-semibold text-[#222222] dark:text-[#e5e2e1] sm:col-span-2">
              Skills
              <div className="mt-2 flex gap-2">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  maxLength={40}
                  className="flex-1 rounded-lg border border-[#dddddd] bg-[#f7f7f7] px-4 py-3 text-sm font-normal text-[#222222] outline-none placeholder:text-[#717171] focus:border-[#222222] focus:ring-2 focus:ring-[#ff5a5f]/20 dark:border-[#514746] dark:bg-[#303030] dark:text-[#f3f0ef]"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!skillInput.trim() || draft.skills.length >= 20}
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff5a5f] text-white transition hover:bg-[#b52330] disabled:opacity-50"
                  aria-label="Add skill"
                >
                  <LuPlus size={19} />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ffb3b0] bg-[#ffe8e8] px-3 py-1.5 text-xs font-semibold text-[#b52330] dark:border-[#7d5153] dark:bg-[#3a2526] dark:text-[#ffb3b0]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#ffdad8] dark:hover:bg-[#493031]"
                    >
                      <LuX size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-right text-xs font-normal text-[#717171] dark:text-[#c7bdbb]">
                {draft.skills.length}/20 skills
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#ebebeb] bg-white px-5 py-4 dark:border-[#393333] dark:bg-[#242323] sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#222222] px-5 py-2.5 text-sm font-semibold text-[#222222] transition hover:bg-[#f7f7f7] dark:border-[#d3c4c3] dark:text-[#f3f0ef] dark:hover:bg-[#303030]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitDraft}
            disabled={saving}
            className="rounded-lg bg-[#ff5a5f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b52330] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
