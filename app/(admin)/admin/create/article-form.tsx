"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Rocket,
  Globe,
  Hash,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import TiptapEditor from "@/components/editor/tiptap-editor";
import CoverUploader from "@/components/editor/cover-uploader";
import { createArticle } from "@/actions/article";
import { Category, Tag, CreateArticleDTO } from "@/types/article";

// --- Shadcn UI Components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ArticleFormProps {
  categories: Category[];
  tags: Tag[];
}

export default function ArticleForm({ categories, tags }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateArticleDTO>({
    defaultValues: {
      tags: [],
      content: "",
      published: false,
    },
  });

  const title = watch("title");
  const published = watch("published");
  const selectedTags = watch("tags");

  // 自动生成 Slug
  const generateSlug = () => {
    const currentSlug = watch("slug");
    if (!currentSlug && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-") // 支持中文转拼音场景通常需要额外库，这里保持原有逻辑
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: CreateArticleDTO) => {
    setLoading(true);
    try {
      const result = await createArticle(data);
      if (result?.error) {
        alert(result.error);
        return;
      }
      // 跳转逻辑
      if (data.published) {
        router.push(`/blog/${data.slug}`);
      }
    } catch (e) {
      console.error(e);
      alert("发生了一些错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden w-full bg-neutral-950"
    >
      <div className="flex-1 h-full lg:p-6 space-y-8 scrollbar-thin scrollbar-thumb-neutral-800">
        {/* 1. 标题输入 */}
        <div className="space-y-2 group">
          <Input
            {...register("title", { required: true })}
            placeholder="无标题文章..."
            onBlur={generateSlug}
            className="w-full h-auto p-2 bg-transparent border-0 border-b border-transparent focus-visible:border-neutral-800 focus-visible:ring-0 rounded-2xl text-4xl md:text-6xl font-black text-white placeholder:text-neutral-800 transition-all duration-300 shadow-none"
          />
          {errors.title && (
            <span className="text-red-500 text-xs font-mono block animate-pulse">
              文章标题不能为空
            </span>
          )}
        </div>

        {/* 2. 编辑器 */}
        <TiptapEditor
          content={watch("content")}
          onChange={(html) => setValue("content", html)}
        />
      </div>

      {/* --- 右侧：控制台面板 --- */}
      {/* 修改点 3: 右侧固定宽度，h-full 和 overflow-y-auto 实现独立滚动 */}
      <div className="w-full lg:w-80 shrink-0 h-full overflow-y-auto border-l border-neutral-800 bg-neutral-900/20 p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
        {/* Card 1: 发布控制 */}
        <div className="p-5 border border-neutral-800 rounded-xl bg-neutral-900/50 backdrop-blur-sm space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest font-bold">
              状态控制
            </span>
            <div
              className={`flex items-center gap-2 text-[10px] font-bold px-2 py-1 rounded-sm font-mono border ${
                published
                  ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
                  : "bg-neutral-800/50 text-neutral-400 border-neutral-700"
              }`}
            >
              {published ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {published ? "已发布" : "草稿"}
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <Label
              htmlFor="published-mode"
              className="text-xs text-neutral-300 font-mono"
            >
              公开发布
            </Label>
            <Switch
              id="published-mode"
              checked={published}
              onCheckedChange={(checked) => setValue("published", checked)}
              className="data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-neutral-800 border-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-md transition-all flex justify-center items-center gap-2 text-xs uppercase tracking-wider font-mono border ${
              published
                ? "bg-lime-400 text-black border-lime-400 hover:bg-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : published ? (
              <Rocket className="w-3 h-3" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {published ? "发布文章" : "保存修改"}
          </button>
        </div>

        {/* Card 2: 元数据配置 */}
        <div className="space-y-5 p-5 border border-neutral-800 rounded-xl bg-neutral-900/30">
          <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2 mb-4 flex items-center gap-2">
            <LinkIcon className="w-3 h-3" /> 元数据配置
          </h3>

          {/* Slug Input */}
          <div className="space-y-2">
            <Label className="text-xs text-neutral-400">链接别名 (Slug)</Label>
            <div className="relative">
              <Input
                {...register("slug")}
                className="bg-neutral-950 border-neutral-800 text-lime-400 font-mono text-xs h-9 focus-visible:ring-1 focus-visible:ring-lime-400/50 focus-visible:border-lime-400/50 pl-5"
                placeholder="默认自动生成"
              />
              <span className="absolute left-3 top-1.5 text-neutral-600">
                /
              </span>
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label className="text-xs text-neutral-400">文章分类</Label>
            <Select
              onValueChange={(val) => setValue("category_id", Number(val))}
              defaultValue={watch("category_id")?.toString()}
            >
              <SelectTrigger className="w-full bg-neutral-950 border-neutral-800 text-neutral-300 text-xs h-9 focus:ring-1 focus:ring-lime-400/50">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                {categories.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id.toString()}
                    className="text-xs focus:bg-neutral-800 focus:text-lime-400 cursor-pointer"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Excerpt Textarea */}
          <div className="space-y-2">
            <Label className="text-xs text-neutral-400">摘要 / 简介</Label>
            <Textarea
              {...register("excerpt")}
              rows={4}
              className="bg-neutral-950 border-neutral-800 text-neutral-300 text-xs resize-none focus-visible:ring-1 focus-visible:ring-lime-400/50 focus-visible:border-lime-400/50 min-h-[100px]"
              placeholder="SEO 描述内容..."
            />
          </div>
        </div>

        {/* Card 3: 资源与分类 */}
        <div className="space-y-5 p-5 border border-neutral-800 rounded-xl bg-neutral-900/30">
          <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2 mb-4 flex items-center gap-2">
            <Hash className="w-3 h-3" /> 标签与封面
          </h3>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-xs text-neutral-400">文章标签</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      const newTags = isSelected
                        ? selectedTags.filter((id) => id !== tag.id)
                        : [...selectedTags, tag.id];
                      setValue("tags", newTags);
                    }}
                    className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-all duration-300 ${
                      isSelected
                        ? "bg-lime-400 text-black border-lime-400 font-bold shadow-[0_0_10px_rgba(163,230,53,0.2)]"
                        : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          <div className="space-y-2">
            <CoverUploader
              value={watch("cover_image")}
              onChange={(url) => setValue("cover_image", url)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
