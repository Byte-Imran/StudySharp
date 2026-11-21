import { motion } from "framer-motion";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Home = () => (
  <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-20 text-[#1b1c1c] dark:text-[#fcf9f8]">
    <motion.div
      className="max-w-3xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#e2bebc] bg-[#ffdad8] px-4 py-2 text-sm text-[#b52330] dark:border-[#5a403f] dark:bg-[#3a2526] dark:text-[#ffb3b0]">
        <HiOutlineUserGroup className="text-xl" />
        Make room for better conversations
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-[#1b1c1c] dark:text-[#fcf9f8] sm:text-7xl">
        Find your people.
        <span className="block text-[#b52330] dark:text-[#ff5a5f]">
          Build something together.
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a403f] dark:text-[#d3c4c3]">
        Join a community, share what you care about, and connect with people
        who get it.
      </p>
      <Link
        to="/register"
        className="mt-9 inline-flex rounded-lg bg-[#ff5a5f] px-6 py-3 font-semibold text-white transition hover:bg-[#b52330]"
      >
        Create your account
      </Link>
    </motion.div>
  </section>
);

export default Home;
