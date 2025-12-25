import React from "react";
import { Metadata } from "next";
import Hero from "@/components/index/hero";

import Services from "@/components/index/services";
import VelocityMarquee from "@/components/index/velocity-marquee";
import Work from "@/components/index/work";

import Pricing from "@/components/index/pricing";
import CommercialImpact from "@/components/index/commercial";

export const metadata: Metadata = {
  title:
    "哒哒个人工作室 - 前端技术构建商业增长引擎，提供网站设计、开发、SEO优化一站式服务",
  description:
    "哒哒个人工作室提供专业的高端商业网站建设服务，包括企业官网、电商平台、品牌网站等。采用Next.js技术栈，确保极致性能和SEO优化，助力您的业务增长。",
  keywords: [
    "商业网站建设",
    "高端网站设计",
    "广州网站开发",
    "企业官网建设",
    "电商平台开发",
    "品牌网站设计",
  ],
  openGraph: {
    title: "哒哒个人工作室 - 专业高端商业网站建设",
    description:
      "前端技术构建商业增长引擎，提供网站设计、开发、SEO优化一站式服务",
    images: [
      {
        url: "/image/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "哒哒个人工作室 - 高端商业网站建设",
      },
    ],
  },
};

export default async function App() {
  return (
    <div className="bg-neutral-950 min-h-screen text-white selection:bg-lime-500 selection:text-black font-sans scroll-smooth">
      <div className="relative z-10 bg-neutral-950 shadow-2xl">
        <Hero />
        <CommercialImpact />
        <Services />
        <VelocityMarquee />
        <Work />
        <Pricing />
      </div>
    </div>
  );
}
