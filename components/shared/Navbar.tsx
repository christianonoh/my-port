"use client";

import Link from "next/link";
import logo from "/public/logo.svg";
import Image from "next/image";
import { useOptimisticTheme } from "../../hooks/useOptimisticTheme";
import { useState } from "react";
import { cx } from "@/utils";
import {
  ThemeButton,
  Hamburger,
  LinkedinIcon,
  XIcon,
  GithubIcon,
} from "../icons";
import siteMetadata from "@/utils/siteMetaData";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

const socialLinks = [
  { href: siteMetadata.twitter, icon: XIcon, label: "Twitter" },
  { href: siteMetadata.github, icon: GithubIcon, label: "Github" },
  { href: siteMetadata.linkedin, icon: LinkedinIcon, label: "Linkedin" },
];

const Navbar = () => {
  const { theme, toggleTheme, isPending } = useOptimisticTheme();
  const [toggled, setToggled] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    document.documentElement.classList.toggle("overflow-hidden");
    setToggled((prev) => !prev);
  };

  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-30 font-outfit backdrop-blur-lg px-6 dark:bg-dark/80 bg-light/80 sm:py-6 py-4 border-b md:px-16 dark:border-gray-dark/50 border-gray-light/50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            height={40}
            className="border-2 border-solid rounded-full border-dark"
          />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <ThemeButton
            mode={theme}
            setMode={toggleTheme}
            isPending={isPending}
          />

          <span className="nav__item sm:hidden">
            <Link
              href="/blog"
              className={cx(
                isActive("/blog") ? "active" : "",
                "duration-300 dark:hover:text-accent hover:text-accent-dark font-semibold text-base lg:text-lg tracking-wide"
              )}
            >
              Blog
            </Link>
          </span>

          {/* Desktop Navbar */}
          <ul className="sm:flex items-center gap-x-8 hidden">
            {navLinks.map((link) => (
              <li key={link.href} className="nav__item relative">
                <Link
                  href={link.href}
                  className={cx(
                    "duration-300 dark:hover:text-accent hover:text-accent-dark font-semibold text-base lg:text-lg tracking-wide group overflow-hidden inline-block"
                  )}
                >
                  <span className="relative">
                    {link.label}
                    {/* Animated underline */}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-0.5 bg-accent dark:bg-accent"
                      initial={false}
                      animate={{
                        width: isActive(link.href) ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          <AnimatePresence>
            {toggled && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="flex sm:hidden flex-col justify-around w-full dark:bg-dark/95 bg-light/95 backdrop-blur-xl shadow-sm fixed z-10 left-0 height__screen top-0"
              >
                <ul className="max-w-sm mx-auto flex items-center gap-4 flex-col w-full tracking-wide font-bold text-gray-dark dark:text-white text-lg px-5 mt-20">
                  {[...navLinks, { href: "/contact", label: "Contact" }].map(
                    (link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="w-full flex items-center flex-col"
                        onClick={handleToggle}
                      >
                        <Link
                          href={link.href}
                          className={cx(
                            isActive(link.href)
                              ? "text-accent"
                              : "",
                            "duration-300 hover:text-accent-dark dark:hover:text-accent py-6 text-3xl font-bold text-center border-b-2 border-gray/10 border-spacing-x-4 tracking-wide"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    )
                  )}
                </ul>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-8 items-center mt-12 mx-auto"
                >
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        aria-label={`Connect with me on ${social.label}`}
                      >
                        <Icon
                          className="h-6 w-auto fill-dark dark:fill-light hover:fill-accent-dark dark:hover:fill-accent transition-all duration-300 ease-in-out"
                          onClick={handleToggle}
                        />
                      </a>
                    );
                  })}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          <Hamburger handleToggle={handleToggle} toggled={toggled} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
