"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  // 新增：控制成功状态的 State
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 1. 初始化检查 (如果是已经登录的用户直接跳，不需要动画)
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin/create");
      }
    };
    checkSession();

    // 2. 监听登录事件
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setLoginSuccess(true);

        router.refresh();
        router.replace("/admin/create");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (!isMounted) return null;

  const getURL = () => {
    let url =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000";
    url = url.includes("http") ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return `${url}auth/callback`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-image-gradient-to-b" />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 blur-[100px] rounded-full transition-colors duration-1000 ${
            loginSuccess ? "bg-lime-500/30" : "bg-lime-500/10"
          }`}
        />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full mb-4 transition-all duration-500 ${
              loginSuccess
                ? "text-black bg-lime-400 border-lime-400"
                : "text-lime-400 border-lime-400/30 bg-lime-400/10"
            }`}
          >
            {loginSuccess ? (
              <Lock className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
              {loginSuccess ? "Access Granted" : "Secure Gateway"}
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            后台 <span className="text-neutral-600">登录</span>
          </h2>
          <p className="text-sm text-neutral-500 font-mono">
            {loginSuccess
              ? "身份验证通过。正在重定向..."
              : "请输入您的凭证以访问控制台"}
          </p>
        </div>

        {/* 登录框容器 */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative group overflow-hidden min-h-100 flex flex-col justify-center">
          {/* 边框光晕 (成功时变为常亮) */}
          <div
            className={`absolute -inset-px bg-linear-to-b from-lime-500/20 to-transparent rounded-2xl transition-opacity duration-500 pointer-events-none ${
              loginSuccess ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* --- 成功状态 UI --- */}
          {loginSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                {/* 绿色圆圈扩散动画 */}
                <div className="absolute inset-0 bg-lime-400/20 rounded-full animate-ping" />
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.5)]">
                  <CheckCircle2 className="w-8 h-8 text-black" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  登录成功
                </h3>
                <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>正在跳转</span>
                </div>
              </div>
            </div>
          ) : (
            /* --- 原始登录表单 --- */
            <div className="animate-in fade-in duration-300">
              <Auth
                supabaseClient={supabase}
                view="sign_in"
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#a3e635",
                        brandAccent: "#84cc16",
                        brandButtonText: "#000000",
                        defaultButtonBackground: "#171717",
                        defaultButtonBackgroundHover: "#262626",
                        inputBackground: "#0a0a0a",
                        inputBorder: "#262626",
                        inputBorderHover: "#a3e635",
                        inputBorderFocus: "#a3e635",
                        inputText: "#ffffff",
                        inputLabelText: "#525252",
                        dividerBackground: "#262626",
                      },
                      space: {
                        inputPadding: "12px",
                        buttonPadding: "12px",
                      },
                      radii: {
                        borderRadiusButton: "6px",
                        buttonBorderRadius: "6px",
                        inputBorderRadius: "6px",
                      },
                      fonts: {
                        bodyFontFamily: `ui-monospace, SFMono-Regular, monospace`,
                        buttonFontFamily: `ui-monospace, SFMono-Regular, monospace`,
                      },
                    },
                  },
                  className: {
                    container: "flex flex-col gap-4",
                    button:
                      "font-bold uppercase tracking-wider text-xs shadow-none border-0 transition-all active:scale-95",
                    input:
                      "font-mono text-sm placeholder:text-neutral-700 focus:ring-1 focus:ring-lime-400/50 transition-all",
                    label:
                      "font-mono text-[10px] uppercase tracking-widest font-bold mb-1.5 block",
                    message: "text-xs text-red-400 font-mono mt-2 text-center",
                    anchor:
                      "text-neutral-500 hover:text-lime-400 transition-colors text-xs font-mono underline-offset-4",
                    divider: "my-4",
                  },
                }}
                providers={["github"]}
                redirectTo={getURL()}
                theme="dark"
                showLinks={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: "Email Address",
                      password_label: "Access Key",
                      button_label: "Authenticate",
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
