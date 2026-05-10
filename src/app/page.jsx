import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const posts = await getAllPosts();
  const safePosts = posts || [];
  const categories = safePosts
    .map((post) => post.category || post.tag || "Blogging")
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* 欢迎标题 */}
      <div className="container px-4 md:px-6 pt-16">
        <div className="text-center animate-fadeIn">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            欢迎来到Kamida的个人博客
          </h1>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container px-4 md:px-6 pt-16">
        {/* 博主信息和标题 */}
        <div className="text-center md:text-left md:pl-40 mb-8 animate-fadeIn">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Blogger
          </h1>
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full transform -rotate-2 scale-105"
              style={{ background: 'var(--brand-primary-light)' }}
            ></div>
            <p
              className="relative py-2 px-6 rounded-full shadow-sm"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              Start blogging your day!
            </p>
          </div>
        </div>

        {/* 侧边栏导航和主内容区 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧导航 */}
          <div className="lg:w-1/4 animate-leftIn">
            <div
              className="rounded-xl py-10 sticky top-4"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-6 px-4">
                {/* 左侧头像区域 */}
                <div className="flex-shrink-0">
                  <Image
                    src="/img/avatar.jpg"
                    alt="博主头像"
                    className="object-cover rounded-full"
                    width={120}
                    height={120}
                  />
                </div>

                {/* 右侧路由跳转 */}
                <div className="flex-grow flex flex-col items-end space-y-3">
                  <Link
                    href="/"
                    className="font-medium transition-colors sidebar-link"
                  >
                    首页
                  </Link>
                  <Link
                    href="/about"
                    className="font-medium transition-colors sidebar-link"
                  >
                    关于我
                  </Link>
                </div>
              </div>

              {/* 座右铭 */}
              <div className="mb-8">
                <div
                  className="text-sm italic mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Motto
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <p style={{ color: 'var(--text-primary)' }}>
                    热爱技术的前端开发者，喜欢分享学习心得和技术见解。
                  </p>
                </div>
              </div>

              {/* 社交媒体链接 */}
              <div className="mb-6">
                <div
                  className="text-sm font-bold mb-3 uppercase tracking-wider"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Social
                </div>
                <div className="space-y-2">
                  <a
                    href="https://github.com/shihao-lao"
                    className="flex items-center gap-3 p-2 rounded-lg transition-all sidebar-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-6 h-6 flex items-center justify-center">🔗</span>
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a
                    href="https://juejin.cn/user/3994957074930676"
                    className="flex items-center gap-3 p-2 rounded-lg transition-all sidebar-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-6 h-6 flex items-center justify-center">🐦</span>
                    <span className="text-sm">稀土掘金</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主内容区 */}
          <div className="lg:w-3/4 animate-rightIn">
            {/* 按标签分组显示文章 */}
            {categories.map((category) => {
              const postsByCategory = safePosts.filter(
                (post) => (post.category || post.tag || "Blogging") === category
              );

              return (
                <div key={category} className="mb-10">
                  {/* 标签标题 */}
                  <div className="flex items-center mb-4">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {category}
                    </h2>
                    <div
                      className="ml-3 h-0.5 flex-grow rounded"
                      style={{ background: 'var(--border-primary)' }}
                    ></div>
                  </div>

                  {/* 该标签下的文章列表 */}
                  <div className="space-y-6">
                    {postsByCategory.map((post) => (
                      <Link
                        href={`/posts/${post.slug}`}
                        key={post.slug}
                        className="block rounded-xl overflow-hidden transition-all duration-300 p-5 post-card"
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        <div>
                          <h3
                            className="text-2xl font-bold mb-3"
                            style={{ color: 'var(--brand-primary)' }}
                          >
                            {post.title}
                          </h3>
                          <div
                            className="flex items-center text-sm mb-4"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            <span>{post.date || "未知日期"}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tag && Array.isArray(post.tag) ? (
                              post.tag.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 rounded-full text-sm tag"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : post.tag ? (
                              <span className="px-3 py-1 rounded-full text-sm tag">
                                {post.tag}
                              </span>
                            ) : post.category ? (
                              <span className="px-3 py-1 rounded-full text-sm tag">
                                {post.category}
                              </span>
                            ) : null}
                          </div>
                          <p
                            className="line-clamp-2"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {post.excerpt || `# ${post.title} ...`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 空状态 */}
            {safePosts.length === 0 && (
              <div
                className="text-center py-16"
                style={{ color: 'var(--text-tertiary)' }}
              >
                暂无文章，敬请期待～
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 页脚组件 */}
      <Footer />
    </div>
  );
}

