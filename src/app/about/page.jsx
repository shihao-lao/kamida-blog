import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/data";

export default async function About() {
  const profile = await getProfile();

  const name = profile?.name || "Kamida";
  const bio = profile?.bio || "热爱技术的前端开发者，喜欢分享学习心得和技术见解。";
  const avatar = profile?.avatar || "/img/avatar.jpg";
  const github = profile?.contact?.social?.github || "https://github.com/shihao-lao";

  return (
    <main
      className="min-h-screen py-16 px-6 font-sans"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* 返回首页链接 */}
        <div className="text-left mb-2 animate-leftIn">
          <Link
            href="/"
            className="inline-flex items-center font-medium transition-colors page-link"
          >
            <span className="mr-1">←</span> 返回首页
          </Link>
        </div>

        {/* 顶部标题 */}
        <h1
          className="text-4xl font-bold mt-12 mb-20 animate-leftIn"
          style={{ color: 'var(--text-primary)' }}
        >
          关于我
        </h1>

        {/* 核心个人卡片区域 */}
        <div className="flex flex-col md:flex-row gap-10 items-start animate-fadeInUp">
          {/* 左侧头像 */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <Image
                src={avatar}
                alt="Profile Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 右侧文字内容 */}
          <div className="w-full md:w-2/3 space-y-8">
            {/* 个人简介 */}
            <section>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                个人简介
              </h2>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                我是 {name}，一位热衷于写代码的前端开发小白，写博客来记录代码日常。
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                {bio}
              </p>
            </section>

            {/* GitHub 项目 */}
            <section>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                GitHub
              </h2>
              <p
                className="leading-relaxed mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                在我的 GitHub 主页上，您可以找到我参与和创建的各种项目。
                这些是我在<strong style={{ color: 'var(--brand-primary)' }}>
                  前端开发
                </strong>学习过程中的实践记录，包含了一些基础到进阶的代码实现。
                这些项目主要是我的学习心得，如果能为您提供一些参考和启发，我会非常开心。
              </p>
            </section>

            {/* 联系方式 */}
            <section>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                联系方式
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                欢迎通过 GitHub 与我交流：
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline ml-1 font-medium"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  @{name}
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* 分割线 */}
        <hr
          className="animate-fadeInUp"
          style={{ borderColor: 'var(--border-primary)' }}
        />

        {/* 底部博客介绍 */}
        <div className="space-y-10">
          {/* 关于博客 */}
          <section className="animate-fadeIn">
            <h2
              className="text-3xl font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              关于这个博客
            </h2>
            <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
              <p
                className="leading-relaxed text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                这是一个我用来记录前端学习历程的小角落，没有华丽的设计，也没有复杂的功能，就是想安安静静地写点东西。
              </p>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                当初搭建这个博客的初衷很简单：
              </p>
              <ul
                className="list-disc pl-5 space-y-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <li>想找个地方系统地整理前端学习笔记，避免学过就忘</li>
                <li>想通过实际项目练习 Next.js、React 等现代前端技术</li>
                <li>想和同样学习前端的小伙伴们分享一些心得体会</li>
              </ul>
              <p
                className="leading-relaxed mt-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                技术栈方面，我选择了 <strong style={{ color: 'var(--brand-primary)' }}>
                  Next.js
                </strong> 作为框架，因为它的 SSR/SSG 能力对博客类网站很友好，也能顺便学习 React Server
                Components 的新特性；样式方面用了 <strong style={{ color: 'var(--brand-primary)' }}>
                  Tailwind CSS
                </strong>，它的原子化设计让我能快速调整样式，专注于内容本身；部署则直接用了 Vercel，省心省力。
              </p>
            </div>
          </section>

          {/* 这里写什么 */}
          <section className="animate-fadeIn">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              这里会写什么
            </h2>
            <div className="prose prose-lg max-w-none">
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                既然是前端学习博客，内容当然会围绕前端技术展开，主要包括：
              </p>
              <ul
                className="list-disc pl-5 space-y-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    JavaScript 深入
                  </strong>
                  ：从基础语法到高级概念，再到一些有趣的技巧和最佳实践
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    React 生态
                  </strong>
                  ：组件设计、状态管理、性能优化，以及 Next.js 等框架的实践
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    CSS/Tailwind
                  </strong>
                  ：布局技巧、响应式设计、动画效果，让页面既好看又好用
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    工程化实践
                  </strong>
                  ：代码规范、构建工具、部署流程，提升开发效率的小工具
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    学习心得
                  </strong>
                  ：前端学习路上的坑与经验，以及一些学习方法的分享
                </li>
              </ul>
            </div>
          </section>

          {/* 技术细节 */}
          <section className="animate-fadeIn">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              一些技术细节
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-5 rounded-lg shadow-sm"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  性能优化
                </h3>
                <ul
                  className="list-disc pl-5 space-y-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <li>使用 Next.js Image 组件自动优化图片</li>
                  <li>组件懒加载与代码分割</li>
                  <li>静态生成 (SSG) 提升页面加载速度</li>
                  <li>自定义 CSS 动画替代重型动画库</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
