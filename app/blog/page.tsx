import { supabase } from "@/lib/supabase/supabase";
import BlogList from "./blog-list";

export const revalidate = 60;

// 1. 定义基础类型
interface Tag {
  name: string;
}

interface Category {
  id: number;
  name: string;
}

// 2. 定义前端最终使用的文章类型 (BlogList 组件需要的)
export interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  read_time_minutes: number;
  cover_image: string;
  category: { name: string } | null;
  tags: Tag[]; // 最终我们希望 tags 是简单的数组: [{name: 'React'}, {name: 'Vue'}]
}

// 3. 定义 Supabase 原始返回的类型 (为了处理 any)
// Supabase 联表查询 article_tags(tags(name)) 返回的是嵌套结构
interface SupabaseRawArticle extends Omit<Article, "tags"> {
  tags: {
    tags: Tag | null; // 因为是联表，可能存在空值情况，虽然你的业务逻辑可能不允许
  }[];
}

async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      published_at,
      read_time_minutes,
      cover_image,
      category:categories(name),
      tags:article_tags(tags(name)) 
    `
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  // 4. 类型断言与数据转换
  // 我们告诉 TS，data 就是 SupabaseRawArticle 数组
  const rawData = data as unknown as SupabaseRawArticle[];

  const formattedData: Article[] = rawData.map((item) => ({
    ...item,
    // 这里处理拍平逻辑：从 [{ tags: { name: 'xxx'} }] 变成 [{ name: 'xxx' }]
    tags: item.tags.map((t) => t.tags).filter((t): t is Tag => t !== null), // 过滤掉可能的 null 值，保证类型安全
  }));

  return formattedData;
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("id, name");
  // 简单的类型断言
  return (data as Category[]) || [];
}

export default async function Page() {
  const articles = await getArticles();
  const categories = await getCategories();

  return <BlogList initialArticles={articles} categories={categories} />;
}
