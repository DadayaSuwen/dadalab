// app/actions/article.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateArticleDTO } from "@/types/article";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createArticle(data: CreateArticleDTO) {
  const supabase = await createClient();

  // 1. 插入文章主体
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .insert({
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      cover_image: data.cover_image,
      category_id: data.category_id,
      published_at: data.published ? new Date().toISOString() : null,
      read_time_minutes: Math.ceil(data.content.split(/\s+/).length / 200), // 简单估算
    })
    .select("id")
    .single();

  if (articleError) {
    console.error("Error creating article:", articleError);
    return { error: articleError.message };
  }

  // 2. 处理标签关联 (Article Tags)
  if (data.tags.length > 0 && article) {
    const tagInserts = data.tags.map((tagId) => ({
      article_id: article.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("article_tags")
      .insert(tagInserts);

    if (tagError) {
      console.error("Error linking tags:", tagError);
      // 注意：这里可能需要回滚文章创建，或者仅返回警告
      return { error: "Article created but tags failed to link." };
    }
  }

  revalidatePath("/blog");
  redirect("/blog");
}
