import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const { slug } = await params;               // 1. 正确取值
  const filePath = path.join(
    process.cwd(),
    "src/posts",
    `${slug}.md`
  );

  // 2. 文件不存在时直接 404
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const htmlContent = marked(content);

  return (
    <article className="prose dark:prose-invert">
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}