import { useState } from "react";
import { LuBookOpen, LuChevronDown, LuGlobe } from "react-icons/lu";
import {
  brand,
  copyright,
  cta,
  footerColumns,
  newsletter,
  socials,
  stores,
} from "../data/footerData.js";

const linkClass =
  "text-sm text-[#1b1c1c] underline-offset-4 transition-colors hover:text-[#b52330] hover:underline dark:text-[#e5e2e1] dark:hover:text-[#ff5a5f]";
const currentYear = new Date().getFullYear();

const HelpIllustration = () => (
  <svg
    className="h-28 w-36"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.2"
    viewBox="0 0 160 120"
  >
    <path d="M24 38c0-6.6 5.4-12 12-12h44c6.6 0 12 5.4 12 12v22c0 6.6-5.4 12-12 12H50l-14 10v-10h0c-6.6 0-12-5.4-12-12V38z" />
    <path d="M44 44h28M44 54h18" />
    <path d="M76 74h42c6.6 0 12 5.4 12 12v10c0 6.6-5.4 12-12 12h-4v8l-11-8H76c-6.6 0-12-5.4-12-12V86c0-6.6 5.4-12 12-12z" />
    <path d="M104 28c8-4 18-4 26 0v32c-8-4-18-4-26 0V28z" />
    <path d="M130 28c8-4 18-4 26 0v32c-8-4-18-4-26 0" />
  </svg>
);

const Footer = () => {
  const [openCols, setOpenCols] = useState({});
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("");

  const toggleColumn = (title) =>
    setOpenCols((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleSubscribe = (event) => {
    event.preventDefault();
    // TODO: yahan newsletter API call lagao
    setStatus(newsletter.success);
    setEmail("");
    setAgreed(false);
  };

  return (
    <footer className="w-full bg-[#fcf9f8] font-sans text-[#1b1c1c] dark:bg-[#1b1c1c] dark:text-[#f3f0ef]">
      {/* ============ CTA banner ============ */}
      <section className="w-full bg-[#ffdad8] px-6 py-16 dark:bg-[#3a2526] lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#1b1c1c] dark:text-[#fcf9f8]">
              {cta.title}
            </h2>
            <p className="mt-2 text-base text-[#5a403f] dark:text-[#e5d8d7]">
              {cta.text}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={cta.primary.href}
                className="inline-flex items-center justify-center rounded-lg bg-[#ff5a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b52330]"
              >
                {cta.primary.label}
              </a>
              <a
                href={cta.secondary.href}
                className="inline-flex items-center justify-center rounded-lg border border-[#e2bebc] bg-white px-6 py-3 text-sm font-semibold text-[#b52330] shadow-sm transition-colors hover:bg-[#f6f3f2] dark:border-[#7d5153] dark:bg-[#242323] dark:text-[#ffb3b0] dark:hover:bg-[#303030]"
              >
                {cta.secondary.label}
              </a>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="shrink-0 text-[#b52330] dark:text-[#ffb3b0]"
          >
            <HelpIllustration />
          </div>
        </div>
      </section>

      {/* ============ Main links ============ */}
      <section className="w-full px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffdad8] text-[#b52330] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
                <LuBookOpen size={22} />
              </span>
              <span className="text-xl font-semibold tracking-tight">
                {brand.name}
              </span>
            </a>
            <p className="mt-3 text-sm text-[#5a403f] dark:text-[#d3c4c3]">
              {brand.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socials.map(({ id, label, href, Icon }) => (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  className="rounded-full bg-[#f6f3f2] p-2 text-[#5a403f] transition-colors hover:bg-[#ffdad8] hover:text-[#b52330] dark:bg-[#303030] dark:text-[#d3c4c3] dark:hover:bg-[#3a2526] dark:hover:text-[#ffb3b0]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {stores.map(({ id, small, label, href, Icon }) => (
                <a
                  key={id}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#ebebeb] bg-[#f6f3f2] px-3.5 py-2 shadow-sm transition-colors hover:bg-[#f0eded] dark:border-[#393333] dark:bg-[#242323] dark:hover:bg-[#303030]"
                >
                  <Icon size={18} className="text-[#5a403f] dark:text-[#d3c4c3]" />
                  <span className="flex flex-col leading-none">
                    <span className="text-[11px] font-medium tracking-wide text-[#5a403f] dark:text-[#d3c4c3]">
                      {small}
                    </span>
                    <span className="text-xs font-semibold">{label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns (mobile par accordion) */}
          {footerColumns.map((col) => {
            const isOpen = !!openCols[col.title];
            return (
              <div key={col.title} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleColumn(col.title)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-left md:pointer-events-none"
                >
                  <span className="text-base font-semibold text-[#1b1c1c] dark:text-[#fcf9f8]">
                    {col.title}
                  </span>
                  <LuChevronDown
                    size={20}
                    className={`text-[#5a403f] transition-transform dark:text-[#d3c4c3] md:hidden ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <ul
                  className={`${isOpen ? "flex" : "hidden"} mt-4 flex-col gap-3 md:flex`}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="w-full px-6 pb-12 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-2xl border border-[#ebebeb] bg-[#f6f3f2] p-6 shadow-[0_6px_20px_rgba(34,34,34,0.06)] dark:border-[#393333] dark:bg-[#242323] dark:shadow-black/20 lg:flex-row lg:items-center lg:p-8">
          <h3 className="text-xl font-semibold tracking-tight text-[#1b1c1c] dark:text-[#fcf9f8]">
            {newsletter.title}
          </h3>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-3 lg:w-auto"
          >
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="rounded-lg border border-[#dddddd] bg-white px-4 py-3 text-sm text-[#1b1c1c] shadow-sm outline-none placeholder:text-[#717171] focus:border-[#ff5a5f] focus:ring-2 focus:ring-[#ff5a5f]/20 dark:border-[#514746] dark:bg-[#1b1c1c] dark:text-[#f3f0ef] dark:placeholder:text-[#aaa09f] sm:w-72"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#ff5a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b52330]"
              >
                {newsletter.button}
              </button>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded accent-[#ff5a5f]"
              />
              <span className="text-xs text-[#5a403f] dark:text-[#d3c4c3]">
                {newsletter.consent}
              </span>
            </label>

            {status && (
              <p className="text-xs text-[#006c4c] dark:text-[#78fac4]">
                {status}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ============ Bottom bar ============ */}
      <section className="w-full border-t border-[#ebebeb] bg-[#f6f3f2] px-6 py-6 dark:border-[#393333] dark:bg-[#242323] lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[#5a403f] dark:text-[#d3c4c3] sm:flex-row">
          <p>
            © {currentYear} {brand.name}. {copyright}
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#1b1c1c] dark:hover:text-white"
            >
              <LuGlobe size={16} />
              English
            </button>
            <span className="inline-flex items-center gap-2">
              Status
              <span className="inline-block h-2 w-2 rounded-full bg-tertiary-container" />
            </span>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
