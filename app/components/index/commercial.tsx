"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

export default function CommercialImpact() {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [xRange, setXRange] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const totalWidth = entry.contentRect.width; // 获取实际内容宽度
        const windowWidth = window.innerWidth;
        setXRange(-(totalWidth - windowWidth));
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0px", `${xRange}px`]);

  const cards = [
    {
      title: "极致性能",
      subtitle: "快一秒都是赢",
      desc: "亚马逊有项研究：页面加载慢100毫秒，销量就掉1%。我们用Next.js框架，保证网站快到飞起，不让任何一个客户因为等待而流失。",
      metric: "99+",
      label: "Google Lighthouse 评分",
      icon: <Zap className="w-8 h-8 text-black" />,
    },
    {
      title: "SEO霸榜",
      subtitle: "让你在搜索结果中C位出道",
      desc: "别再傻乎乎地堆关键词了。我们用语义化HTML结构和SSR服务端渲染技术，让搜索引擎第一时间发现并收录你的核心业务，轻松获得免费的自然流量。",
      metric: "300%",
      label: "自然流量增长",
      icon: <Globe className="w-8 h-8 text-black" />,
    },
    {
      title: "转化率爆表",
      subtitle: "每一笔设计都为了赚钱",
      desc: "每个动效、每个按钮的位置都经过精心设计，牢牢抓住用户心理。我们不只是在做网页设计，更像是在打造一条让用户心甘情愿付款的高速公路。",
      metric: "5.2%",
      label: "平均转化率",
      icon: <TrendingUp className="w-8 h-8 text-black" />,
    },
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-neutral-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={contentRef}
          style={{ x }}
          // ✅ 关键优化：will-change: transform
          // 这告诉浏览器这个元素即将发生变换，浏览器会预先将其提升到 GPU 合成层，
          // 避免每次滚动都触发 CPU 重绘 (Repaint)。
          className="flex gap-0 will-change-transform backface-visibility-hidden"
        >
          {/* 1. Intro Panel */}
          <div className="w-screen h-screen shrink-0 flex flex-col justify-center px-6 md:px-20 border-r border-neutral-800 relative z-10 bg-neutral-950">
            <div className="max-w-4xl">
              <h2 className="text-sm font-mono text-lime-400 mb-8 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Commercial Impact
              </h2>
              <h3 className="text-[9vw] leading-[0.85] font-black uppercase tracking-tighter mb-12 text-white">
                不只是艺术.
                <br />
                <span className="text-neutral-700">Not Just Art.</span>
              </h3>
              <div className="flex items-center gap-6 pl-2 border-l-2 border-lime-400">
                <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light">
                  在这个注意力稀缺的时代，我们用技术为您打造
                  <span className="text-white font-bold ml-2">
                    高效卓越的应用体验
                  </span>
                </p>
              </div>
              <div className="mt-12 flex gap-4 text-xs font-mono text-neutral-600 uppercase">
                <span>Scroll to explore</span>
                <ArrowRight className="w-4 h-4 animate-bounce" />
              </div>
            </div>
          </div>

          {/* 2. Value Cards */}
          {cards.map((card, i) => (
            <div
              key={i}
              // 优化：移除 w-[90vw]，在桌面端固定宽度通常性能更好，或者保持现状
              // 使用 translate-z-0 强制开启 GPU 加速
              className="w-[90vw] md:w-[60vw] h-screen shrink-0 flex flex-col justify-center px-8 md:px-24 border-r border-neutral-800 bg-neutral-950 relative group hover:bg-neutral-900 transition-colors duration-500 transform-gpu"
            >
              <div className="relative z-10">
                {/* 优化阴影：过大的 blur radius (30px) 非常消耗 GPU，适当减小或使用 opacity */}
                <div className="mb-10 p-4 w-fit rounded-2xl bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                  {card.icon}
                </div>
                <h4 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-white">
                  {card.title}
                </h4>
                <p className="text-xl font-mono text-lime-400 mb-8">
                  {card.subtitle}
                </p>
                <p className="text-neutral-400 text-lg md:text-xl max-w-lg mb-16 leading-relaxed">
                  {card.desc}
                </p>

                <div className="border-t border-neutral-800 pt-8 group-hover:border-lime-400/30 transition-colors duration-500">
                  {/* bg-clip-text 性能开销很大，如果此时还有 transform 动画会掉帧。
                      这里去掉了 transition-all，只做简单的颜色切换，或者保持现状但确保父容器有 transform-gpu */}
                  <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-700 group-hover:from-lime-400 group-hover:to-white transition-all duration-500">
                    {card.metric}
                  </div>
                  <div className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {card.label}
                  </div>
                </div>
              </div>

              {/* Background Huge Number */}
              <div className="absolute top-10 right-10 text-[20vw] font-black text-neutral-800/30 select-none z-0 group-hover:text-neutral-800/60 transition-colors duration-700">
                0{i + 1}
              </div>
            </div>
          ))}

          {/* 3. Final Call to Action Panel */}
          <div className="w-screen h-screen shrink-0 flex flex-col justify-center items-center bg-lime-500 text-black relative overflow-hidden transform-gpu">
            <div className="relative z-10 text-center">
              <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.85] mb-8">
                Ready to <br /> Scale?
              </h2>
              <p className="text-xl md:text-2xl font-bold mb-12 max-w-xl mx-auto">
                联系我解决您的问题。
              </p>
              <Link
                href="/contact"
                className="px-12 py-6 bg-black text-white text-xl font-bold rounded-full uppercase tracking-widest hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
              >
                开始
              </Link>
            </div>

            {/* Background Pattern - 使用 CSS 渲染而非图片，性能尚可 */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
