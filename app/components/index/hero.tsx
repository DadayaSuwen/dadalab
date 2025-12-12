"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

/**
 * Hero - 客户端组件
 * 3D Tilt Card + Depth Typography
 */
export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    // Calculate normalized position (-1 to 1)
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Smooth spring physics for rotation
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), {
    damping: 15,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), {
    damping: 15,
    stiffness: 150,
  });

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white perspective-1000"
      style={{ perspective: "1200px" }} // Critical for 3D effect
    >
      {/* 0. Noise Grain Overlay (Cinematic Feel) */}
      <div
        className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
      />

      {/* 1. Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* 2. Massive Background Typography (Parallax Layer Back) */}
      <motion.div
        style={{ y: y1, opacity: opacityText }}
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 select-none"
      >
        <div className="w-full max-w-[90vw] flex justify-between items-start leading-none opacity-20 md:opacity-40">
          <h1 className="text-[18vw] font-black tracking-tighter text-white mix-blend-overlay">
            DIGITAL
          </h1>
        </div>
        <div className="w-full max-w-[90vw] flex justify-end items-end leading-none mt-[-5vw] opacity-20 md:opacity-40">
          <h1 className="text-[18vw] font-black tracking-tighter text-white mix-blend-overlay">
            ALCHEMIST
          </h1>
        </div>
      </motion.div>

      {/* 3. Central 3D Interactive Card (The "Portal") */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 w-[85vw] h-[50vh] md:w-[600px] md:h-[400px] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10 group"
      >
        {/* The "Content" inside the card - Abstract Video/Image */}
        <div className="absolute inset-0 bg-neutral-800">
          <Image
            alt="哒哒工作室 - 高端商业网站建设展示"
            width={1920}
            height={1080}
            src="/image/hero.jpg"
            priority
          />
          {/* Gradient Overlay inside card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        </div>

        {/* Floating Elements inside the 3D Card (Parallax Depth) */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 transform translate-z-20"
          style={{ transform: "translateZ(50px)" }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-lime-400">
                联系我开始实现
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
              使用next <br /> 构建高性能的web
            </h2>
          </motion.div>
        </div>

        {/* Play Button Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
            <Play className="w-6 h-6 fill-white text-white ml-1" />
          </div>
        </div>
      </motion.div>

      {/* 4. Bottom Info Strip */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-10 left-0 w-full px-6 md:px-12 flex justify-between items-end z-10 pointer-events-none"
      >
        <div className="hidden md:block max-w-xs text-xs font-mono text-neutral-500">
          BASED IN GUANZHOU <br />
          SPECIALIZED IN REACT & NEXT.JS
        </div>
        <div className="text-right">
          <p className="text-neutral-400 text-sm md:text-base pointer-events-auto cursor-pointer hover:text-white transition-colors">
            SCROLL TO EXPLORE
          </p>
        </div>
      </motion.div>
    </section>
  );
}
