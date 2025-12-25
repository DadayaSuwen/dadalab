// components/editor/cover-uploader.tsx
"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface CoverUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function CoverUploader({ value, onChange }: CoverUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. 生成唯一文件名 (使用时间戳+随机数)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. 上传到 'public' bucket (假设你的bucket叫 'public' 或者 'images')
      // 这里的 'images' 是你在 Supabase Storage 创建的 bucket 名字
      const bucketName = "images";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 3. 获取完整的 Public URL
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // 4. 将完整 URL 传回给表单
      onChange(data.publicUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("上传失败，请检查控制台或网络");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs text-neutral-400">上传图片</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-red-400 hover:text-red-300 uppercase font-mono"
          >
            Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 group bg-neutral-900">
          <Image
            src={value}
            alt="Cover"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized // 如果你是外部链接，可能需要这个，或者在 next.config.ts 配置 host
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-neutral-800 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-neutral-700 rounded-lg hover:border-lime-400/50 hover:bg-lime-400/5 cursor-pointer transition-all group relative overflow-hidden">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 z-10">
              <Loader2 className="w-6 h-6 text-lime-400 animate-spin" />
              <p className="text-[10px] font-mono text-lime-400 uppercase tracking-widest">
                上传中...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
              <div className="p-3 rounded-full bg-neutral-800/50 text-neutral-400 group-hover:text-lime-400 group-hover:bg-lime-400/10 transition-colors mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-500 font-mono group-hover:text-neutral-300 transition-colors">
                点击上传图片
              </p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
