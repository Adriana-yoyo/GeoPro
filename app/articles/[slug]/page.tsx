// app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

// 根据你的 API 返回结构调整
type ArticleDetail = {
  slug: string;
  title: string;
  description?: string;
  content: string;
  category?: string;   // 存 slug 或名称都可
  displayDate?: string;
};

// —— 数据获取（服务端）——
async function getArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/articles?slug=${slug}`, {
      // 生产上可以用 'force-cache' 提升性能；后台改动后由重新部署/ISR 失效
      cache: "no-store",
      // 若你设置了自定义域，NEXTPUBLIC_SITE_URL 需要在 Vercel 环境变量中配置
    });
    if (!res.ok) return null;
    const data = await res.json();
    // 你的 /api/articles 如果是列表接口，这里挑出对应项
    const item = (data.items || []).find((i: any) => i.slug === slug);
    if (!item) return null;

    return {
      slug: item.slug,
      title: item.title,
      description: item.description,
      content: item.content,
      category: item.category,
      displayDate: item.displayDate || (item.publishedAt ? String(item.publishedAt).slice(0, 10) : ""),
    };
  } catch {
    return null;
  }
}

// —— 动态元信息 ——
// 注意：如果你的 API 很慢，可以只填最基础的 title，或改为静态 fallback
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) {
    return { title: "文章未找到 | GEO PRO" };
  }
  const title = article.title || "精选文章 | GEO PRO";
  const description = article.description || "精选文章";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/articles/${article.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "GEO PRO",
      locale: "zh_CN",
    },
    alternates: { canonical: url },
  };
}

// —— 页面主体 —— 
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/articles" className="text-sm text-purple-600 hover:underline">
          ← 返回文章列表
        </Link>

        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">{article.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {article.category && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
              {article.category}
            </span>
          )}
          {article.displayDate && <span>{article.displayDate}</span>}
          <button
            className="ml-auto text-purple-600 hover:underline"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              alert("链接已复制～");
            }}
          >
            复制链接
          </button>
        </div>

        <hr className="my-6 border-gray-200" />

        <article className="prose prose-lg max-w-none prose-p:leading-7">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
