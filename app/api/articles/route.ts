// app/api/articles/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 明确用 Node.js 运行时 & 不缓存（每次请求都新读文件快照）
export const runtime = "nodejs";
export const revalidate = 0;

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

type Item = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  displayDate?: string | null;
  publishedAt?: string | null;
  cover?: string | null;
  content: string; // 我们需要全文给弹窗使用
};

// 统一“展示时间”优先级：displayDate > publishedAt(日期部分)
function pickDisplayDate(a: { displayDate?: string | null; publishedAt?: string | null }) {
  return a.displayDate || (a.publishedAt ? String(a.publishedAt).slice(0, 10) : "");
}

export async function GET() {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return NextResponse.json({ items: [] });
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.mdx?$/i.test(f));

    const items: Item[] = files.map((file) => {
      const full = path.join(CONTENT_DIR, file);
      const raw = fs.readFileSync(full, "utf-8");
      const { data, content } = matter(raw);
      const slug = (data.slug as string) || file.replace(/\.mdx?$/i, "");
      return {
        id: slug,
        slug,
        title: data.title || slug,
        description: data.description || "",
        category: data.category || "",
        displayDate: data.displayDate || null,
        publishedAt: data.publishedAt || null,
        cover: data.cover || null,
        content, // 直接返回正文给首页弹窗
      };
    });

    // 排序：按“展示时间”降序
    items.sort((a, b) => pickDisplayDate(b).localeCompare(pickDisplayDate(a)));

    return NextResponse.json({ items });
  } catch (e) {
    console.error("[/api/articles] read failed:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
