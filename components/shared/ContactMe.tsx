import React from "react";
import { CircularText } from "../icons";
import Link from "next/link";

const ContactMe = () => {
  return (
    <div className="fixed right-4 bottom-4 flex justify-center items-center overflow-hidden">
      <div className="sm:w-32 w-24 h-auto flex items-center justify-center relative">
        <CircularText className="dark:fill-light fill-dark animate-spin-slow" />
        <Link
          href="/contact"
          passHref
          className="text-center flex dark:hover:bg-dark dark:hover:text-light justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-light dark:text-dark bg-dark dark:border border-2 border-solid text-light rounded-full font-semibold w-16 h-16 sm:w-20 sm:h-20 text-sm sm:text-base hover:bg-light hover:text-dark transition-all duration-300"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
};

export default ContactMe;
