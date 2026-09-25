"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}