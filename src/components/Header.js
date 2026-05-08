import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="top-0 z-10 backdrop-blur-sm border-b border-[var(--border-primary)] bg-[var(--bg-primary)] sticky">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <nav className="flex-1 flex items-center gap-8">
          <Link
            href="/"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
          >
            首页
          </Link>
          <Link
            href="/about"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
          >
            关于
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
