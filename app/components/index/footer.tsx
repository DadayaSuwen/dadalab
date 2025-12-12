"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FooterStatic from "./footer-static";

// Helper: Magnetic Component for Footer Button
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      position.x.set(middleX * 0.35); // Adjust magnetic strength
      position.y.set(middleY * 0.35);
    }
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ x, y }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Footer - 客户端组件
 * Fixed Reveal + Magnetic Button + Local Time
 */
export default function Footer() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]); // Reveal parallax

  // Live Time Logic
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const options = {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      } as const;
      setTime(date.toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={container}
      id="footer"
      className="relative h-[800px] bg-neutral-950"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* The Fixed Footer Content */}
      <div className="fixed bottom-0 h-[800px] w-full z-0">
        <div className="h-full w-full bg-lime-500 flex flex-col justify-between px-6 py-12 md:p-20 text-black">
          {/* Top Section: CTA + Magnetic Button */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-20 md:mt-0">
            <div className="w-full md:w-auto">
              <h2 className="text-[14vw] md:text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mb-8">
                Let&apos;s <br /> Go
              </h2>
            </div>

            {/* Magnetic Button */}
            <div className="relative z-20">
              <Magnetic>
                <a
                  href="mailto:hello@dadastudio.com"
                  className="w-48 h-48 md:w-64 md:h-64 bg-black rounded-full flex items-center justify-center text-white cursor-pointer group transition-all duration-300 hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    <span className="text-lg font-bold uppercase tracking-widest">
                      Get in touch
                    </span>
                    <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300 text-lime-400" />
                  </div>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Bottom Section: Info Grid */}
          <FooterStatic />

          {/* Background Deco */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black opacity-[0.03] pointer-events-none select-none">
            DADA
          </div>
        </div>
      </div>
    </div>
  );
}
