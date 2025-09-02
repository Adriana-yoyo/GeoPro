// app/articles/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-2xl font-semibold text-gray-900">抱歉，文章不存在</h2>
      <p className="mt-2 text-gray-600">可能已被移动或删除。</p>
      <Link href="/articles" className="mt-6 text-purple-600 hover:underline">
        返回文章列表
      </Link>
    </div>
  );
}
