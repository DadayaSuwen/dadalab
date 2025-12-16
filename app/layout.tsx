import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/index/custom-cursor";
import Navbar from "./components/index/navbar";
import Footer from "./components/index/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dadalab.cn"),
  title: {
    default: "哒哒个人工作室 - 高端商业网站建设 | Dada Studio",
    template: "%s | 哒哒个人工作室",
  },
  description:
    "哒哒个人工作室专注于高端商业网站建设，提供专业的网页设计、开发和SEO优化服务。我们用顶级的前端技术为您构建24/7自动运转的商业增长引擎。",
  keywords: [
    "网站建设",
    "网页设计",
    "商业网站",
    "高端网站",
    "广州网站建设",
    "Dada Studio",
    "Next.js开发",
    "SEO优化",
    "响应式网站",
    "电商网站",
  ],
  authors: [{ name: "Dada Studio", url: "https://www.dadalab.cn" }],
  creator: "Dada Studio",
  publisher: "Dada Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.dadalab.cn",
    siteName: "哒哒个人工作室",
    title: "哒哒个人工作室 - 高端商业网站建设",
    description: "专注高端商业网站建设，用顶级前端技术构建商业增长引擎",
    images: [
      {
        url: "/image/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "哒哒个人工作室 - 高端商业网站建设",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "哒哒个人工作室 - 高端商业网站建设",
    description: "专注高端商业网站建设，用顶级前端技术构建商业增长引擎",
    images: ["/image/og-image.jpg"],
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
