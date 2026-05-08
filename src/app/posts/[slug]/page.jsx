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
    return `<pre class="overflow-x-auto text-base"><code class="language-${validLang}">${highlighted}</code></pre>`;
  } catch (error) {
    return `<pre class="overflow-x-auto text-base"><code>${text}</code></pre>`;
  }
};

renderer.link = function ({ href, title, text }) {
  return `<a href="${href}" title="${
    title || ""
  }" rel="noopener noreferrer" class="hover:underline">${text}</a>`;
};

marked.use({
  renderer: renderer,
  gfm: true,
  breaks: true,
});

function AISummarySkeleton() {
  return (
    <div 
      className="rounded-2xl p-6 shadow-xl"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          AI 总结
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          生成中…
        </span>
      </div>
      <div className="mt-4 space-y-3 animate-pulse">
        <div className="h-3 w-11/12 rounded" style={{ backgroundColor: 'var(--border-primary)' }} />
        <div className="h-3 w-10/12 rounded" style={{ backgroundColor: 'var(--border-primary)' }} />
        <div className="h-3 w-9/12 rounded" style={{ backgroundColor: 'var(--border-primary)' }} />
      </div>
    </div>
  );
}

async function AISummaryPanel({ slug }) {
  if (!process.env.CHATANYWHERE_API_KEY) {
    return (
      <div 
        className="rounded-2xl p-6 shadow-xl"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)'
        }}
      >
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
  let highlights = [];
  let tags = [];
  let summaryStatus = null;
  let summaryError = "";

  try {
    const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const result = await articleSummary(content, { title: data.title });
    summary = typeof result?.summary === "string" ? result.summary : "";
    highlights = Array.isArray(result?.highlights) ? result.highlights : [];
    tags = Array.isArray(result?.tags) ? result.tags : [];
  } catch (error) {
    summaryStatus = error?.response?.status ?? null;
    summaryError =
      error?.response?.data?.error?.message ??
      error?.response?.data?.message ??
      error?.message ??
      "请求失败";
  }

  return (
    <div 
      className="rounded-2xl p-6 shadow-xl"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        AI 总结
      </h2>
      {summaryError ? (
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--error)' }}>
          {`总结生成失败${summaryStatus ? `（${summaryStatus}）` : ""}：${String(summaryError)}`}
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
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: 'var(--brand-primary-light)', 
                  color: 'var(--brand-primary)' 
                }}
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
    <div
      className="min-h-screen py-16 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="fixed inset-0 z-0">
        <Image
          src={randomBackground}
          alt="文章背景"
          fill
          priority
          sizes="100vw"
          quality={65}
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 opacity-5 backdrop-blur-lg z-0"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 text-left">
          <Link
            href="/"
            className="inline-flex items-center font-medium transition-colors duration-200"
            style={{ color: 'var(--text-link)' }}
          >
            <span className="mr-1">←</span> 返回首页
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 
            className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {data.title}
          </h1>

          <div className="flex justify-center items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {data.date && (
              <time dateTime={data.date} className="flex items-center gap-1">
                <span>📅</span> {data.date}
              </time>
            )}
            {data.category && (
              <span 
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: 'var(--brand-primary-light)', 
                  color: 'var(--brand-primary)' 
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
              className="rounded-2xl p-6 md:p-12 shadow-xl"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: 'var(--text-primary)',
                }}
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

        <div 
          className="mt-10 border-t pt-6 text-center text-sm"
          style={{ 
            borderColor: 'var(--border-primary)',
            color: 'var(--text-tertiary)'
          }}
        >
          <p>本文由AI辅助生成，仅供学习参考。</p>
          <p>感谢阅读！</p>
        </div>
      </div>
    </div>
  );
}
