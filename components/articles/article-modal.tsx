"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Article {
  id: number
  title: string
  description: string
  date: string
  content: string
  category: string
}

interface ArticleModalProps {
  article: Article
  onClose: () => void
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-sm text-muted-foreground">{new Date(article.date).toLocaleDateString("zh-CN")}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{article.title}</h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.description}</p>

            <div className="prose prose-gray max-w-none">
              <div className="text-foreground leading-relaxed space-y-4">
                <p>{article.content}</p>

                {/* Mock additional content */}
                <p>
                  在当今数字化时代，地理位置优化（GEO）已成为企业本地化成功的关键因素。无论您是刚开始接触GEO，还是希望提升现有本地化策略的效果，理解和应用正确的GEO原理都至关重要。
                </p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">核心策略要点</h2>

                <p>
                  成功的GEO策略需要综合考虑多个方面，包括地理数据优化、本地内容质量、用户位置体验以及本地化链接建设。每个环节都需要精心规划和持续优化。
                </p>

                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>地理位置关键词研究与分析</li>
                  <li>本地化网站结构优化</li>
                  <li>高质量本地内容创作</li>
                  <li>技术GEO实施</li>
                  <li>本地用户体验提升</li>
                </ul>

                <p>
                  通过系统性的方法和持续的努力，您可以显著提升企业在本地搜索中的表现，获得更多的本地流量和潜在客户。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
