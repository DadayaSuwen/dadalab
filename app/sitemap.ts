import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/supabase";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dadalab.cn";

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at");

  // 生成动态的文章路由数组
  const blogRoutes: MetadataRoute.Sitemap =
    articles?.map(
      (article: { slug: string; published_at: string | number | Date }) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.published_at),
        changeFrequency: "weekly",
        priority: 0.6,
      })
    ) || [];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // 4. 合并并返回
  return [...staticRoutes, ...blogRoutes];
}
// daily;
// weekly
// monthly
// yearly
