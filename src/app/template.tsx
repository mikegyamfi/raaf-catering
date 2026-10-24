"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

// The first page load is handled by the preloader; only later navigations animate.
// (This also keeps the prerendered HTML fully visible.)
let firstLoad = true;

/** Route transition: each new page settles in softly from below. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const skip = firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  return (
    <motion.div
      initial={skip ? false : reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      transition={{ duration: reduce ? 0.4 : 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
