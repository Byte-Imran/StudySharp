import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b52330] dark:text-[#ff5a5f]">
      Error 404
    </p>
    <h1 className="mt-4 text-5xl font-bold text-[#1b1c1c] dark:text-[#fcf9f8]">
      Page not found
    </h1>
    <p className="mt-4 text-[#5a403f] dark:text-[#d3c4c3]">
      The page you are looking for does not exist.
    </p>
    <Link
      className="mt-8 rounded-lg bg-[#ff5a5f] px-6 py-3 font-semibold text-white transition hover:bg-[#b52330]"
      to="/"
    >
      Back to home
    </Link>
  </section>
);

export default NotFound;
