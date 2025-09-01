// app/articles/[slug]/page.tsx

import Link from "next/link";

export const revalidate = 0; // 不缓存，便于你改完文章立即生效

type Frontmatter = {
  title?: string;
  description?: string;
  category?: string;
  displayDate?: string;
  publishedAt?: string | number | Date;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // 用你已存在的 API 读取 frontmatter，生成 <title> 等
  const res = await fetch(`/api/articles/${params.slug}`, { cache: "no-store" });
  if (!res.ok) return { title: "文章详情" };
  const { frontmatter } = await res.json();
  const fm = (frontmatter || {}) as Frontmatter;
  return {
    title: fm.title || "文章详情",
    description: fm.description || "精选文章",
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // 直接调用你已有的单篇 API；相对路径在服务端也可用
  const res = await fetch(`/api/articles/${params.slug}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <main className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-3">未找到该文章</h1>
          <p className="text-gray-600">请检查链接是否正确，或返回文章列表。</p>
          <Link href="/articles" className="text-purple-600 hover:underline mt-6 inline-block">
            ← 返回文章列表
          </Link>
        </div>
      </main>
    );
  }

  const data = await res.json();
  const fm = (data.frontmatter || {}) as Frontmatter;

  const title = fm.title || "精选文章";
  const description = fm.description || "精选文章";
  const category = fm.category || "精选文章";
  const date =
    fm.displayDate || (fm.publishedAt ? String(fm.publishedAt).slice(0, 10) : "精选文章");
  const content: string = data.content || "精选文章";

  return (
    <main className="px-6 py-16">
      <article className="max-w-3xl mx-auto">
        {/* meta 行 */}
        <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
            {category}
          </span>
          <span>{date}</span>
        </div>

        {/* 标题 & 摘要 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        <hr className="mb-6" />

        {/* 正文（先用纯文本换行展示；若你已在首页用 ReactMarkdown，这里也可替换） */}
        <div className="prose max-w-none text-gray-800 prose-p:leading-7 whitespace-pre-line">
          {content}
        </div>

        {/* 返回 */}
        <div className="mt-10">
          <Link href="/articles" className="text-purple-600 hover:underline">
            ← 返回文章列表
          </Link>
        </div>
      </article>
    </main>
  );
}
