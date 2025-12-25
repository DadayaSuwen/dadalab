"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Setup
    gsap.registerPlugin(ScrollTrigger);
    const scene = new THREE.Scene();
    // 雾气稍微调淡一点，配合杂志风格
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);
    canvasRef.current.innerHTML = ""; // 防止热重载重复添加
    canvasRef.current.appendChild(renderer.domElement);

    // 2. Objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 核心：黑曜石材质
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.9,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 外壳：荧光绿线框
    const wireGeometry = new THREE.IcosahedronGeometry(2.3, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    mainGroup.add(wireMesh);

    // 粒子环绕
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 25;
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pos, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xa3e635,
      opacity: 0.4,
      transparent: true,
    });
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xa3e635, 30);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = 0.5;
    scene.add(spotLight);
    const blueLight = new THREE.PointLight(0x3b82f6, 5); // 加一点冷光对比
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // 4. Animations
    // 持续自转
    gsap.to(coreMesh.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none",
    });
    gsap.to(wireMesh.rotation, {
      y: -Math.PI * 2,
      x: Math.PI,
      duration: 30,
      repeat: -1,
      ease: "none",
    });

    // 滚动交互 (ScrollTrigger)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // 滚动时：核心解构 -> 放大 -> 重新聚合
    tl.to(wireMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1 })
      .to(coreMesh.rotation, { x: Math.PI * 2, duration: 1 }, "<")
      .to(camera.position, { z: 4, duration: 1 }, "<")
      .to(wireMesh.material, { opacity: 0.5 }, "<"); // 线框变亮

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Render Loop
    let reqId: number;
    const animate = () => {
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-neutral-950 min-h-[250vh] text-white selection:bg-lime-400 selection:text-black"
    >
      {/* 3D Background Layer */}
      <div
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-80"
      />

      {/* Content Layer */}
      <main className="relative z-10">
        {/* Section 1: Introduction */}
        <section className="pt-32 flex flex-col justify-end pb-24 px-6 md:px-12 border-b border-white/10">
          <div className="max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-lime-400"></div>
              <span className="text-lime-400 font-mono text-xs tracking-[0.2em] uppercase">
                Based in Guangzhou
              </span>
            </div>

            <h1 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter mix-blend-exclusion">
              Creative <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-white/50">
                Developer.
              </span>
            </h1>

            <div className="mt-12 flex justify-between items-end max-w-4xl">
              <p className="text-neutral-400 text-lg md:text-xl max-w-md font-light leading-relaxed">
                个人介绍
                <span className="text-white block mt-2 font-medium">
                  全栈开发 / 3年全栈经验 / 2027 准毕业生
                </span>
              </p>
              <div className="hidden md:block animate-bounce text-lime-400">
                <ArrowUpRight className="w-8 h-8 rotate-180" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-4 mb-16">
              <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
                01 / Career & Education
              </h2>
              <div className="h-px flex-1 bg-neutral-800"></div>
            </div>

            {/* List Container */}
            <div className="flex flex-col">
              {/* Item 1: Experience */}
              <ListItem
                year="2022 - 2024"
                title="广东数果科技"
                role="前端开发工程师"
                tags={["React组件", "数据可视化", "性能优化"]}
                description="曾经负责公司前后端低代码项目开发。专门处理复杂的图表渲染问题，独立完成开发和交付。"
              />

              <ListItem
                year="2025 - 2027"
                title="广州软件学院"
                role="智能科学与技术"
                tags={["本科学历", "计算机科学"]}
                description="目前正在读书中"
              />

              <ListItem
                year="CURRENT"
                title="技术能力"
                role="全栈开发"
                tags={["Next.js", "Three.js", "Node.js", "PostgreSQL"]}
                description="技术栈全面，不拘一格。不仅精通现代前端开发的各种工具和框架，还能独立搞定后端服务和数据库设计，致力于为用户打造从头到尾都顺畅无比的使用体验。"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- 子组件: 交互式列表项 ---
function ListItem({
  year,
  title,
  role,
  tags,
  description,
}: {
  year: string;
  title: string;
  role: string;
  tags: string[];
  description: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="group border-b border-white/10 transition-colors duration-500 hover:border-lime-400/50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="py-12 flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12 cursor-pointer relative overflow-hidden">
        {/* Hover Background Highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        {/* Column 1: Year */}
        <div className="w-32 flex-shrink-0">
          <span className="font-mono text-xs text-lime-400 border border-lime-400/30 px-2 py-1 rounded-full">
            {year}
          </span>
        </div>

        {/* Column 2: Main Info */}
        <div className="flex-1">
          <h3 className="text-4xl md:text-6xl font-black uppercase text-white group-hover:text-lime-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xl text-neutral-400 mt-2 font-light">{role}</p>
        </div>

        {/* Column 3: Icon */}
        <div className="flex-shrink-0 pr-4">
          {isOpen ? (
            <Minus className="text-lime-400" />
          ) : (
            <Plus className="text-neutral-500" />
          )}
        </div>
      </div>
      {/* Expandable Details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-0 md:pl-44 pb-12 pr-4 md:pr-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="text-neutral-300 leading-relaxed text-lg font-light">
                {description}
              </p>
              <div className="flex flex-wrap content-start gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-neutral-900 border border-white/10 rounded text-xs font-mono text-neutral-400 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
