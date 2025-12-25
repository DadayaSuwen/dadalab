import { supabase } from "@/lib/supabase/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Hash } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

interface Tag {
  name: string;
}

interface Category {
  name: string;
}

interface SupabaseTagResponse {
  tags: Tag;
}
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  read_time_minutes: number;
  published_at: string;
  category: Category | null;
  tags: Tag[];
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data: articles } = await supabase.from("articles").select("slug");

  return (
    articles?.map((article) => ({
      slug: article.slug,
    })) || []
  );
}

async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(name),
      tags:article_tags(tags(name))
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const rawTags = data.tags as unknown as SupabaseTagResponse[];

  return {
    ...data,

    tags: rawTags.map((t) => t.tags),
  } as Article;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);
  if (!article) return { title: "文章未找到" };

  return {
    title: `${article.title} | Insights & Engineering`,
    description: article.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-lime-500/30">
      <div className="relative h-[50vh] w-full overflow-hidden">
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-neutral-950/60 z-10" />

        <Image
          src={article.cover_image}
          width={1920}
          height={1080}
          alt={article.title}
          sizes="100vw"
          unoptimized
          className="object-cover blur-sm scale-105"
        />

        {/* 返回按钮 */}
        <div className="absolute top-24 left-6 md:left-12 z-25">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-neutral-300 hover:text-lime-400 transition-colors px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:border-lime-400/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm uppercase">返回</span>
          </Link>
        </div>

        {/* 标题内容 */}
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 bg-gradient-to-t from-neutral-950 to-transparent">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {article.category && (
                <span className="px-3 py-1 bg-lime-500 text-black font-bold font-mono text-xs uppercase tracking-wider rounded-sm">
                  {article.category.name}
                </span>
              )}
              {/* 这里的 tag 自动获得了类型推断，不再是 any */}
              {article.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="flex items-center gap-1 text-xs font-mono text-lime-300 border border-lime-500/30 px-2 py-1 rounded-full bg-lime-500/10"
                >
                  <Hash className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-neutral-400 font-mono text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.published_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time_minutes} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <div className="prose prose-invert prose-lg md:prose-xl prose-lime max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-neutral-400 prose-p:leading-relaxed prose-img:rounded-xl prose-img:border prose-img:border-neutral-800">
          {article.excerpt && (
            <div className="not-prose mb-12 p-8 border-l-4 border-lime-500 bg-neutral-900/50 rounded-r-lg">
              <p className="text-xl md:text-2xl text-neutral-200 italic font-medium">
                &quot;{article.excerpt}&quot;
              </p>
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </article>
  );
}
