"use client";

import React, { useState, useRef, useEffect, useMemo, memo } from "react";
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
import FloatingLines from "../ui/floating-lines";
import Link from "next/link";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uScale;

  varying vec2 vUv;

  void main() {
    // 1. Cover 缩放 (UV 变换)
    vec2 uv = (vUv - 0.5) * uScale + 0.5;

    // 2. 鼠标距离计算
    float dist = distance(uv, uMouse);
    float decay = smoothstep(0.6, 0.0, dist) * uHover;
    
    // 3. 波浪变形 (限制幅度)
    float wave = sin(uv.y * 10.0 + uTime * 5.0) * 0.005 * decay;
    float waveX = cos(uv.x * 10.0 + uTime * 4.0) * 0.005 * decay;

    // 4. RGB 色散 (偏移量)
    // 注意：这里的偏移量最大约为 0.025，所以我们的安全边距(safeMargin)至少要预留 0.03 以上
    float r = texture2D(uTexture, uv + vec2(wave + 0.02 * decay, waveX)).r;
    float g = texture2D(uTexture, uv + vec2(wave, waveX)).g;
    float b = texture2D(uTexture, uv + vec2(wave - 0.02 * decay, waveX)).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const WebGLImage = memo(({ isVideoOpen }: { isVideoOpen: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const rawTexture = useTexture("/image/hero.jpg");

  const texture = useMemo(() => {
    const t = rawTexture.clone();
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }, [rawTexture]);

  const { viewport } = useThree();
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverTargetRef = useRef(0);

  // 3. 鼠标事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      mouseRef.current.set(x, y);
      hoverTargetRef.current = 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 4. Uniforms
  const uniforms = useMemo(() => {
    return {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
    };
  }, [texture]);

  // 5. 计算比例
  useEffect(() => {
    // 这里依然要做类型断言
    const img = texture.image as HTMLImageElement;
    if (!img || !img.width || !img.height) return;

    const imageAspect = img.width / img.height;
    const screenAspect = viewport.width / viewport.height;

    if (materialRef.current) {
      const safeMargin = 0.95;

      if (screenAspect > imageAspect) {
        materialRef.current.uniforms.uScale.value.set(
          1 * safeMargin,
          (imageAspect / screenAspect) * safeMargin
        );
      } else {
        materialRef.current.uniforms.uScale.value.set(
          (screenAspect / imageAspect) * safeMargin,
          1 * safeMargin
        );
      }
    }
  }, [viewport, texture]);

  // 6. 动画循环
  useFrame((state) => {
    if (!materialRef.current || isVideoOpen) return;

    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.1);

    hoverTargetRef.current = THREE.MathUtils.lerp(
      hoverTargetRef.current,
      0,
      0.05
    );

    materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHover.value,
      hoverTargetRef.current,
      0.1
    );

    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 120,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 120,
        0.05
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width * 1.05, viewport.height * 1.05, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
});

WebGLImage.displayName = "WebGLImage";

// --- 主组件 (保持你的布局逻辑不变) ---
export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const textBlur = useTransform(scrollYProgress, [0, 0.2], ["0px", "10px"]);

  const cardClipPath = useTransform(
    scrollYProgress,
    [0.1, 0.6],
    ["inset(100% 0% 0% 0% round 32px)", "inset(0% 0% 0% 0% round 32px)"]
  );

  const innerImageY = useTransform(scrollYProgress, [0.1, 0.6], ["15%", "0%"]);
  const buttonOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
  const buttonPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.6 ? "auto" : "none"
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-neutral-950 text-white h-[200vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        {/* 背景噪音 - 降低不透明度提高质感 */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="absolute inset-0 z-0 opacity-100">
          <FloatingLines
            linesGradient={["#a3e635", "#171717"]}
            mixBlendMode="screen"
            animationSpeed={0.5}
            lineDistance={10}
            bendStrength={0.5}
          />
        </div>

        {/* 文字内容 */}
        <motion.div
          style={{ opacity: textOpacity, scale: textScale, filter: textBlur }}
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10"
        >
          <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="text-xs font-mono text-lime-400 tracking-widest uppercase">
              Available for projects
            </span>
          </div>

          <div className="relative text-center mix-blend-difference">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-2">
              全栈开发 <span className="text-neutral-500">&</span> 开发设计
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-light tracking-wide mt-4 max-w-2xl mx-auto">
              开发好用的
              <span className="text-lime-400 font-mono ml-2">应用软件</span>
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-8 opacity-80">
            {[
              "React 生态",
              "3D 视觉 (Three.js)",
              "后端架构 (Node)",
              "移动端适配",
            ].map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-2 group cursor-default pointer-events-auto"
              >
                <div className="w-1 h-1 bg-neutral-600 rounded-full group-hover:bg-lime-400 transition-colors" />
                <span className="text-sm md:text-base font-mono text-neutral-300 group-hover:text-white transition-colors">
                  {tech}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex gap-4 pointer-events-auto">
            <Link
              href="#work"
              className="px-8 py-3 bg-lime-400 text-black font-bold rounded-full hover:bg-lime-300 transition-colors"
            >
              查看作品
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
            >
              联系我
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-neutral-500 font-mono text-xs tracking-[0.5em]"
          >
            滚动探索
          </motion.div>
        </motion.div>

        {/* WebGL 卡片层 */}
        <motion.div
          style={{
            clipPath: cardClipPath,
          }}
          className="relative z-30 w-[90vw] h-[70vh] md:w-[80vw] md:h-[80vh] bg-neutral-900 shadow-2xl overflow-hidden rounded-[32px] will-change-[clip-path]"
        >
          <motion.div
            style={{ y: innerImageY }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <div className="absolute inset-0 w-full h-full cursor-pointer">
              {/* 性能关键：限制 dpr 最大为 1.5，防止 4K 屏渲染压力过大 */}
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: false }}
              >
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

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-8 right-8 z-50 text-white hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} />
            </button>
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
