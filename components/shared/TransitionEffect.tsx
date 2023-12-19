"use client";
import { motion } from "framer-motion";

const TransitionEffect = () => {
  return (
    <>
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen bg-accent z-50"
        initial={{ x: "100%", width: "100%", display: "none" }}
        animate={{ x: "0%", width: "0%", display: "block" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen bg-black z-40"
        initial={{ x: "100%", width: "100%", display: "none" }}
        animate={{ x: "0%", width: "0%", display: "block" }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen bg-white z-30"
        initial={{ x: "100%", width: "100%", display: "none" }}
        animate={{ x: "0%", width: "0%", display: "block" }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
      />
    </>
  );
};

export default TransitionEffect;
