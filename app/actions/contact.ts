// app/actions/contact.ts
"use server";

import { supabase } from "@/lib/supabase/supabase"; // 引入刚才创建的客户端
import { z } from "zod";

// 保持和前端一致的 Schema
const formSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  projectType: z.string(),
  email: z.string().email(),
  message: z.string().min(10),
});

export type ContactFormValues = z.infer<typeof formSchema>;

export async function submitContactForm(data: ContactFormValues) {
  // 1. Zod 数据格式验证
  const validatedFields = formSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: "数据格式验证失败" };
  }

  // 2. 提交到 Supabase
  // 注意：字段名要与我们在 SQL 中创建的 column 保持一致 (snake_case vs camelCase)
  // 如果数据库是 snake_case (project_type)，这里需要转换一下
  try {
    const { error } = await supabase
      .from("contact_submissions") // 表名
      .insert({
        name: validatedFields.data.name,
        company: validatedFields.data.company || null,
        email: validatedFields.data.email,
        project_type: validatedFields.data.projectType, // 注意数据库字段是 snake_case
        message: validatedFields.data.message,
        // created_at 会自动生成
        // status 会默认为 'PENDING'
      });

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, error: "提交失败，数据库拒绝写入" };
    }

    return { success: true };
  } catch (err) {
    console.error("Server Error:", err);
    return { success: false, error: "服务器内部错误" };
  }
}
