"use client";

import { useEffect, useMemo, useState } from "react";

export default function AISummaryTypewriter({
  text,
  fallback = "暂无总结",
  speedMs = 18,
}) {
  const safeText = useMemo(() => String(text ?? ""), [text]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!safeText) return;

    let cancelled = false;
    let timerId = null;

    const tick = () => {
      if (cancelled) return;
      setVisibleCount((n) => {
        const next = Math.min(n + 1, safeText.length);
        if (next >= safeText.length && timerId) clearInterval(timerId);
        return next;
      });
    };

    timerId = setInterval(tick, Math.max(8, Number(speedMs) || 18));
    return () => {
      cancelled = true;
      if (timerId) clearInterval(timerId);
    };
  }, [safeText, speedMs]);

  const shown = safeText ? safeText.slice(0, visibleCount) : "";
  const done = safeText && visibleCount >= safeText.length;

  return (
    <span className="whitespace-pre-wrap break-words">
      {shown || (!safeText ? fallback : "")}
      {!done && safeText ? (
        <span className="inline-block w-2 animate-pulse">|</span>
      ) : null}
    </span>
  );
}

