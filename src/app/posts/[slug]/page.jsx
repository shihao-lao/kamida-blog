import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { articleSummary } from "@/utils/api";
import AISummaryTypewriter from "@/components/AISummaryTypewriter";
import { Suspense } from "react";
import hljs from "highlight.js";

const renderer = new marked.Renderer();

renderer.heading = function ({ text, depth }) {
  const textStr = text || "";
  const escapedText = textStr
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5\-]/g, "");

  return `<h${depth} id="${escapedText}" class="scroll-mt-24 relative group">
    <a href="#${escapedText}" class="no-underline hover:underline">
      ${textStr}
    </a>
  </h${depth}>`;
};

renderer.code = function ({ text, lang }) {
  const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  try {
    const highlighted = hljs.highlight(text, { language: validLang }).value;
    return `<pre class="overflow-x-auto text-base" style="background: var(--code-bg); border: 1px solid var(--border-primary); border-radius: var(--radius-md);"><code class="language-${validLang}">${highlighted}</code></pre>`;
  } catch (error) {
    return `<pre class="overflow-x-auto text-base" style="background: var(--code-bg); border: 1px solid var(--border-primary); border-radius: var(--radius-md);"><code>${text}</code></pre>`;
  }
};

renderer.link = function ({ href, title, text }) {
  return `<a href="${href}" title="${
    title || ""
  }" rel="noopener noreferrer" class="hover:underline" style="color: var(--text-link);">${text}</a>`;
};

marked.use({ renderer: renderer, gfm: true, breaks: true });

function AISummarySkeleton() {
  return (
    <div className="ai-glass-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          AI 总结
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          生成中…
        </span>
      </div>
      <div className="mt-4 space-y-3 animate-pulse">
        <div className="h-3 w-11/12 rounded" style={{ background: 'var(--border-primary)' }} />
        <div className="h-3 w-10/12 rounded" style={{ background: 'var(--border-primary)' }} />
        <div className="h-3 w-9/12 rounded" style={{ background: 'var(--border-primary)' }} />
      </div>
    </div>
  );
}

async function AISummaryPanel({ slug }) {
  if (!process.env.CHATANYWHERE_API_KEY) {
    return (
      <div className="ai-glass-card p-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          AI 总结
        </h2>
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--error)' }}>
          总结生成失败：未配置 CHATANYWHERE_API_KEY
        </p>
      </div>
    );
  }

  let summary = "";
  let tags = [];
  let summaryError = "";

  try {
    const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const result = await articleSummary(content, { title: data.title });
    summary = typeof result?.summary === "string" ? result.summary : "";
    tags = Array.isArray(result?.tags) ? result.tags : [];
  } catch (error) {
    summaryError = error?.message ?? "请求失败";
  }

  return (
    <div className="ai-glass-card p-6">
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        AI 总结
      </h2>
      {summaryError ? (
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--error)' }}>
          总结生成失败：{String(summaryError)}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <AISummaryTypewriter text={summary} fallback="暂无总结" />
        </p>
      )}

      {!summaryError && tags.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            标签
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={`${idx}-${String(tag).slice(0, 20)}`}
                className="glass-tag text-xs px-2 py-1 rounded-full"
              >
                {String(tag)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const htmlContent = marked.parse(content);

  const backgroundImages = [
    "/img/text1.jpg",
    "/img/text2.jpg",
    "/img/text3.jpg",
    "/img/text4.jpg",
  ];

  const sum = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomBackground = backgroundImages[sum % backgroundImages.length];

  return (
    <div className="article-page min-h-screen py-16 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            opacity: 'var(--bg-image-opacity)',
          }}
        >
          <Image
            src={randomBackground}
            alt="文章背景"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
            style={{
              filter: 'var(--bg-image-filter)',
              transform: 'scale(1.05)',
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--bg-image-gradient)',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 返回首页链接 */}
        <div className="mb-8 text-left">
          <Link
            href="/"
            className="inline-flex items-center font-medium transition-colors page-link"
          >
            <span className="mr-1">←</span> 返回首页
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-12 text-center">
          <h1
            className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {data.title}
          </h1>

          <div className="flex justify-center items-center space-x-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {data.date && (
              <time dateTime={data.date} className="flex items-center">
                <span className="mr-1">📅</span> {data.date}
              </time>
            )}
            {data.category && (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                }}
              >
                {data.category}
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div
              className="article-glass p-6 md:p-12"
            >
              <div
                className="prose prose-lg max-w-none"
                style={{ color: 'var(--text-primary)' }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </article>

          <aside className="lg:col-span-4 self-start lg:sticky lg:top-8">
            <Suspense fallback={<AISummarySkeleton />}>
              <AISummaryPanel slug={slug} />
            </Suspense>
          </aside>
        </div>

        {/* 底部版权信息 */}
        <div
          className="mt-10 border-t pt-6 text-center text-sm"
          style={{ borderColor: 'var(--border-primary)', color: 'var(--text-tertiary)' }}
        >
          <p>本文由AI辅助生成，仅供学习参考。</p>
          <p>感谢阅读！</p>
        </div>
      </div>
    </div>
  );
}

