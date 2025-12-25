// types/article.ts
export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface CreateArticleDTO {
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // Tiptap HTML/JSON
  cover_image?: string;
  category_id?: number;
  tags: number[]; // Tag IDs
  published: boolean; // 用于控制 published_at
}
