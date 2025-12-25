"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import WeChatPopup from "../wechat-popup";

/**
 * Footer Static Content - 客户端组件
 * Footer 静态内容部分，包含微信交互功能
 */
export default function FooterStatic() {
  const [currentTime, setCurrentTime] = useState("");

  // Update time every second
  useState(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-end border-t border-black/20 pt-10">
      <div className="flex flex-col gap-4 mb-8 md:mb-0">
        <div className="flex items-center gap-4 relative">
          <WeChatPopup>微信</WeChatPopup>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold max-w-sm mt-4"
        >
          创造技术体验，
          <br /> 连接想法与实现。
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-end gap-2 font-mono uppercase text-sm font-medium"
      >
        <span className="block mb-2">Guanzhou, China</span>
        <div className="flex items-center gap-2 bg-black text-lime-500 px-3 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
          <span>{currentTime} Local time</span>
        </div>
        <span className="opacity-50 mt-2">© 2025 Dada Studio</span>
      </motion.div>
    </div>
  );
}
