"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FooterStatic from "./footer-static";
import Link from "next/link";

// 1. 独立的时间组件：隔离每秒一次的重渲染
// 使用 memo 确保父组件滚动时，时间组件不会无意义重绘（虽然它自己会每秒更新）
const TimeDisplay = memo(() => {
  const [time, setTime] = useState("");

  useEffect(() => {
    // 避免服务端水合不匹配，组件挂载后再开始计时
    const updateTime = () => {
      const date = new Date();
      setTime(
        date.toLocaleTimeString("en-US", {
          timeZone: "Asia/Shanghai",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 如果为了避免布局抖动，可以给一个固定宽度或默认占位符
  return <span className="tabular-nums">{time}</span>;
});

TimeDisplay.displayName = "TimeDisplay";

// 2. 磁吸按钮组件优化
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 使用 spring 替代直接 set，让鼠标离开时的复位更丝滑
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      x.set(middleX * 0.35);
      y.set(middleY * 0.35);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      // 开启 GPU 加速
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  // 视差效果：Footer 稍微移动一点，产生深度感
  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);

  return (
    <div
      ref={container}
      className="relative h-200 bg-neutral-950"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <motion.div
        style={{ y }}
        className="fixed bottom-0 h-200 w-full z-0 will-change-transform translate-z-0"
      >
        <div className="h-full w-full bg-lime-500 flex flex-col justify-between px-6 py-12 md:p-20 text-black">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-20 md:mt-0">
            <div className="w-full md:w-auto">
              <h2 className="text-[14vw] md:text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mb-8">
                开始 <br /> Go
              </h2>
            </div>

            <div className="relative z-20">
              <Magnetic>
                <Link
                  href="/contact"
                  className="w-48 h-48 md:w-64 md:h-64 bg-black rounded-full flex items-center justify-center text-white cursor-pointer group transition-transform duration-300 hover:scale-110 shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    <span className="text-lg font-bold uppercase tracking-widest">
                      获取联系
                    </span>
                    <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300 text-lime-400" />
                  </div>
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* 这里放置 FooterStatic 和 时间显示 */}
          <div className="flex justify-between items-end w-full border-t border-black/10 pt-8 mt-auto">
            {/* 假设 FooterStatic 在左侧或中间，我们在右侧加上时间 */}
            <div className="flex flex-col gap-4">
              <FooterStatic />
            </div>

            {/* 引用优化后的时间组件 */}
            <div className="hidden md:block text-lg font-mono font-bold tracking-widest uppercase">
              <TimeDisplay />
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black opacity-[0.03] pointer-events-none select-none">
            哒哒
          </div>
        </div>
      </motion.div>
    </div>
  );
}
