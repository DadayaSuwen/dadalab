"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

  // 1. 状态管理：用于存储需要横向滚动的总距离
  const [xRange, setXRange] = useState(0);

  // 2. 动态计算宽度：确保在不同屏幕下都能精准停在最后一张卡片
  useEffect(() => {
    if (contentRef.current) {
      const calculateWidth = () => {
        const totalWidth = contentRef.current!.scrollWidth;
        const windowWidth = window.innerWidth;
        // 我们需要移动的距离 = 内容总宽度 - 视口宽度
        // 结果取负值，因为是向左移动
        setXRange(-(totalWidth - windowWidth));
      };

      calculateWidth();
      window.addEventListener("resize", calculateWidth);
      return () => window.removeEventListener("resize", calculateWidth);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"], // 确保从容器顶部开始，到底部结束
  });

  // 3. 关键优化：使用 useSpring 增加物理阻尼感
  // 这实现了“慢慢停止”的效果，而不是生硬的机械停止
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120, // 刚度：数值越小越“软”
    damping: 25, // 阻尼：数值越大，停止时的摩擦力越大（越平滑）
    restDelta: 0.001,
  });

  // 4. 线性映射：从 0 映射到计算出的实际像素距离
  const x = useTransform(smoothProgress, [0, 1], ["0px", `${xRange}px`]);

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
    // 调整高度：h-[500vh] 会让滚动过程更长，从而感觉更慢、更从容
    <section ref={targetRef} className="relative h-[500vh] bg-neutral-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* 将 contentRef 绑定在这里用于测量宽度 */}
        <motion.div ref={contentRef} style={{ x }} className="flex gap-0">
          {/* 1. Intro Panel */}
          <div className="w-screen h-screen flex-shrink-0 flex flex-col justify-center px-6 md:px-20 border-r border-neutral-800 relative z-10 bg-neutral-950">
            <div className="max-w-4xl">
              <h2 className="text-sm font-mono text-lime-400 mb-8 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4" /> Commercial Impact
              </h2>
              <h3 className="text-[9vw] leading-[0.85] font-black uppercase tracking-tighter mb-12">
                不只是艺术.
                <br />
                <span className="text-neutral-700">Not Just Art.</span>
              </h3>
              <div className="flex items-center gap-6 pl-2 border-l-2 border-lime-400">
                <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light">
                  在这个注意力稀缺的时代，我们用技术为您打造
                  <span className="text-white font-bold">
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
              className="w-[90vw] md:w-[60vw] h-screen flex-shrink-0 flex flex-col justify-center px-8 md:px-24 border-r border-neutral-800 bg-neutral-950 relative group hover:bg-neutral-900 transition-colors duration-700"
            >
              <div className="relative z-10">
                <div className="mb-10 p-4 w-fit rounded-2xl bg-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
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
                  <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-700 group-hover:from-lime-400 group-hover:to-white transition-all duration-500">
                    {card.metric}
                  </div>
                  <div className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {card.label}
                  </div>
                </div>
              </div>

              {/* Background Huge Number Decoration */}
              <div className="absolute top-10 right-10 text-[20vw] font-black text-neutral-900 select-none z-0 opacity-50 group-hover:opacity-100 group-hover:text-neutral-800 transition-all duration-700">
                0{i + 1}
              </div>
            </div>
          ))}

          {/* 3. Final Call to Action Panel */}
          <div className="w-screen h-screen flex-shrink-0 flex flex-col justify-center items-center bg-lime-500 text-black relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.85] mb-8">
                Ready to <br /> Scale?
              </h2>
              <p className="text-xl md:text-2xl font-bold mb-12 max-w-xl mx-auto">
                联系我帮你解决您的问题。
              </p>
              <Link
                href="/contact"
                className="px-12 py-6 bg-black text-white text-xl font-bold rounded-full uppercase tracking-widest hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 shadow-2xl"
              >
                联系我
              </Link>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
