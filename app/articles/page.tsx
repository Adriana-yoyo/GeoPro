"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/articles/navigation"
import { ArticleCard } from "@/components/articles/article-card"
import { ArticleModal } from "@/components/articles/article-modal"

// 页面内部使用的文章类型
type Article = {
  id: string
  title: string
  description: string
  date: string
  content: string
  category: string
}

export default function ArticlesPage() {
  const [items, setItems] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // 拉取文章列表
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" })
        const data = await res.json()

        const mapped: Article[] = (data.items || []).map((it: any) => ({
          id: String(it.slug || it.id || "精选文章"),
          title: it.title || "精选文章",
          description: it.description || "精选文章",
          date: it.displayDate || (it.publishedAt ? String(it.publishedAt).slice(0, 10) : "精选文章"),
          content: it.content || "精选文章",
          category: it.category || "精选文章",
        }))

        setItems(mapped)
      } catch (e) {
        console.error("[/articles] load articles failed:", e)
      }
    })()
  }, [])

  // 拉取分类并做 slug -> 中文名 映射
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        const map = new Map<string, string>()
        ;(data.items || []).forEach((c: any) => map.set(c.slug, c.name || "精选文章"))

        setItems(prev =>
          prev.map(a => ({
            ...a,
            category: map.get(a.category) || "精选文章",
          })),
        )
      } catch (e) {
        console.warn("[/categories] load categories failed:", e)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">精选文章</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            探索我们精心策划的 GEO 优化文章，获取最新洞察与实用策略
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {items.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}

          {!items.length && (
            <div className="col-span-full text-center text-muted-foreground">
              暂无文章，请在 /admin 新建一篇试试～
            </div>
          )}
        </div>
      </main>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}
