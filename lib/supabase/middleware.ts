import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. 初始化 Response
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. 获取用户 (这里建议用 getUser 而不是 getClaims，安全性更高)
  // getUser 会向 Supabase Auth 服务器验证 Token，防止伪造
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. 【关键修改】权限控制逻辑
  // 逻辑：如果用户未登录 (user 为空) 且 试图访问以 /admin 开头的页面
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    // 强制跳转到登录页
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // 指向你的 app/login/page.tsx
    // 可以带上原来的地址作为参数，登录后跳回来 (可选)
    // url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url);
  }

  // 6. 返回 Response (必须返回这个经过处理的对象)
  return supabaseResponse;
}
