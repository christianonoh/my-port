import React from "react";
import { CircularText } from "../icons";
import Link from "next/link";

const HireMe = () => {
  return (
    <div className="fixed left-4 bottom-4 flex justify-center items-center overflow-hidden">
      <div className="w-40 h-auto flex items-center justify-center relative">
        <CircularText className="fill-light animate-spin-slow" />
        <Link
          href={`mailto:chibyk5000@gmail.com`}
          passHref
          className="flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark border border-solid text-light rounded-full font-semibold w-20 h-20 hover:bg-light hover:text-dark transition-all duration-300"
        >
          Hire me
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
