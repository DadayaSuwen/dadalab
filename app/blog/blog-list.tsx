"use client";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link"; // 用于跳转详情

// 定义数据接口
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
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // 鼠标跟随逻辑保持不变...
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // 前端过滤逻辑
  const filteredArticles =
    activeCategory === "All"
      ? initialArticles
      : initialArticles.filter((art) => art.category?.name === activeCategory);

  return (
    <motion.div
      className="bg-neutral-950 min-h-screen pt-32 pb-20"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <h1 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-white mb-8">
            Insights <span className="text-neutral-800">&</span> <br />
            <span className="text-lime-400">Engineering</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-8">
            <p className="text-neutral-400 max-w-md text-lg">
              定期分享关于 Next.js、Web 开发的深度文章。
            </p>
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 border rounded-full text-sm font-mono uppercase transition-colors ${
                  activeCategory === "All"
                    ? "border-lime-400 text-lime-400"
                    : "border-neutral-800 text-neutral-400"
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
                      ? "border-lime-400 text-lime-400"
                      : "border-neutral-800 text-neutral-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Article List */}
        <div
          className="relative z-10"
          onMouseLeave={() => setHoveredArticle(null)}
        >
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onMouseEnter={() => setHoveredArticle(article.id)}
                className={`group relative flex flex-col md:flex-row items-baseline py-12 border-b border-neutral-900 transition-all duration-300 cursor-pointer ${
                  hoveredArticle && hoveredArticle !== article.id
                    ? "opacity-30 blur-[1px]"
                    : "opacity-100"
                }`}
              >
                <div className="w-full md:w-1/4 mb-2 md:mb-0">
                  <span className="font-mono text-sm text-neutral-500 group-hover:text-lime-400 transition-colors">
                    {new Date(article.published_at).toLocaleDateString(
                      "zh-CN",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="w-full md:w-2/4">
                  <h2 className="text-3xl md:text-5xl font-bold text-white group-hover:translate-x-4 transition-transform duration-300">
                    {article.title}
                  </h2>
                </div>
                <div className="w-full md:w-1/4 flex justify-end gap-2 mt-4 md:mt-0">
                  {/* 这里显示 Tags */}
                  {article.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="text-xs font-mono border border-neutral-800 px-2 py-1 rounded text-neutral-500 uppercase"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Image 逻辑保持不变... */}
      <AnimatePresence>
        {hoveredArticle && (
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              left: 0,
              top: 0,
            }}
            className="fixed z-20 pointer-events-none w-75 h-50 md:w-100 md:h-70 rounded-lg overflow-hidden border border-lime-400/30 shadow-2xl hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {filteredArticles.map(
              (article) =>
                article.id === hoveredArticle && (
                  <motion.img
                    key={article.id}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
