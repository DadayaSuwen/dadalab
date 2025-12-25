import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 获取回调 URL 中的 code
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 如果有 next 参数，登录后跳转到该地址，否则跳到 /admin/create
  const next = searchParams.get("next") ?? "/admin/create";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 登录成功，重定向
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // 本地开发直接跳转
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // 生产环境处理代理
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 登录失败，返回登录页
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
