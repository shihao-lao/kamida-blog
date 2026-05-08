import Link from "next/link";
export default function Header() {
  return (
    <header className="top-0 z-10 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-center items-center">
        <nav className="space-x-8">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            首页
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
