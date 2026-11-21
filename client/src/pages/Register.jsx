import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuArrowRight,
  LuMail,
  LuLock,
  LuUser,
  LuEye,
  LuEyeOff,
  LuSparkles,
  LuShieldCheck,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { setUser } from "../redux/slices/authSlice.js";
import axiosInstance from "../utils/axiosInstance.js";

/* ---------- Animation variants ---------- */
const stagger = (delay = 0.07, start = 0.15) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ---------- Compact shared classes ---------- */
const inputWrap =
  "flex items-center rounded-lg border border-[#E5E0D5] bg-white transition focus-within:border-[#A66D4E] focus-within:ring-4 focus-within:ring-[#A66D4E]/10 dark:border-[#514746] dark:bg-[#1b1c1c] dark:focus-within:border-[#ff5a5f] dark:focus-within:ring-[#ff5a5f]/15";
const inputClass =
  "w-full bg-transparent px-3 py-2.5 text-sm text-[#292A23] outline-none placeholder:text-[#B6B3A8] dark:text-[#f3f0ef] dark:placeholder:text-[#aaa09f]";
const labelClass =
  "mb-1.5 block text-xs font-semibold text-[#414137] dark:text-[#e5e2e1]";

const providers = [
  { id: "google", label: "Google", Icon: FcGoogle },
  { id: "github", label: "GitHub", Icon: FaGithub },
];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/v1/users/register", form);
      dispatch(setUser(response.data.data.user));
      toast.success(response.data.message || "Account created successfully.");
      navigate("/");
    } catch (error) {
      setShakeKey((k) => k + 1);
      toast.error(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider) => {
    const baseURL = axiosInstance.defaults.baseURL || "";
    const normalizedBaseURL = String(baseURL).replace(/\/+$/, "");
    window.location.href = `${normalizedBaseURL}/api/v1/auth/${provider}`;
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F2EB] p-3 text-[#25251F] dark:bg-[#181818] dark:text-[#f3f0ef] sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FBFAF6] shadow-[0_25px_80px_rgba(45,40,30,0.09)] dark:border-[#393333] dark:bg-[#242323] dark:shadow-black/30 lg:grid-cols-2"
      >
        {/* ================= Left visual panel ================= */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#343B30] p-10 text-[#F5F2EB] lg:flex">
          <motion.div
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-dashed border-white/15"
          />
          <motion.div
            animate={reduceMotion ? {} : { rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10"
          />
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#B8795A]/25 blur-3xl"
          />

          {[
            { top: "28%", left: "12%", d: 0 },
            { top: "62%", left: "84%", d: 1.2 },
            { top: "80%", left: "30%", d: 2.2 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              style={{ top: dot.top, left: dot.left }}
              animate={
                reduceMotion ? {} : { y: [0, -14, 0], opacity: [0.3, 0.8, 0.3] }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: dot.d,
                ease: "easeInOut",
              }}
              className="absolute h-2 w-2 rounded-full bg-[#D6A17C]"
            />
          ))}

          <motion.div
            variants={stagger(0.12, 0.3)}
            initial="hidden"
            animate="show"
            className="relative z-10 flex h-full flex-col justify-between gap-8"
          >
            <motion.div variants={fadeLeft}>
              <Link to="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.08 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6A17C] text-[#25251F]"
                >
                  <LuSparkles size={21} />
                </motion.div>
                <span className="text-lg font-bold tracking-tight">
                  studySharp<span className="text-[#D6A17C]">.</span>
                </span>
              </Link>
            </motion.div>

            <div className="max-w-sm">
              <motion.span
                variants={fadeLeft}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] tracking-wider text-[#D6C9B6]"
              >
                <motion.span
                  animate={
                    reduceMotion
                      ? {}
                      : { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-[#D6A17C]"
                />
                YOUR LEARNING COMMUNITY
              </motion.span>

              <motion.h2
                variants={fadeLeft}
                className="text-4xl font-semibold leading-[1.15] tracking-tight"
              >
                Great things happen when{" "}
                <span className="font-serif italic text-[#D6A17C]">
                  minds connect.
                </span>
              </motion.h2>

              <motion.p
                variants={fadeLeft}
                className="mt-4 text-sm leading-6 text-[#D1D0C5]"
              >
                Share doubts, exchange ideas, and grow together with a community
                that keeps you curious.
              </motion.p>
            </div>

            <motion.div
              variants={fadeLeft}
              className="flex items-center gap-4 border-t border-white/15 pt-5"
            >
              <div className="flex -space-x-3">
                {["A", "S", "M", "R"].map((item, index) => (
                  <motion.div
                    key={item}
                    animate={reduceMotion ? {} : { y: [0, -4, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut",
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#343B30] bg-[#D6A17C] text-xs font-bold text-[#343B30]"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">Learn together</p>
                <p className="text-xs text-[#C4C1B5]">
                  Build meaningful connections
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ================= Register form ================= */}
        <div className="flex items-center justify-center px-6 py-6 sm:px-10">
          <motion.div
            variants={stagger(0.07, 0.35)}
            initial="hidden"
            animate="show"
            className="w-full max-w-sm"
          >
            <motion.div variants={fadeUp}>
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-2 lg:hidden"
              >
                <LuSparkles className="text-[#A66D4E] dark:text-[#ffb3b0]" size={20} />
                <span className="text-lg font-bold">studySharp.</span>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A66D4E] dark:text-[#ffb3b0]">
                Get started
              </span>
              <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-[#292A23] dark:text-[#fcf9f8]">
                Create your account<span className="text-[#B8795A]">.</span>
              </h1>
              <p className="mt-1.5 text-xs text-[#858477] dark:text-[#c7bdbb]">
                A little step today. A bigger journey tomorrow.
              </p>
            </motion.div>

            {/* OAuth buttons */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
              {providers.map(({ id, label, Icon }) => (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => handleOAuth(id)}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 8px 20px rgba(52,59,48,0.12)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] bg-white px-3 py-2.5 text-sm font-semibold text-[#414137] transition-colors hover:border-[#A66D4E]/50 dark:border-[#514746] dark:bg-[#303030] dark:text-[#f3f0ef] dark:hover:border-[#ff5a5f]/60"
                >
                  <Icon
                    size={18}
                    className={
                      id === "github"
                        ? "text-[#25251F] dark:text-[#f3f0ef]"
                        : ""
                    }
                  />
                  {label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="my-3.5 flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-[#E9E5DC] dark:bg-[#514746]" />
              <span className="text-[10px] tracking-wider text-[#A6A394] dark:text-[#aaa09f]">
                OR WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-[#E9E5DC] dark:bg-[#514746]" />
            </motion.div>

            {/* Form (shake on error) */}
            <motion.form
              key={shakeKey}
              onSubmit={handleSubmit}
              className="space-y-3"
              animate={shakeKey ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.45 }}
            >
              {/* Name */}
              <motion.label variants={fadeUp} className="block">
                <span className={labelClass}>Full name</span>
                <div className={inputWrap}>
                  <LuUser className="ml-3 shrink-0 text-[#A6A394] dark:text-[#aaa09f]" size={17} />
                  <input
                    className={inputClass}
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </motion.label>

              {/* Email */}
              <motion.label variants={fadeUp} className="block">
                <span className={labelClass}>Email address</span>
                <div className={inputWrap}>
                  <LuMail className="ml-3 shrink-0 text-[#A6A394] dark:text-[#aaa09f]" size={17} />
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.label>

              {/* Password */}
              <motion.label variants={fadeUp} className="block">
                <span className={labelClass}>Password</span>
                <div className={inputWrap}>
                  <LuLock className="ml-3 shrink-0 text-[#A6A394] dark:text-[#aaa09f]" size={17} />
                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="mr-3 text-[#A6A394] transition hover:text-[#A66D4E] dark:text-[#aaa09f] dark:hover:text-[#ffb3b0]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <LuEyeOff size={17} />
                    ) : (
                      <LuEye size={17} />
                    )}
                  </button>
                </div>
              </motion.label>

              {/* Submit */}
              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={submitting}
                whileHover={submitting ? {} : { scale: 1.02 }}
                whileTap={submitting ? {} : { scale: 0.97 }}
                className="group flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#343B30] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#343B30]/10 transition-colors duration-300 hover:bg-[#48523F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <LuArrowRight
                      className="transition-transform group-hover:translate-x-1"
                      size={17}
                    />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.p
              variants={fadeUp}
              className="mt-3.5 text-center text-xs text-[#858477] dark:text-[#c7bdbb]"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#A66D4E] transition hover:text-[#805038] dark:text-[#ffb3b0] dark:hover:text-[#ffdad8]"
              >
                Sign in
              </Link>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[#A6A394] dark:text-[#aaa09f]"
            >
              <LuShieldCheck size={14} />
              Your information is protected.
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
