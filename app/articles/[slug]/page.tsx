// app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

type ArticleDetail = {
  slug: string;
  title: string;
  description?: string;
  content: string;        // 直接存纯文字
  category?: string;
  displayDate?: string;
  faq?: { q: string; a: string }[];
};

// —— 数据获取（服务端）——
async function getArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/articles?slug=${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = (data.items || []).find((i: any) => i.slug === slug);
    if (!item) return null;

    return {
      slug: item.slug,
      title: item.title,
      description: item.description,
      content: item.content, // 这里就是纯文字
      category: item.category,
      displayDate:
        item.displayDate ||
        (item.publishedAt ? String(item.publishedAt).slice(0, 10) : ""),
      faq: item.faq,
    };
  } catch {
    return null;
  }
}

// —— 动态元信息 ——
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
export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  // FAQ -> JSON-LD（无 FAQ 不注入）
  const faqEntities = (article.faq ?? []).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
  const jsonLd =
    faqEntities.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntities,
        }
      : null;

  // —— 简单的文字 -> HTML 规则 ——
  const paragraphs = (article.content || "")
    .split(/\n+/) // 按换行分割
    .filter((line) => line.trim().length > 0);

  return (
    <>
      {jsonLd && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/articles" className="text-sm text-purple-600 hover:underline">
            ← 返回文章列表
          </Link>

          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            {article.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {article.category && (
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                {article.category}
              </span>
            )}
            {article.displayDate && <span>{article.displayDate}</span>}
          </div>

          <hr className="my-6 border-gray-200" />

          <article className="prose prose-lg max-w-none prose-p:leading-7">
            {paragraphs.map((line, idx) =>
              line.startsWith("# ")
                ? <h2 key={idx}>{line.replace("# ", "").trim()}</h2>
                : <p key={idx}>{line}</p>
            )}
          </article>
        </div>
      </main>
    </>
  );
}
