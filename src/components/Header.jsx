"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="font-medium transition-colors navbar-link"
          >
            首页
          </Link>
          <Link
            href="/about"
            className="font-medium transition-colors navbar-link"
          >
            关于
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

