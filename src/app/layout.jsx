import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Kamida Blog",
  description: "A simple blog built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
