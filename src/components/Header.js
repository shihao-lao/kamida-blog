import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-purple-200/80 dark:bg-purple-900/40 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Kamida&apos;s Blog
        </Link>
        <nav className="space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            首页
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
