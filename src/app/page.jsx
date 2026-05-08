import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import VisitCounter from "@/components/VisitCounter";

export default async function HomePage() {
  const posts = await getAllPosts();

  // 确保即使没有posts也能正常显示页面
  const safePosts = posts || [];

  // 提取分类信息
  const categories = safePosts
    .map((post) => post.category || post.tag || "Blogging")
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部花纹横幅背景 */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-200/20 to-transparent shadow-lg -z-10"></div>
      <div className="relative w-full h-[850px] md:h-[900px] overflow-hidden flex items-center justify-center">
        <Image
          src="/img/background.jpg"
          alt="装饰背景"
          className="w-full h-full object-cover object-center"
          width={1920}
          height={1920}
        />
      </div> */}
      {/* 欢迎title */}
      <div className="container mx-auto px-4 md:px-6 pt-16">
        <div className="text-center animate-fadeIn flex items-center justify-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            欢迎来到Kamida的个人博客
          </h1>
          <ThemeToggle />
        </div>
      </div>
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 md:px-6 pt-16 ">
        {/* 博主信息和标题 */}
        <div className="text-center md:text-left md:pl-40 mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Blogger
          </h1>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-100 rounded-full transform -rotate-2 scale-105"></div>
            <p className="relative bg-white py-2 px-6 rounded-full text-gray-700 shadow-sm">
              Start blogging your day!
            </p>
          </div>
        </div>

        {/* 侧边栏导航和主内容区 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧导航 */}
          <div className="lg:w-1/4 animate-leftIn">
            <div className="bg-gray-50 rounded-xl py-10 sticky top-4">
              <div className="flex items-center justify-between gap-4 mb-6 px-4">
                {/* 左侧头像区域 */}
                <div className="flex-shrink-0">
                  <Image
                    src="/img/avatar.jpg"
                    alt="博主头像"
                    className=" object-cover rounded-full"
                    width={120}
                    height={120}
                  />
                </div>

                {/* 右侧路由跳转 */}
                <div className="flex-grow flex flex-col items-end space-y-3">
                  <Link
                    href="/"
                    className="text-gray-600  font-medium  transition-colors duration-200"
                  >
                    首页
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-600  font-medium  transition-colors duration-200"
                  >
                    关于我
                  </Link>
                </div>
              </div>

              {/* 座右铭 */}
              <div className="mb-8">
                <div className="text-sm text-gray-600 italic mb-3">Motto</div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-800">
                    热爱技术的前端开发者，喜欢分享学习心得和技术见解。
                  </p>
                </div>
              </div>

              {/* 访问次数统计 */}
              <div className="mb-6 px-4">
                <VisitCounter />
              </div>

              {/* 社交媒体链接 */}
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                  Social
                </div>
                <div className="space-y-2">
                  <a
                    href="https://github.com/shihao-lao"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-6 h-6 flex items-center justify-center text-gray-600">
                      🔗
                    </span>
                    <span className="text-sm text-gray-700">GitHub</span>
                  </a>
                  <a
                    href="https://juejin.cn/user/3994957074930676"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-6 h-6 flex items-center justify-center text-blue-400">
                      🐦
                    </span>
                    <span className="text-sm text-gray-700">稀土掘金</span>
                  </a>
                  {/* <a href="https://www.zhihu.com/people/kamida" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" target="_blank" rel="noopener noreferrer">
                    <span className="w-6 h-6 flex items-center justify-center text-blue-500">
                      🧠
                    </span>
                    <span className="text-sm text-gray-700">知乎</span>
                  </a>
                  <a href="https://weibo.com/kamida" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" target="_blank" rel="noopener noreferrer">
                    <span className="w-6 h-6 flex items-center justify-center text-red-500">
                      📱
                    </span>
                    <span className="text-sm text-gray-700">微博</span>
                  </a> */}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主内容区 */}
          <div className="lg:w-3/4 animate-rightIn">
            {/* 分类标签 */}
            {/* <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <div
                  key={category}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {category}
                </div>
              ))}
            </div> */}

            {/* 按标签分组显示文章 */}
            {categories.map((category) => {
              const postsByCategory = safePosts.filter(
                (post) => (post.category || post.tag || "Blogging") === category
              );

              return (
                <div key={category} className="mb-10">
                  {/* 标签标题 */}
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {category}
                    </h2>
                    <div className="ml-3 h-0.5 flex-grow bg-gray-200 rounded"></div>
                  </div>

                  {/* 该标签下的文章列表 */}
                  <div className="space-y-6">
                    {postsByCategory.map((post) => (
                      <Link
                        href={`/posts/${post.slug}`}
                        key={post.slug}
                        className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 p-5"
                      >
                        <div>
                          <h3 className="text-2xl font-bold text-blue-600 mb-3">
                            {post.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{post.date || "未知日期"}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tag && Array.isArray(post.tag) ? (
                              post.tag.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : post.tag ? (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {post.tag}
                              </span>
                            ) : post.category ? (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {post.category}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-gray-800 line-clamp-2">
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
              <div className="text-center py-16 text-gray-500">
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
