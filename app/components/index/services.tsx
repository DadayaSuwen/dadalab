"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowUpRight, Plus, Terminal, Zap, Layers, Cpu } from "lucide-react";
import Image from "next/image";

// 数据源
const services = [
  {
    id: "01",
    title: "Next.js 全栈架构",
    subtitle: "PERFORMANCE",
    desc: "不仅仅是前端。利用 Next.js 的服务端渲染 (SSR) 和边缘计算能力，构建加载速度极快、SEO 完美、且具备后端处理能力的现代 Web 应用。",
    tags: ["SSR/ISR", "Server Actions", "PostgreSQL", "Edge Function"],
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "02",
    title: "Taro 多端小程序",
    subtitle: "CROSS-PLATFORM",
    desc: "编写一次，随处运行。为您提供原生般的微信小程序体验，同时兼容支付宝、抖音等主流平台，最大化您的业务触达范围。",
    tags: ["React Native", "微信生态", "UI 组件库", "性能调优"],
    img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop",
    icon: <Layers className="w-6 h-6" />,
  },
  {
    id: "03",
    title: "WebGL 创意交互",
    subtitle: "INTERACTIVE",
    desc: "拒绝平庸。结合 Three.js 与 Shader 技术，将 3D 模型、粒子特效引入网页，打造令人过目难忘的沉浸式品牌体验。",
    tags: ["Three.js", "GLSL Shaders", "R3F", "Physics"],
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
    icon: <Cpu className="w-6 h-6" />,
  },
];

export default function Services() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端，用于区分交互逻辑
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 交互处理：桌面端Hover，移动端Click
  const handleInteraction = (id: string, type: "hover" | "click") => {
    if (isMobile) {
      if (type === "click") {
        setActiveId(activeId === id ? null : id);
      }
    } else {
      if (type === "hover") {
        setActiveId(id);
      }
    }
  };

  const clearInteraction = () => {
    if (!isMobile) setActiveId(null);
  };

  return (
    <section className="relative bg-neutral-950 py-24 md:py-32 overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {activeId && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full will-change-opacity"
            >
              <Image
                src={services.find((s) => s.id === activeId)?.img || ""}
                alt="bg"
                fill
                className="object-cover blur-[60px] md:blur-[100px] scale-110"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient-to-b" />

        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/80 to-neutral-950" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24">
          <div className="lg:w-1/3 h-fit shrink-0">
            <div className="flex items-center gap-2 mb-6 text-lime-400">
              <Terminal className="w-5 h-5" />
              <span className="font-mono text-sm tracking-widest uppercase">
                Capabilities
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6 md:mb-8">
                构建
                <br />
                <span className="text-neutral-500">高质量软件</span>
                <br />
                的核心能力
              </h2>

              <p className="text-neutral-400 text-base md:text-lg max-w-sm leading-relaxed mb-8 lg:mb-12">
                为您构建可扩展、高性能且具有视觉冲击力的数字产品。从底层架构到像素级动效。
              </p>

              <div className="hidden lg:block p-6 border border-neutral-800 rounded-2xl bg-neutral-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-neutral-500 text-xs font-mono mb-4 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                  System Status: Ready
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "99% Uptime",
                    "SEO Optimized",
                    "A11y Compliant",
                    "Pixel Perfect",
                  ].map((tag) => (
                    <div
                      key={tag}
                      className="bg-neutral-800/50 px-3 py-2 rounded text-neutral-400 text-xs font-mono"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. 右侧：交互式列表 */}
          <div className="lg:w-2/3 w-full" onMouseLeave={clearInteraction}>
            <LayoutGroup>
              <div className="flex flex-col gap-4 md:gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isOpen={activeId === service.id}
                    onClick={() => handleInteraction(service.id, "click")}
                    onMouseEnter={() => handleInteraction(service.id, "hover")}
                  />
                ))}
              </div>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

// 单个服务卡片组件
function ServiceCard({
  service,
  isOpen,
  onClick,
  onMouseEnter,
}: {
  service: (typeof services)[0];
  isOpen: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      initial={{ borderRadius: 12 }}
      // 移动端增加 active 态反馈
      className={`relative border overflow-hidden cursor-pointer transition-all duration-500 group active:scale-[0.98] lg:active:scale-100 ${
        isOpen
          ? "border-lime-500/50 bg-neutral-900/80"
          : "border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 hover:bg-neutral-900/40"
      }`}
    >
      {/* 激活时的光晕背景 */}
      {isOpen && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 bg-lime-500/5 pointer-events-none"
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative z-10 p-5 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span
              className={`font-mono text-[10px] md:text-xs tracking-widest uppercase transition-colors duration-300 ${
                isOpen ? "text-lime-400" : "text-neutral-500"
              }`}
            >
              0{service.id} / {service.subtitle}
            </span>
            <h3
              className={`text-2xl md:text-4xl font-bold tracking-tight uppercase transition-colors duration-300 ${
                isOpen ? "text-white" : "text-neutral-200"
              }`}
            >
              {service.title}
            </h3>
          </div>

          {/* 按钮图标 */}
          <div
            className={`shrink-0 p-2 md:p-3 rounded-full border transition-all duration-300 ${
              isOpen
                ? "bg-lime-400 text-black border-lime-400"
                : "border-neutral-700 text-neutral-500 group-hover:text-white group-hover:border-white"
            }`}
          >
            {/* 这里的图标切换增加动画 */}
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="arrow"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 rotate-45" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 展开内容区域 */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-6 md:pt-8 flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="md:w-1/2">
              <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-6">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 md:px-3 rounded-full border border-neutral-700 text-[10px] md:text-xs font-mono text-neutral-400 uppercase bg-neutral-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 图片预览区域 - 移动端高度调小 */}
            <div className="md:w-1/2 relative h-40 md:h-auto rounded-lg overflow-hidden border border-white/10 group-active:scale-[0.99] transition-transform">
              <Image
                src={service.img}
                alt={service.title}
                unoptimized
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white/80 font-mono text-[10px] md:text-xs">
                {service.icon}
                <span>PREVIEW MODE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
