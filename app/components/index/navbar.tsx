"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/**
 * Navbar - 客户端组件
 * 智能浮动导航栏
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const diff = latest - lastYRef.current;
      if (Math.abs(diff) > 20) {
        setIsHidden(diff > 0 && latest > 50);
      }
      lastYRef.current = latest;
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  const menuItems = [
    { name: "作品", href: "#work" },
    { name: "技能", href: "#services" },
    { name: "价格", href: "#pricing" },
    { name: "联系", href: "#footer" },
  ];

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={isHidden ? "hidden" : "visible"}
        className="fixed top-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-[95%] md:max-w-7xl flex justify-between items-center mix-blend-difference text-white">
          {/* Logo with Flip Animation */}
          <a
            href="#"
            className="pointer-events-auto group relative overflow-hidden h-8"
          >
            <div className="text-2xl font-bold tracking-tighter uppercase font-mono flex flex-col transition-transform duration-500 group-hover:-translate-y-1/2 h-[200%]">
              <span className="h-1/2 flex items-center">哒哒工作室</span>
              <span className="h-1/2 flex items-center text-lime-400">
                DADALAB.STUDIO
              </span>
            </div>
          </a>

          {/* Desktop Menu - Floating Glass Capsule */}
          <div className="hidden md:flex pointer-events-auto bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-full p-1 gap-1 shadow-2xl">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Toggle & CTA */}
          <div className="pointer-events-auto flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-sm font-bold uppercase tracking-widest group-hover:text-lime-400 transition-colors">
                Start Project
              </span>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white bg-white/10 backdrop-blur-md rounded-full"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Fullscreen Curtain */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-lime-500 z-50 flex flex-col justify-center px-6"
          >
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-black border border-black rounded-full hover:bg-black hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {menuItems.map((item, i) => (
                <div key={item.name} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.1,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block text-6xl md:text-8xl font-black uppercase tracking-tighter text-black hover:text-white transition-colors leading-[0.9]"
                  >
                    {item.name}
                  </motion.a>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-black/20 grid grid-cols-2 text-black font-mono text-sm uppercase">
              <div>
                <p>Guanzhou, China | 广州 中国</p>
                <p>1179002658@qq.com</p>
              </div>
              <div className="text-right">
                <p>WeChat</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
