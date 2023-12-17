"use client";

import Link from "next/link";
import logo from "/public/logo.svg";
import Image from "next/image";
import { useThemeSwitch } from "../hooks/useThemeSwitch";
import { useState } from "react";
import { cx, siteMetadata } from "@/utils";
import {
  ThemeButton,
  FacebookIcon,
  Hamburger,
  TwitterIcon,
  LinkedinIcon,
  XIcon,
  GithubIcon,
} from "../icons";

const Navbar = () => {
  const [mode, setMode] = useThemeSwitch();
  const [toggled, setToggled] = useState(false);

  const handleToggle = () => {
    setToggled((prev) => {
      return !prev;
    });
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg px-6 dark:bg-dark/80 bg-light/80 sm:py-6 py-4 border-b md:px-16 dark:border-gray border-gray-light">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="">
          <Image
            src={logo}
            alt="logo"
            height={40}
            className="border-2 border-solid rounded-full border-dark"
          />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <ThemeButton mode={mode} setMode={setMode} />

          {/* Desktop Navbar */}
          <ul className="sm:flex items-center gap-x-8 hidden ">
            <li>
              <Link
                href="/about"
                className="duration-300 dark:hover:text-accent hover:text-accent-dark"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="duration-300 dark:hover:text-accent hover:text-accent-dark"
              >
                Projects
              </Link>
            </li>
          </ul>

          {/* Mobile Navbar */}
          <div
            className={cx(
              toggled ? "scale-y-100 origin-top" : "scale-y-0 origin-top",
              "flex sm:hidden flex-col justify-around w-full dark:bg-dark/90 bg-light/90 shadow-sm absolute z-10 left-0 height__screen transform transition-transform duration-300 ease-in-out top-0"
            )}
          >
            <ul className="max-w-sm mx-auto flex items-center gap-4 flex-col w-full tracking-wider font-bold text-gray-dark dark:text-white text-lg px-5 mt-20 backdrop-blur-md">
              <li
                className="w-full flex items-center flex-col "
                onClick={handleToggle}
              >
                <Link
                  href="/about"
                  className="duration-300 hover:text-accent-dark dark:hover:text-accent py-6 text-3xl font-semibold text-center border-b-2 border-gray/10 border-spacing-x-4 "
                >
                  About
                </Link>
              </li>
              <li
                className="w-full flex items-center flex-col "
                onClick={handleToggle}
              >
                <Link
                  href="/projects"
                  className="duration-300 hover:text-accent-dark dark:hover:text-accent py-6 text-3xl font-semibold text-center border-b-2 border-gray/10 border-spacing-x-4 "
                >
                  Projects
                </Link>
              </li>
            </ul>
            <span className="flex gap-8 items-center   mt-12 mx-auto">
              <a href={siteMetadata.twitter} target="_blank">
                <XIcon
                  className="h-6 w-auto fill-dark dark:fill-light hover:fill-accent-dark dark:hover:fill-accent hover:bg-gray/10 dark:hover:bg-light/10  transition-all duration-300 ease-in-out"
                  onClick={handleToggle}
                />
              </a>
              <a href={siteMetadata.github} target="_blank">
                <GithubIcon
                  className="h-6 w-auto hover:fill-accent-dark  fill-dark dark:fill-light dark:hover:fill-accent hover:bg-gray/10 dark:hover:bg-light/10  transition-all duration-300 ease-in-out"
                  onClick={handleToggle}
                />
              </a>
              <a href={siteMetadata.linkedin} target="_blank">
                <LinkedinIcon
                  className="h-6 w-auto hover:fill-accent-dark dark:hover:fill-accent  fill-dark dark:fill-light hover:bg-gray/10 dark:hover:bg-light/10  transition-all duration-300 ease-in-out"
                  onClick={handleToggle}
                />
              </a>
            </span>
          </div>
          <Hamburger handleToggle={handleToggle} toggled={toggled} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
