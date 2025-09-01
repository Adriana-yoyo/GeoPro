// app/articles/[slug]/page.tsx
import Link from "next/link";

type Article = {
  title: string;
  description?: string;
  category?: string;
  displayDate?: string;
  publishedAt?: string;
  content: string;
};

// 生成 <title> / og 等（可选：按需精简）
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/articles/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return { title: "文章详情" };
  const { frontmatter } = await res.json();
  return {
    title: frontmatter?.title || "文章详情",
    description: frontmatter?.description || "精选文章",
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // 读取单篇（你也可以直接用 fs 读，这里沿用我们做好的 API）
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/articles/${params.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600">未找到该文章。</p>
          <Link href="/articles" className="text-purple-600 hover:underline mt-6 inline-block">
            返回文章列表
          </Link>
        </div>
      </main>
    );
  }

  const data = await res.json();
  const fm = (data.frontmatter || {}) as Article;

  const title = fm.title || "精选文章";
  const description = fm.description || "精选文章";
  const category = fm.category || "精选文章";
  const date = fm.displayDate || (fm.publishedAt ? String(fm.publishedAt).slice(0, 10) : "精选文章");
  const content = (data.content as string) || "精选文章";

  return (
    <main className="px-6 py-16">
      <article className="prose max-w-3xl mx-auto">
        <div className="mb-6 text-sm text-gray-500 flex items-center gap-3">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
            {category}
          </span>
          <span>{date}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        <hr className="mb-6" />

        {/* 这里先用纯文本渲染；若需 Markdown，之后可换 react-markdown */}
        <div className="prose-p:leading-7 whitespace-pre-line text-gray-800">
          {content}
        </div>

        <div className="mt-10">
          <Link href="/articles" className="text-purple-600 hover:underline">
            ← 返回文章列表
          </Link>
        </div>
      </article>
    </main>
  );
}
