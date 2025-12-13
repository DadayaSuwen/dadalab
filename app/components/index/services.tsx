"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Plus } from "lucide-react";

/**
 * Services - 客户端组件
 * Interactive Hover List with Floating Image
 */
export default function Services() {
  const [activeService, setActiveService] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position logic for floating image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the image
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Use absolute mouse position for the floating image
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const services = [
    {
      id: "01",
      title: "Next.js架构开发",
      desc: "让你的网站又快又容易被搜索引擎找到的高性能方案",
      tags: ["React", "高性能", "SEO优化"],
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop",
    },
    {
      id: "02",
      title: "Taro小程序开发",
      desc: "一次开发，微信支付宝等多个平台都能用，体验跟原生一样好",
      tags: ["微信小程序", "多端适配", "移动端"],
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "03",
      title: "WebGL互动特效",
      desc: "用Three.js和Framer Motion打造让人眼前一亮的酷炫动画效果",
      tags: ["3D效果", "动画", "创意设计"],
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2340&auto=format&fit=crop",
    },
  ];

  return (
    <section
      id="services"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 bg-neutral-950 text-white overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-24">
          {/* Left Column: Sticky Title */}
          <div className="md:w-1/3 md:sticky md:top-32 h-fit">
            <h2 className="text-sm font-mono text-lime-400 mb-6 uppercase tracking-widest">
              我们的专长
            </h2>
            <h3 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
              我擅长的 <br /> 实现 <br /> 解决问题
            </h3>
            <p className="text-neutral-400 max-w-sm">
              我们站在技术与艺术的交汇处，为你提供从界面交互到系统架构的一条龙服务。
            </p>
          </div>

          {/* Right Column: Interactive List */}
          <div
            className="md:w-2/3 flex flex-col w-full"
            onMouseLeave={() => setActiveService(null)}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveService(index)}
                className={`group relative border-t border-neutral-800 py-12 transition-all duration-300 ${
                  activeService !== null && activeService !== index
                    ? "opacity-30"
                    : "opacity-100"
                }`}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm text-lime-400">
                      /{service.id}
                    </span>
                    <h4 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
                      {service.title}
                    </h4>
                  </div>
                  <Plus
                    className={`w-6 h-6 text-neutral-500 transition-transform duration-300 ${
                      activeService === index ? "rotate-45 text-lime-400" : ""
                    }`}
                  />
                </div>

                <div className="md:pl-16 overflow-hidden">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeService === index ? "auto" : 0,
                      opacity: activeService === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xl text-neutral-300 mb-4 font-light">
                      {service.desc}
                    </p>
                    <div className="flex gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono border border-neutral-700 px-2 py-1 rounded-full text-neutral-500 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            <div className="border-t border-neutral-800" />
          </div>
        </div>
      </div>

      {/* Floating Image (Only visible on Desktop when hovering) */}
      <AnimatePresence>
        {activeService !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              left: smoothX,
              top: smoothY,
              translateX: "20px", // Offset to not cover cursor
              translateY: "20px",
            }}
            className="pointer-events-none fixed z-20 hidden md:block w-[400px] h-[250px] overflow-hidden rounded-lg border border-lime-400/20 shadow-2xl"
          >
            {/* We map all images and only show the active one to allow cross-fading if needed, or just swap src */}
            <motion.img
              key={services[activeService].img}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={services[activeService].img}
              alt="Service Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-lime-500/10 mix-blend-overlay" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
