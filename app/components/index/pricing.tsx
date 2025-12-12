"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useRef,
} from "react";

// 7.5 Pricing Module (Spotlight Matrix Effect)
export default function Pricing() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const plans = [
    {
      title: "Essential",
      price: "¥3999",
      description: "适合初创企业快速上线品牌官网。",
      features: [
        "Next.js SSG 静态生成",
        "响应式适配 (Mobile/Desktop)",
        "基础 CMS 内容管理",
        "SEO 基础优化",
        "1 个月技术支持",
      ],
      popular: false,
    },
    {
      title: "Professional",
      price: "¥8888",
      description: "为成长型企业打造的高端交互体验。",
      features: [
        "Next.js SSR 服务端渲染",
        "Framer Motion 高级动效",
        "Taro 小程序多端适配",
        "Headless CMS 定制开发",
        "性能极致优化 (Lighthouse 95+)",
        "3 个月技术支持",
      ],
      popular: true,
    },
    {
      title: "Ultimate",
      price: "Custom",
      description: "全案定制，解决复杂业务需求。",
      features: [
        "WebGL / Three.js 3D 交互",
        "全栈系统架构设计",
        "高并发数据库优化",
        "SaaS 平台开发",
        "专属设计系统 (Design System)",
        "年度运维服务",
      ],
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 bg-neutral-950 text-white overflow-hidden group"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">
            开发 <span className="text-lime-400">价格</span>
          </h2>
          <p className="text-neutral-400 text-lg">创造商业价值的数字产品</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard
              key={i}
              index={i}
              plan={plan}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </div>
      </div>

      {/* Background Spotlight (Large Ambient Light) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(163, 230, 53, 0.1),
              transparent 80%
            )
          `,
        }}
      />
    </section>
  );
}

interface Plan {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PricingCard = ({
  index,
  plan,
  mouseX,
  mouseY,
}: {
  index: number;
  plan: Plan;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="relative h-full bg-neutral-900 border border-white/5 rounded-3xl p-8 flex flex-col overflow-hidden group/card"
    >
      {/* Border Spotlight Effect (Hover) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(163, 230, 53, 0.4),
              transparent 80%
            )
          `,
        }}
      />
      {/* Inner Mask to create the border look */}
      <div className="absolute inset-[1px] bg-neutral-900 rounded-[23px] z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        {plan.popular && (
          <div className="absolute top-0 right-0">
            <span className="bg-lime-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Most Popular
            </span>
          </div>
        )}

        <h3 className="text-xl font-mono text-neutral-400 uppercase tracking-widest mb-4">
          {plan.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            {plan.price}
          </span>
          {plan.price !== "Custom" && (
            <span className="text-neutral-500 text-sm">/ Project</span>
          )}
        </div>
        <p className="text-neutral-400 text-sm mb-8 h-10">{plan.description}</p>

        <div className="flex-grow space-y-4 mb-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 min-w-5 min-h-5 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 group-hover/card:border-lime-500/50 transition-colors">
                <Check className="w-3 h-3 text-lime-400" />
              </div>
              <span className="text-sm text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>

        <button
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
            plan.popular
              ? "bg-lime-500 text-black hover:bg-lime-400"
              : "bg-white text-black hover:bg-neutral-200"
          }`}
        >
          Start Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
      />
    </motion.div>
  );
};
