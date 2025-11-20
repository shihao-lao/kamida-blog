import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const { slug } = await params; // 1. 正确取值
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);

  // 2. 文件不存在时直接 404
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const htmlContent = marked(content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100 leading-tight">
          {data.title}
        </h1>
        {data.date && (
          <time className="text-sm text-gray-500 dark:text-gray-400 italic">
            发布日期: {data.date}
          </time>
        )}
      </header>
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </article>
  );
}
