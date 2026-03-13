import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartHire Eval",
  description: "SmartHire Eval candidate evaluation dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased bg-[var(--app-bg)] text-[var(--text)]">{children}</body>
    </html>
  );
}
