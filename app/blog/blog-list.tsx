"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowUpRight, Plus, Terminal, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 数据接口定义 (保持不变)
interface ArticleProps {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  read_time_minutes: number;
  cover_image: string;
  category: { name: string } | null;
  tags: { name: string }[];
}

interface BlogListProps {
  initialArticles: ArticleProps[];
  categories: { id: number; name: string }[];
}

export default function BlogList({
  initialArticles,
  categories,
}: BlogListProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 过滤逻辑
  const filteredArticles =
    activeCategory === "All"
      ? initialArticles
      : initialArticles.filter((art) => art.category?.name === activeCategory);

  // 交互逻辑：桌面Hover，手机Click
  const handleInteraction = (id: number, type: "hover" | "click") => {
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

  // 当前激活的文章，用于背景模糊图
  const activeArticle = initialArticles.find((a) => a.id === activeId);

  return (
    <section
      className="relative bg-neutral-950 py-24 md:py-32 min-h-screen"
      onMouseLeave={clearInteraction} // 移出整个列表区域时清除激活状态
    >
      {/* 1. 背景层 (复用 Service 的模糊背景逻辑) */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <AnimatePresence mode="wait">
          {activeArticle && (
            <motion.div
              key={activeArticle.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }} // 这里的透明度可以微调
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full will-change-opacity"
            >
              <Image
                src={activeArticle.cover_image}
                alt="bg"
                fill
                className="object-cover blur-[80px] scale-110"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 网格纹理 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient-to-b" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/90 to-neutral-950" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* 2. 头部区域 (保持原 blog-list 的上下结构) */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-6 text-lime-400">
              <Terminal className="w-5 h-5" />
              <span className="font-mono text-sm tracking-widest uppercase">
                Engineering Log
              </span>
            </div>

            <h1 className="text-[6vw] leading-[0.8] font-black uppercase tracking-tighter text-white mb-8">
              Insights <span className="text-neutral-800">&</span> <br />
              <span className="text-lime-400">Engineering</span>
            </h1>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-8">
            <p className="text-neutral-400 max-w-md text-lg">
              定期分享关于 Next.js、Web 开发的深度文章。
            </p>

            {/* 筛选器 */}
            <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 border rounded-full text-sm font-mono uppercase transition-colors ${
                  activeCategory === "All"
                    ? "border-lime-400 text-lime-400 bg-lime-400/10"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 border rounded-full text-sm font-mono uppercase transition-colors ${
                    activeCategory === cat.name
                      ? "border-lime-400 text-lime-400 bg-lime-400/10"
                      : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 列表区域 (样式改为 Service Card 风格) */}
        <LayoutGroup>
          <div className="flex flex-col gap-4">
            {filteredArticles.map((article, index) => (
              <BlogCard
                key={article.id}
                article={article}
                index={index}
                isOpen={activeId === article.id}
                onClick={() => handleInteraction(article.id, "click")}
                onMouseEnter={() => handleInteraction(article.id, "hover")}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

function BlogCard({
  article,
  index,
  isOpen,
  onClick,
  onMouseEnter,
}: {
  article: ArticleProps;
  index: number;
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
      className={`relative border overflow-hidden cursor-pointer transition-all duration-500 group ${
        isOpen
          ? "border-lime-500/50 bg-neutral-900/80"
          : "border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 hover:bg-neutral-900/40"
      }`}
    >
      {isOpen && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 bg-lime-500/5 pointer-events-none"
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative z-10 p-5 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 flex-1">
            <span
              className={`font-mono text-[10px] md:text-xs tracking-widest uppercase transition-colors duration-300 shrink-0 ${
                isOpen ? "text-lime-400" : "text-neutral-500"
              }`}
            >
              <span className="mr-3">0{index + 1}</span>
              {new Date(article.published_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>

            <h3
              className={`text-xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                isOpen ? "text-white" : "text-neutral-200"
              }`}
            >
              {article.title}
            </h3>
          </div>

          <div
            className={`shrink-0 p-2 md:p-3 rounded-full border transition-all duration-300 ${
              isOpen
                ? "bg-lime-400 text-black border-lime-400"
                : "border-neutral-700 text-neutral-500 group-hover:text-white group-hover:border-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <Link href={`/blog/${article.slug}`}>
                  <motion.div
                    key="arrow"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 rotate-45" />
                  </motion.div>
                </Link>
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

        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-6 md:pt-8 flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="md:w-1/2 flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="flex items-center gap-2 text-neutral-400 mb-6 text-sm font-mono">
                  <Clock className="w-4 h-4" />
                  <span>预计阅读时间: {article.read_time_minutes} 分钟</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="px-2 py-1 rounded border border-neutral-700 text-[10px] md:text-xs font-mono text-neutral-400 uppercase bg-neutral-800/50"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/blog/${article.slug}`}>
                <button className="group/btn flex items-center gap-3 text-white border-b border-lime-400/30 pb-1 hover:border-lime-400 transition-colors w-fit">
                  <span className="font-mono text-sm uppercase tracking-wider">
                    前往阅读
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-lime-400 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </Link>
            </div>

            <Link
              href={`/blog/${article.slug}`}
              className="md:w-1/2 order-1 md:order-2"
            >
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden border border-white/10 group-active:scale-[0.99] transition-transform hover:brightness-110">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
