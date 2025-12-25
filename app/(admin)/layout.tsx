// app/(admin)/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css"; // 引入全局样式，或者你可以创建一个专门的 admin.css

export const metadata: Metadata = {
  title: "Digital Alchemist Admin",
  description: "Admin Control Panel",
  robots: "noindex, nofollow", // 建议：防止搜索引擎收录后台
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-neutral-950 text-white min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* <AdminSidebar /> */}

          <main className="flex-1 overflow-y-auto relative z-10">
            {children}
          </main>

          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
          </div>
        </div>
      </body>
    </html>
  );
}
