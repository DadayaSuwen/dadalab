import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import CustomCursor from "@/components/index/custom-cursor";
import Navbar from "@/components/index/navbar";
import Footer from "@/components/index/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.dadalab.cn";
export const metadata: Metadata = {
  metadataBase: BASE_URL,
  title: {
    default:
      "哒哒工作室 - 专业Next.js网站定制开发 | 高端企业官网与外贸独立站建设",
    template: "%s | 哒哒工作室", // 子页面的标题模板
  },
  description:
    "专注Next.js与React技术栈，提供高性能企业官网、外贸独立站、电商平台定制开发服务。哒哒工作室致力于打造兼具视觉美感与SEO优势的商业网站，响应式设计适配全终端，助力品牌实现数字化业务增长。",
  keywords: [
    // --- 核心服务类 ---
    "高端网站建设",
    "商业网站开发",
    "企业官网定制",
    "品牌独立站设计",
    "响应式网站设计",
    "SEO优化服务",
    "整站开发",

    // --- 技术栈类 (吸引懂技术的甲方) ---
    "Next.js开发",
    "React网站开发",
    "前端工程化",
    "高性能网站制作",
    "Headless CMS开发",
    "SSR渲染优化",

    // --- 业务场景类 ---
    "外贸独立站建设", // 高价值词
    "跨境电商网站",
    "SaaS产品界面设计",
    "落地页制作",
    "H5营销页面",

    // --- 地域与身份类 ---
    "广州网站开发",
    "广州前端外包",
    "独立开发者",
    "全栈开发工程师",
    "哒哒个人工作室",
  ],
  authors: [{ name: "哒哒 | Dada", url: BASE_URL }],
  creator: "哒哒 | Dada",
  publisher: "哒哒 | Dada",
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    title: "哒哒工作室 - 高端商业网站建设 | Next.js 性能驱动",
    description:
      "前端技术构建商业增长引擎。提供从设计、开发到SEO优化的一站式全栈解决方案。让您的网站在谷歌/百度排名中脱颖而出。",
    siteName: "哒哒个人工作室",
    images: [
      {
        url: "/image/og-home.jpg", // 建议尺寸 1200x630
        width: 1200,
        height: 630,
        alt: "哒哒工作室 - 高性能网站建设案例展示",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "哒哒工作室 - 专业网站定制开发",
    description: "使用 Next.js 构建极致性能的商业网站，助力业务增长。",
    images: ["/image/og-home.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "哒哒个人工作室",
              alternateName: "Dada Studio",
              url: "https://www.dadalab.cn",
              logo: "https://www.dadalab.cn/image/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "robjffian@gmail.com",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "广州",
                addressCountry: "CN",
              },
              description:
                "专注高端商业网站建设，提供专业的网页设计、开发和SEO优化服务",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <CustomCursor />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
