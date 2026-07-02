"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOTTOS = [
  "代码改变世界，你改变代码。",
  "每一行代码都是进步的脚印。",
  "Bug 是成长的阶梯，不是绊脚石。",
  "今天学到的，就是明天的竞争力。",
  "保持热爱，奔赴下一场山海。",
  "不要怕慢，只怕站。",
  "技术的深度，来自不断的探索。",
  "你的坚持，终将美好。",
];

const INTERVAL = 4000;

export default function MottoCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % MOTTOS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="mb-8">
      <div
        className="text-xs tracking-widest uppercase mb-3 font-medium"
        style={{ color: "var(--text-tertiary)" }}
      >
        Motto
      </div>
      <div
        className="px-4 py-3 rounded-lg cursor-pointer select-none overflow-hidden"
        style={{
          background: "var(--bg-primary)",
          boxShadow: "var(--shadow-sm)",
        }}
        onClick={next}
        title="点击切换"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-xs leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              color: "var(--text-secondary)",
              fontStyle: "italic",
              fontFamily: "'Georgia', 'Noto Serif SC', serif",
              letterSpacing: "0.05em",
            }}
          >
            「{MOTTOS[index]}」
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
