"use client";

import { useEffect, useState } from "react";

/**
 * ViewCounter component
 * @param {string} slug - Article slug, or "global" for total views
 * @param {string} type - "page" for homepage, "article" for article page
 */
export default function ViewCounter({ slug = "global", type = "page" }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    const isArticle = type === "article" && slug !== "global";
    const apiUrl = isArticle ? `/api/views/${slug}` : "/api/views";

    // Increment view count
    fetch(apiUrl, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setViews(data.data.totalViews ?? data.data.views);
        }
      })
      .catch(() => {
        // Silently fail - don't show errors to users
      });
  }, [slug, type]);

  if (views === null) return null;

  return (
    <span
      className="flex items-center text-sm"
      style={{ color: "var(--text-tertiary)" }}
    >
      <span className="mr-1">👁</span> {views.toLocaleString()} 次
      {type === "article" ? "阅读" : "访问"}
    </span>
  );
}
