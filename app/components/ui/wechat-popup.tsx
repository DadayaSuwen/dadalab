"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, X } from "lucide-react";
import Image from "next/image";

interface WeChatPopupProps {
  children: React.ReactNode;
}

export default function WeChatPopup({ children }: WeChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const wechatId = "SoberDL0817";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black px-6 py-2 rounded-full uppercase font-bold text-sm hover:bg-black hover:text-white transition-colors"
      >
        {children}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white text-black rounded-2xl shadow-2xl p-6 w-80 z-50"
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-white rounded-xl overflow-hidden shadow-inner">
                <Image
                  width={1920}
                  height={1920}
                  src="/image/wechat-qr.png"
                  alt="WeChat QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div class="text-center">
                          <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                          </svg>
                          <p class="text-xs text-gray-500">QR Code</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>

            {/* WeChat ID */}
            <div className="text-center mb-4">
              <p className="text-xs font-mono text-gray-500 mb-2">WeChat ID</p>
              <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                <span className="font-mono font-bold text-lg">{wechatId}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-600 text-sm mt-2"
                  >
                    复制成功!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
