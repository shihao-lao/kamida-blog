"use client";

import { useState, useEffect, useCallback } from "react";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`;

  return date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
  });
}

export default function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!content.trim()) {
      setError("请输入评论内容");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          nickname: nickname.trim() || "匿名游客",
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setContent("");
        setSuccess("评论成功！");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "提交失败");
      }
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ai-glass-card p-5">
      <h3
        className="text-base font-bold mb-4 flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <span>💬</span> 欢迎留言
        <span
          className="text-xs font-normal px-2 py-0.5 rounded-full"
          style={{
            background: "var(--brand-primary-light)",
            color: "var(--brand-primary)",
          }}
        >
          {comments.length}
        </span>
      </h3>

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="mb-5 space-y-3">
        <input
          type="text"
          placeholder="昵称（选填）"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />
        <textarea
          placeholder="写下你的评论..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none transition-colors"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />

        {error && (
          <p className="text-xs" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs" style={{ color: "var(--success)" }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
          style={{
            background: "var(--brand-primary)",
            color: "var(--text-inverse)",
          }}
        >
          {submitting ? "提交中..." : "发表评论"}
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="h-3 w-20 rounded mb-2"
                  style={{ background: "var(--border-primary)" }}
                />
                <div
                  className="h-3 w-full rounded"
                  style={{ background: "var(--border-primary)" }}
                />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            还没有评论，来说点什么吧～
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="pb-4"
              style={{
                borderBottom: "1px solid var(--border-primary)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {comment.nickname}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {formatTime(comment.createdAt)}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
