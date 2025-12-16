"use client";

import React, { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Project Card - 客户端组件
 * Sticky Stacking Cards
 */
const ProjectCard = ({
  i,
  title,
  category,
  description,
  src,
  color,
  link,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  category: string;
  description: string;
  src: string;
  color: string;
  link: string;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]); // Inner image parallax
  const cardScale = useTransform(progress, range, [1, targetScale]); // Card stacking scale

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0 px-6"
    >
      <motion.div
        style={{
          scale: cardScale,
          backgroundColor: color,
          top: `calc(-5vh + ${i * 25}px)`, // Offset stacking effect
        }}
        className="flex flex-col relative -top-[10%] h-[550px] md:h-[650px] w-full max-w-[1200px] rounded-3xl p-6 md:p-12 origin-top border border-neutral-800 overflow-hidden shadow-2xl"
      >
        <div className="flex h-full flex-col md:flex-row gap-8 md:gap-16">
          {/* Left: Text Content */}
          <div className="md:w-[40%] flex flex-col justify-between z-20 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                {title}
              </h2>
              <p className="text-sm md:text-lg text-neutral-400">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-6 md:mt-0">
              <span className="text-xs md:text-sm font-mono border border-white/20 px-4 py-2 rounded-full text-lime-400">
                {category}
              </span>
              <Link
                href={link}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group hover:text-lime-400 transition-colors"
              >
                See Case{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Image Container */}
          <div className="relative md:w-[60%] h-full rounded-2xl overflow-hidden bg-black order-1 md:order-2 group">
            <motion.div style={{ scale: imageScale }} className="w-full h-full">
              <Image
                src={src}
                width={500}
                height={500}
                alt={`${title} - ${category}项目展示`}
                className="object-cover w-full h-full transition-opacity duration-500 opacity-80 group-hover:opacity-100"
              />
            </motion.div>
            {/* Overlay sheen on hover could go here */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Work - 客户端组件
 * Portfolio / Selected Work Section
 */
export default function Work() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = [
    {
      title: "江西联合化工",
      category: "Next.js Architecture",
      description:
        "打造的高性能官网，实现了毫秒级的页面加载与极致的 SEO 表现。",
      src: "/image/uniche.png",
      color: "#0a0a0a",
      link: "https://www.uniche.cn",
    },
    {
      title: "江西元道分子",
      category: "Next.js Architecture",
      description:
        "打造的高性能官网，实现了毫秒级的页面加载与极致的 SEO 表现。",
      src: "/image/yordo.png",
      color: "#141414",
      link: "https://www.yordo.cn",
    },
    {
      title: "哒哒的个人博客",
      category: "Next.js Architecture",
      description:
        "构建了一个炫酷二次元的个人博客，记录了学习、生活、技术、笔记、随笔等信息。",
      src: "/image/dadaya.png",
      color: "#171717",
      link: "https://www.dayabolg.top",
    },
  ];

  return (
    <section
      ref={container}
      id="work"
      className="bg-neutral-950 text-white relative"
    >
      <div className="pt-32 px-6 container mx-auto mb-10 md:mb-20">
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-8">
          作品 <br />
          <span className="text-neutral-800">精选</span>
        </h2>
        <p className="max-w-md text-neutral-400">
          通过代码与设计去实现完美的项目
        </p>
      </div>

      <div className="pb-32">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <ProjectCard
              key={i}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
