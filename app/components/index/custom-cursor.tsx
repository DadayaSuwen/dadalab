"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom Cursor - 客户端组件
 * 鼠标跟随效果
 */
export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: { clientX: number; clientY: number }) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    >
      <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
}
