"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Play, X } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// --- 1. 新的 Vertex Shader (机械抖动) ---
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  
  // 伪随机函数
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // --- 机械震动 (Glitch Shake) ---
    // 只有在 hover 时才应用
    // 使用高频 sin 函数模拟电流不稳定的抖动
    float shake = random(vec2(uTime, 0.0)) * 2.0 - 1.0; 
    
    // 仅在 X 轴方向极其微小的快速震动
    pos.x += shake * 0.005 * uHover; 
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// --- 2. 新的 Fragment Shader (RGB色差 + 水平撕裂) ---
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  // 随机函数
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    
    // --- 效果1: 水平切片撕裂 (Horizontal Slicing) ---
    // 把 Y 轴分成 20 个切片
    float sliceY = floor(uv.y * 20.0); 
    // 根据时间和切片位置计算一个随机的水平偏移量
    float sliceOffset = (random(vec2(sliceY, floor(uTime * 20.0))) - 0.5) * 0.05 * uHover;
    
    // 应用偏移到 X 轴
    vec2 distortedUV = uv + vec2(sliceOffset, 0.0);
    
    // --- 效果2: RGB 色差分离 (Chromatic Aberration) ---
    // 红色通道向左偏，蓝色通道向右偏，强度由 uHover 控制
    float rOffset = 0.02 * uHover;
    float bOffset = -0.02 * uHover;

    float r = texture2D(uTexture, distortedUV + vec2(rOffset, 0.0)).r;
    float g = texture2D(uTexture, distortedUV).g;
    float b = texture2D(uTexture, distortedUV + vec2(bOffset, 0.0)).b;
    
    // 混合一点噪点增加“脏”的质感
    float noise = random(uv + uTime) * 0.1 * uHover;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

// --- 3. 微调组件逻辑 (让过渡更干脆) ---
const WebGLImage = ({ isVideoOpen }: { isVideoOpen: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/image/hero.jpg");

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    [texture]
  );

  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = () => {
      if (isVideoOpen) return;

      // --- 机械感的动画参数修改 ---
      // 这里的动画不再是缓慢的 ease，而是更快速、更像开关的“冲击”
      gsap.to(uniforms.uHover, {
        value: 1,
        duration: 0.1, // 极快进入 (0.1秒)，产生撞击感
        ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})", // 如果没有引入 roughEase 插件，可以用 "steps(5)" 或简单的 "power4.out"
        // 简单版用下面这个:
        // ease: "power4.out",
        overwrite: true,
        onComplete: () => {
          // 恢复时稍微带一点余震
          gsap.to(uniforms.uHover, {
            value: 0,
            duration: 0.4,
            ease: "bounce.out",
          });
        },
      });
    };

    // 提示：由于原来的逻辑是 mousemove 就触发一次完整的动画流程，
    // 对于“持续悬停保持故障”的效果，通常需要改逻辑。
    // 但为了保持代码结构不动，这里设置的是“鼠标一动就闪烁一下”的效果。
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [uniforms, isVideoOpen]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value =
        state.clock.getElapsedTime();

      // 移除之前的平滑旋转，保持机械的冷峻感，或者保留极其微小的旋转
      if (!isVideoOpen) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          (state.pointer.x * Math.PI) / 60,
          0.1
        );
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          (-state.pointer.y * Math.PI) / 60,
          0.1
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />{" "}
      {/* 机械故障不需要细分的网格，1x1 就够了，性能更好 */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};
// --- 主组件 ---
export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 文字动画
  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.2]);
  const textBlur = useTransform(scrollYProgress, [0, 0.1], ["0px", "10px"]);

  // --- 关键修改：带圆角的遮罩揭示 ---
  // 使用 inset(... round 32px) 语法，确保在揭示过程中，裁剪区域本身就是带圆角的
  const cardClipPath = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    [
      "inset(100% 0% 0% 0% round 32px)", // 初始状态：从底部完全闭合，带圆角
      "inset(0% 0% 0% 0% round 32px)", // 结束状态：完全展开，保留圆角
    ]
  );

  // 内部图片视差
  const innerImageY = useTransform(scrollYProgress, [0.1, 0.5], ["15%", "0%"]);

  // 按钮显现
  const buttonOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const buttonPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.5 ? "auto" : "none"
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-neutral-950 text-white"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* 文字层 */}
        <motion.div
          style={{ opacity: textOpacity, scale: textScale, filter: textBlur }}
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10"
        >
          <div className="relative">
            <h1 className="text-[18vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 leading-none">
              DIGITAL
            </h1>
            <h1 className="text-[18vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 leading-none mt-[-4vw]">
              REALITY
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-neutral-500 font-mono text-xs tracking-[0.5em]"
          >
            SCROLL TO REVEAL
          </motion.div>
        </motion.div>

        {/* WebGL 卡片层 */}
        <motion.div
          style={{
            clipPath: cardClipPath, // 这里应用带圆角的遮罩
          }}
          // 添加 rounded-[32px] 作为一个兜底，同时 overflow-hidden 确保内容不溢出
          className="relative z-30 w-[90vw] h-[70vh] md:w-[80vw] md:h-[80vh] bg-neutral-900 shadow-2xl overflow-hidden rounded-[32px] will-change-[clip-path]"
        >
          {/* 内层视差容器 */}
          <motion.div
            style={{ y: innerImageY }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <div className="absolute inset-0 w-full h-full cursor-pointer">
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                <WebGLImage isVideoOpen={isVideoOpen} />
              </Canvas>
            </div>

            <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-end p-10 md:p-20">
              <motion.div style={{ opacity: buttonOpacity }}>
                <h2 className="text-4xl md:text-7xl font-bold text-white mb-2 mix-blend-difference">
                  沉浸式 <br /> 交互体验
                </h2>
              </motion.div>
            </div>

            <motion.div
              style={{
                opacity: buttonOpacity,
                pointerEvents: buttonPointerEvents,
              }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto"
            >
              <button
                onClick={() => setIsVideoOpen(true)}
                className="group relative flex items-center justify-center"
              >
                <div className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:bg-white/10" />
                <Play className="absolute w-8 h-8 text-white fill-white transition-transform duration-300 group-hover:scale-75" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 视频弹窗 - 也加上了 rounded-3xl */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-8 right-8 z-50 text-white hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} />
            </button>
            {/* 这里的 rounded-3xl 控制视频圆角 */}
            <video
              autoPlay
              controls
              className="w-[80vw] aspect-video rounded-3xl shadow-2xl border border-white/10"
              src="/video/hero.mp4"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
