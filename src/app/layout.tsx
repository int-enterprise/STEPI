import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STEPI - AI 지원자 평가 시스템 (프로토타입)",
  description:
    "AI가 지원자의 이력서/자기소개서를 분석해 평가 결과를 보여주는 HR SaaS 웹 프로토타입",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--app-bg)] text-[var(--text)]`}
      >
        {children}
      </body>
    </html>
  );
}
