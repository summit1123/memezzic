import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "meme zzic | 밈찍",
  description: "셀카 한 장으로 찍는 AI 중계샷 & 리액션 밈",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
