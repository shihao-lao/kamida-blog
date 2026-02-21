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
import hljs from "highlight.js"; // 引入代码高亮库

// 1. 创建自定义渲染器
const renderer = new marked.Renderer();

/**
 * 核心修复：自定义标题 ID 生成逻辑
 * 必须确保生成的 ID 与你在 Markdown 目录中手动写的链接 (#...) 匹配
 */
renderer.heading = function ({ text, depth }) {
  // 获取纯文本（去除可能存在的内联 HTML）
  const textStr = text || "";

  // 生成 ID 的逻辑：
  // 1. 转小写
  // 2. 将空格替换为连字符
  // 3. 移除非中文、非字母数字、非连字符的特殊符号 (保留中文)
  const escapedText = textStr
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5\-]/g, "");

  // 添加 scroll-mt-24 是为了防止跳转后标题被顶部 Header 遮挡
  return `<h${depth} id="${escapedText}" class="scroll-mt-24 relative group">
    <a href="#${escapedText}" class="no-underline hover:underline">
      ${textStr}
    </a>
  </h${depth}>`;
};

// 2. 配置代码块高亮
renderer.code = function ({ text, lang }) {
  // 检查语言是否有效
  const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";

  try {
    const highlighted = hljs.highlight(text, { language: validLang }).value;
    // 使用更深的颜色并移除灰色背景
    return `<pre class=" overflow-x-auto text-base bg-transparent dark:bg-transparent border border-gray-200 dark:border-gray-700"><code class="language-${validLang} text-gray-800 dark:text-gray-200">${highlighted}</code></pre>`;
  } catch (error) {
    return `<pre class="overflow-x-auto text-base bg-transparent dark:bg-transparent border border-gray-200 dark:border-gray-700"><code class="text-gray-800 dark:text-gray-200">${text}</code></pre>`;
  }
};

// 3. 链接在新标签页打开（可选）
renderer.link = function ({ href, title, text }) {
  return `<a href="${href}" title="${
    title || ""
  }" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
};

// 4. 应用配置
marked.use({
  renderer: renderer,
  gfm: true, // 开启 GitHub 风格 Markdown
  breaks: true, // 开启换行符支持
});

function AISummarySkeleton() {
  return (
    <div className="bg-white opacity-80 dark:bg-gray-800 dark:bg-opacity-90 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          AI 总结
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          生成中…
        </span>
      </div>
      <div className="mt-4 space-y-3 animate-pulse">
        <div className="h-3 w-11/12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-10/12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-9/12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

async function AISummaryPanel({ slug }) {
  if (!process.env.CHATANYWHERE_API_KEY) {
    return (
      <div className="bg-white opacity-80 dark:bg-gray-800 dark:bg-opacity-90 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          AI 总结
        </h2>
        <p className="mt-4 text-sm leading-7 text-red-600 dark:text-red-400">
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
    <div className="bg-white opacity-80 dark:bg-gray-800 dark:bg-opacity-90 rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        AI 总结
      </h2>
      {summaryError ? (
        <p className="mt-4 text-sm leading-7 text-red-600 dark:text-red-400">
          {`总结生成失败${summaryStatus ? `（${summaryStatus}）` : ""}：${String(summaryError)}`}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
          <AISummaryTypewriter text={summary} fallback="暂无总结" />
        </p>
      )}

      {!summaryError && tags.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            标签
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={`${idx}-${String(tag).slice(0, 20)}`}
                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
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

  // 解析 Markdown
  const htmlContent = marked.parse(content);

  // 在服务器端生成伪随机背景图片 (基于 slug 固定)
  const backgroundImages = [
    "/img/text1.jpg",
    "/img/text2.jpg",
    "/img/text3.jpg",
    "/img/text4.jpg",
  ];

  // ✅ 核心修改：不再使用 Math.random()
  // 计算 slug 字符串所有字符的 ASCII 码之和，确保同一篇文章始终对应同一张背景图
  const sum = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomBackground = backgroundImages[sum % backgroundImages.length];

  return (
    <div
      className="min-h-screen py-16 relative overflow-hidden"
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
      {/* 模糊覆盖层 */}
      <div className="absolute inset-0  opacity-5 backdrop-blur-lg z-0"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 返回首页链接 */}
        <div className="mb-8 text-left">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <span className="mr-1">←</span> 返回首页
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight leading-tight">
            {data.title}
          </h1>

          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {data.date && (
              <time dateTime={data.date} className="flex items-center">
                <span className="mr-1">📅</span> {data.date}
              </time>
            )}
            {data.category && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-xs font-semibold">
                {data.category}
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div className="bg-white opacity-80 dark:bg-gray-800 dark:bg-opacity-90 rounded-2xl p-6 md:p-12 shadow-xl">
              <div
                className="
                  prose prose-lg max-w-none 
                  dark:prose-invert 
                  prose-headings:font-bold prose-headings:text-gray-800 dark:prose-headings:text-gray-100
                  prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-8
                  prose-li:text-gray-600 dark:prose-li:text-gray-300
                  prose-strong:text-blue-600 dark:prose-strong:text-blue-400
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code: prose-code:before:content-none prose-code:after:content-none
                "
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

        {/* 底部导航或版权信息 */}
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>本文由AI辅助生成，仅供学习参考。</p>
          <p>感谢阅读！</p>
        </div>
      </div>
    </div>
  );
}
