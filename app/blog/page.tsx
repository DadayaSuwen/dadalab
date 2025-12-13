"use client";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";

export default function Blog() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const articles = [
    {
      id: 1,
      date: "2024.05.20",
      title: "Next.js 14 Server Actions 深度解析",
      tags: ["Development", "React"],
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      date: "2024.05.15",
      title: "WebGL 性能优化指南：从 30fps 到 60fps",
      tags: ["Performance", "3D"],
      readTime: "12 min read",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: 3,
      date: "2024.05.08",
      title: "现代前端 SEO 策略：SSG vs SSR",
      tags: ["SEO", "Marketing"],
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop",
    },
    {
      id: 4,
      date: "2024.04.28",
      title: "为 Awwwards 网站设计微交互动效",
      tags: ["Design", "Animation"],
      readTime: "10 min read",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop",
    },
    {
      id: 5,
      date: "2024.04.12",
      title: "Taro 跨端开发实战：踩坑与最佳实践",
      tags: ["Mobile", "MiniProgram"],
      readTime: "15 min read",
      image:
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const categories = [
    "All",
    "Development",
    "Design",
    "Performance",
    "Business",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-950 min-h-screen pt-32 pb-20"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <h1 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-white mb-8">
            Insights <span className="text-neutral-800">&</span> <br />
            <span className="text-lime-400">Engineering</span>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-800 pb-8">
            <p className="text-neutral-400 max-w-md text-lg">
              定期分享关于 Next.js、Web 开发的深度文章。
            </p>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 border border-neutral-800 rounded-full text-sm font-mono uppercase text-neutral-400 hover:border-lime-400 hover:text-lime-400 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Article List (Index Style) */}
        <div
          className="relative z-10"
          onMouseLeave={() => setHoveredArticle(null)}
        >
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: article.id * 0.1 }}
              onMouseEnter={() => setHoveredArticle(article.id)}
              className={`group relative flex flex-col md:flex-row items-baseline py-12 border-b border-neutral-900 transition-all duration-300 cursor-pointer ${
                hoveredArticle && hoveredArticle !== article.id
                  ? "opacity-30 blur-[1px]"
                  : "opacity-100"
              }`}
            >
              <div className="w-full md:w-1/4 mb-2 md:mb-0">
                <span className="font-mono text-sm text-neutral-500 group-hover:text-lime-400 transition-colors">
                  {article.date}
                </span>
              </div>
              <div className="w-full md:w-2/4">
                <h2 className="text-3xl md:text-5xl font-bold text-white group-hover:translate-x-4 transition-transform duration-300">
                  {article.title}
                </h2>
              </div>
              <div className="w-full md:w-1/4 flex justify-end gap-2 mt-4 md:mt-0">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono border border-neutral-800 px-2 py-1 rounded text-neutral-500 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Preview Image */}
      <AnimatePresence>
        {hoveredArticle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
              left: 0,
              top: 0,
            }}
            className="fixed z-20 pointer-events-none w-[300px] h-[200px] md:w-[400px] md:h-[280px] rounded-lg overflow-hidden border border-lime-400/30 shadow-2xl hidden md:block"
          >
            {articles.map(
              (article) =>
                article.id === hoveredArticle && (
                  <motion.img
                    key={article.id}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    src={article.image}
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
