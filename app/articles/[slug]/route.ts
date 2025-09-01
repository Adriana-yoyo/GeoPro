// app/api/articles/[slug]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const dir = path.join(process.cwd(), "content", "articles");
  for (const name of [`${params.slug}.md`, `${params.slug}.mdx`]) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const { data, content } = matter(raw);
      return NextResponse.json({ frontmatter: data, content });
    }
  }
  return new NextResponse("Not Found", { status: 404 });
}
