// app/admin/create/page.tsx
import { createClient } from "@/lib/supabase/server";
import ArticleForm from "./article-form";

export default async function CreateArticlePage() {
  const supabase = await createClient();

  // 并行获取分类和标签
  const [categoriesData, tagsData] = await Promise.all([
    supabase.from("categories").select("id, name"),
    supabase.from("tags").select("id, name"),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto px-6 pt-6">
        <ArticleForm
          categories={categoriesData.data || []}
          tags={tagsData.data || []}
        />
      </div>
    </div>
  );
}
