import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { NavigationMenu } from "@/components/ui/navigation-menu";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://geopro-forbusiness.vercel.app"),
  title: {
    default: "GEO PRO｜专业 AI 搜索优化解决方案",
    template: "%s · GEO PRO",
  },
  description:
    "我们为企业提供专业生成式 AI 搜索优化方案：中文内容策略、FAQ 结构化与知识图谱建设，助力品牌在文心一言、Kimi、智谱、讯飞等 AI 搜索中获得更高可见度与转化。",
  generator: "GEO - AI搜索优化 by GEO PRO",

  alternates: {
    canonical: "https://geopro-forbusiness.vercel.app/",
  }, 

  openGraph: {
    type: "website",
    url: "https://geopro-forbusiness.vercel.app/",
    siteName: "GEO PRO",
    title: "中国市场 GEO（生成式 AI 搜索优化）服务｜GEO PRO",
    description:
      "中文优先、结构化 FAQ、知识图谱与权威引用，面向文心一言 / Kimi / 智谱 / 讯飞等 AI 搜索。",
    locale: "zh_CN",
  },

  twitter: {
    card: "summary_large_image",
    title: "GEO PRO｜专业 AI 搜索优化解决方案",
    description:
      "中文优先、结构化 FAQ、知识图谱与权威引用，面向文心一言 / Kimi / 智谱 / 讯飞等 AI 搜索。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body>
        {/* 全局导航：主页与 /articles 等子页面都会共享 */}
        <NavigationMenu />
        {children}
      </body>
    </html>
  );
}
