// app/actions/contact.ts
"use server";

import { supabase } from "@/lib/supabase/supabase"; // 引入刚才创建的客户端
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  projectType: z.string(),
  email: z.string().email(),
  message: z.string().min(10),
});

export type ContactFormValues = z.infer<typeof formSchema>;

export async function submitContactForm(data: ContactFormValues) {
  const validatedFields = formSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: "数据格式验证失败" };
  }

  try {
    const { error } = await supabase
      .from("contact_submissions") // 表名
      .insert({
        name: validatedFields.data.name,
        company: validatedFields.data.company || null,
        email: validatedFields.data.email,
        project_type: validatedFields.data.projectType,
        message: validatedFields.data.message,
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
