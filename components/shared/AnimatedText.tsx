"use client";

import { motion } from "framer-motion";
import Highlight from "./Highlight";

const quote = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const singleWord = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};

const AnimatedText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <div className="w-full mx-auto flex py-2 items-center overflow-hidden">
    <motion.h1
      variants={quote}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`inline-block w-full dark:text-light text-gray-dark  font-bold capitalize text-8xl ${className}`}
    >
      <Highlight>
        {text.split(" ").map((word, index) => (
        <motion.span
          variants={singleWord}
          key={word + "-" + index}
          className="inline-block my-1"
        >
          {word === "/n" ? <br /> : word}&nbsp;
        </motion.span>
      ))}
      </Highlight>
    </motion.h1>
  </div>
);

export default AnimatedText;
