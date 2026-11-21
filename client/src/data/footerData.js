import {
  FaApple,
  FaDiscord,
  FaGithub,
  FaGooglePlay,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const brand = {
  name: "studySharp",
  tagline: "Learn together. Grow faster.",
};

export const cta = {
  title: "Still stuck on a doubt? Ask the community.",
  text: "Get answers from 10,000+ learners in minutes.",
  primary: { label: "Ask a Doubt", href: "#ask" },
  secondary: { label: "Join Community", href: "#community" },
};

// href ko apne real profile links se replace kar lena
export const socials = [
  {
    id: "instagram",
    label: "Instagram",
    href: "#instagram",
    Icon: FaInstagram,
  },
  { id: "x", label: "X", href: "#x", Icon: FaXTwitter },
  { id: "linkedin", label: "LinkedIn", href: "#linkedin", Icon: FaLinkedinIn },
  { id: "youtube", label: "YouTube", href: "#youtube", Icon: FaYoutube },
  { id: "discord", label: "Discord", href: "#discord", Icon: FaDiscord },
  { id: "github", label: "GitHub", href: "#github", Icon: FaGithub },
];

export const stores = [
  {
    id: "play",
    small: "GET IT ON",
    label: "Google Play",
    href: "#google-play",
    Icon: FaGooglePlay,
  },
  {
    id: "apple",
    small: "Download on",
    label: "App Store",
    href: "#app-store",
    Icon: FaApple,
  },
];

export const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Ask a Doubt", href: "#ask-doubt" },
      { label: "Solve Doubts", href: "#solve-doubts" },
      { label: "Community Chat", href: "#community-chat" },
      { label: "Study Rooms", href: "#study-rooms" },
      { label: "Leaderboard", href: "#leaderboard" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Explore Topics", href: "#explore-topics" },
      { label: "Top Contributors", href: "#top-contributors" },
      { label: "Mentors", href: "#mentors" },
      { label: "Blog & Guides", href: "#blog-guides" },
      { label: "Events & Webinars", href: "#events-webinars" },
    ],
  },
  {
    title: "Company & Support",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Help Center / FAQ", href: "#help" },
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Community Guidelines", href: "#guidelines" },
    ],
  },
];

export const newsletter = {
  title: "Get weekly study tips & doubt highlights",
  placeholder: "Enter your email address",
  button: "Subscribe",
  consent: "I agree to the Terms & Privacy Policy",
  success:
    "Thanks for subscribing! Check your inbox for weekly study highlights.",
};

export const copyright = "Made for learners, by learners.";
