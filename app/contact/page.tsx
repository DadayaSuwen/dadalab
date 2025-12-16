"use client";
import { motion, useMotionValue } from "framer-motion";
import {
  ArrowRight,
  Send,
  Mail,
  MessageSquare,
  Building2,
  User,
  AlertCircle, // 新增图标用于显示错误
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { submitContactForm } from "@/app/actions/contact";

// --- 组件定义保持不变 ---
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * 0.35);
    position.y.set(middleY * 0.35);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ x, y }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const CustomInput = ({
  name,
  placeholder,
  width = "w-40 md:w-64",
  register,
  errors,
  ...props
}: {
  name: keyof FormData;
  placeholder: string;
  width?: string;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <span className={`relative inline-block mx-2 md:mx-4 ${width}`}>
    <input
      {...register(name)}
      type="text"
      placeholder={placeholder}
      className={`bg-transparent border-b-2 border-neutral-700 text-lime-400 placeholder-neutral-600 focus:border-lime-400 focus:outline-none transition-all duration-300 text-2xl md:text-5xl font-bold py-2 text-center w-full ${
        errors[name] ? "border-red-500" : ""
      }`}
      {...props}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1 text-center">
        {errors[name]?.message}
      </p>
    )}
  </span>
);

// Schema 定义 (与 Server Action 保持一致)
const formSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  company: z.string().min(2, "个人 / 组织至少需要2个字符"),
  projectType: z.string(),
  email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().min(10, "请至少输入10个字符的描述"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // 新增错误状态
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      projectType: "Website", // 默认值
      email: "",
      message: "",
    },
  });

  // 修改后的提交处理函数
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null); // 重置之前的错误

    try {
      // 调用 Supabase Server Action
      const result = await submitContactForm(data);

      if (result.success) {
        setSubmitSuccess(true);
        reset(); // 清空表单
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        // 显示后端返回的错误信息
        setErrorMessage(result.error || "提交失败，请稍后重试");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("网络连接异常，请检查您的网络设置");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-neutral-950 text-white overflow-hidden relative min-h-screen"
    >
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[50vw] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-sm font-mono text-lime-400 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Send className="w-4 h-4" /> Start a Conversation
          </h2>
          <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-8 leading-[0.9]">
            Tell us about <br /> Your Vision
          </h3>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl">
            我们期待与您合作，将您的创意转化为现实。请填写以下表单，我们将尽快与您联系。
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Natural Language Form - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-neutral-300"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap items-baseline gap-y-4 md:gap-y-8">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
                  你好，我是
                </span>
                <CustomInput
                  name="name"
                  placeholder="姓名"
                  width="w-28 md:w-40 lg:w-48"
                  register={register}
                  errors={errors}
                />
                <span>，来自</span>
                <CustomInput
                  name="company"
                  placeholder="个人 / 组织"
                  width="w-36 md:w-52 lg:w-64"
                  register={register}
                  errors={errors}
                />
                <span>。</span>

                <span className="block w-full h-2 lg:hidden"></span>

                <span className="flex items-center gap-2">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
                  请通过
                </span>
                <CustomInput
                  name="email"
                  placeholder="电子邮箱"
                  width="w-40 md:w-64 lg:w-80"
                  type="email"
                  register={register}
                  errors={errors}
                />
                <span>联系我。</span>
              </div>

              {/* Message textarea */}
              <div className="mt-12 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
                  <span className="text-xl md:text-2xl lg:text-3xl">
                    项目详情描述
                  </span>
                </div>
                <textarea
                  {...register("message")}
                  placeholder="请描述您的项目需求、预算范围和期望完成时间..."
                  className={`w-full bg-neutral-900/50 border-2 ${
                    errors.message ? "border-red-500" : "border-neutral-700"
                  } rounded-lg p-4 text-neutral-200 placeholder-neutral-600 focus:border-lime-400 focus:outline-none transition-all duration-300 text-base md:text-lg resize-none h-32 md:h-40`}
                  rows={5}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message?.message}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <Magnetic>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="relative w-full md:w-auto px-8 md:px-12 py-6 md:py-8 bg-lime-500 hover:bg-lime-400 text-black text-lg md:text-xl font-black uppercase tracking-widest rounded-full transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-lime-500/50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-4">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        发送中...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-4">
                        发送
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                      </span>
                    )}
                  </Button>
                </Magnetic>
              </div>
            </form>
          </motion.div>

          {/* Contact Information Cards - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h4 className="text-2xl font-bold text-white mb-6">联系方式</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">邮箱</p>
                      <p className="text-white text-lg">robjffian@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">微信</p>
                      <p className="text-white text-lg">SoberDL0817</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">地址</p>
                      <p className="text-white text-lg">广东广州</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-lime-500/10 to-emerald-500/10 border-lime-500/30 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h4 className="text-2xl font-bold text-white mb-4">响应时间</h4>
                <p className="text-neutral-300 mb-4">24小时内回复您的咨询</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-lime-500/20 text-lime-400 rounded-full text-sm">
                    快速响应
                  </span>
                  <span className="px-3 py-1 bg-lime-500/20 text-lime-400 rounded-full text-sm">
                    专业技术
                  </span>
                  <span className="px-3 py-1 bg-lime-500/20 text-lime-400 rounded-full text-sm">
                    售后支持
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 错误提示框 */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  提交失败
                </div>
                <p className="text-sm mt-1">{errorMessage}</p>
              </motion.div>
            )}

            {/* 成功提示框 */}
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
              >
                <p className="font-semibold">✓ 提交成功！</p>
                <p className="text-sm mt-1">
                  我们已收到您的信息，将尽快与您联系。
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
