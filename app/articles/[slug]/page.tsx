// app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

// 简单的 HTML 实体反转义（如果接口把 < > & 等转成了实体）
const decodeEntities = (s: string) =>
  (s || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// 根据你的 API 返回结构调整
type ArticleDetail = {
  slug: string;
  title: string;
  description?: string;
  content: string;         // 现在期待是一段 HTML 字符串
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
      content: item.content, // 这里应该是 HTML 字符串（若是实体会在下方 decode）
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

  // 处理正文：如果被转义（包含 &lt; 或 &gt;），先反转义
  const raw = (article.content || "").trim();
  const html =
    raw.includes("&lt;") || raw.includes("&gt;") ? decodeEntities(raw) : raw;

  return (
    <>
      {/* 注入 FAQ Schema 到 <head>（不影响正文；无 FAQ 不渲染） */}
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
            {/* 注意：如果这是服务端组件，这个 onClick 不会生效；需要的话将本文件改为 "use client" */}
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

          {/* —— 正文：强制用 HTML 渲染 —— */}
          <article className="prose prose-lg max-w-none prose-p:leading-7">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>

          {/* ↓↓↓ 本地调试：确认链路是否生效（dev 模式可见，部署前可删除） ↓↓↓ */}
          {process.env.NODE_ENV === "development" && (
            <section style={{ marginTop: 24, padding: 12, border: "1px dashed #ddd" }}>
              <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.7 }}>
                调试：下面应显示一个 H2 + 段落（用于验证 dangerouslySetInnerHTML 是否生效）
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: "<h2>Sanity H2</h2><p>如果你看到这是大号小标题，说明 HTML 渲染链路 OK。</p>",
                }}
              />
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                原始 content 前 160 个字符（用于确认是否被转义）：
              </div>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  background: "#f6f8fa",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                {raw.slice(0, 160)}
              </pre>
            </section>
          )}
          {/* ↑↑↑ 本地调试 ↑↑↑ */}
        </div>
      </main>
    </>
  );
}
