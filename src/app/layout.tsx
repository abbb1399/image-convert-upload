import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ToggleTheme";
import { NavTabs } from "@/components/NavTabs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이미지 webp 변환 및 업로드",
  description: "이미지를 webp로 변환하고 업로드하는 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="max-w-2xl mx-auto flex flex-col items-center px-4">
            <div className="w-full pt-8 pb-4">
              <NavTabs />
            </div>
            {children}
          </div>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
