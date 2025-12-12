"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from "framer-motion";

// Utility function
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

/**
 * Velocity Marquee - 客户端组件
 * Advanced Marquee with scroll-based velocity
 */
export default function VelocityMarquee() {
  // Internal Component for a single moving line
  const ParallaxText = ({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity?: number }) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    });

    // Map scroll speed to marquee speed
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false,
    });

    /**
     * The magic of infinite scroll:
     * We move 'baseX' constantly in the animation frame.
     * We also add the scroll velocity to it.
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);

    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      // Change direction based on scroll direction if desired (optional, keeping it simple here)
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();

      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 leading-[0.8]">
        <motion.div
          className="flex whitespace-nowrap gap-10 md:gap-20"
          style={{ x }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="block">
              {children}
            </span>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-neutral-950 overflow-hidden border-t border-b border-neutral-800">
      <div className="rotate-2 origin-center scale-110">
        {/* Row 1: Left to Right */}
        <div className="mb-4 md:mb-8 text-neutral-800 font-black text-6xl md:text-9xl uppercase tracking-tighter opacity-80">
          <ParallaxText baseVelocity={-2}>
            Creative Development • Interaction Design •
          </ParallaxText>
        </div>

        {/* Row 2: Right to Left (Lime Outline Style) */}
        <div
          className="text-transparent font-black text-6xl md:text-9xl uppercase tracking-tighter"
          style={{ WebkitTextStroke: "2px #a3e635" }}
        >
          <ParallaxText baseVelocity={2}>
            Next.js Experts • High Performance •
          </ParallaxText>
        </div>
      </div>
    </section>
  );
}