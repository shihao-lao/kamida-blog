import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { notFound } from "next/navigation";
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

  // 添加 scroll-mt-20 是为了防止跳转后标题被顶部 Header 遮挡
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-15 transition-colors duration-300">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

        {/* 文章内容 */}
        <div className=" dark:bg-gray-800 rounded-2xl md:p-12">
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

        {/* 底部导航或版权信息 */}
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>本文由AI辅助生成，仅供学习参考。</p>
          <p>感谢阅读！</p>
        </div>
      </article>
    </div>
  );
}
