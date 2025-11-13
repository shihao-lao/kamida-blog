export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          关于我
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          这里是你的个人介绍，可以写一写技术栈、工作经历、兴趣爱好等。
        </p>

        <section className="space-y-6">
          <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              技能栈
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>前端：React / Next.js / TypeScript / Tailwind CSS</li>
              <li>后端：Node.js / Express / Supabase</li>
              <li>工具：Git / Docker / Vercel</li>
            </ul>
          </div>

          <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              联系我
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              邮箱：<a href="mailto:you@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">you@example.com</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}