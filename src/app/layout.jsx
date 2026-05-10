import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Kamida Blog",
  description: "A simple blog built with Next.js",
};

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning={true}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
