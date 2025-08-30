"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Article {
  id: number
  title: string
  description: string
  date: string
  category: string
}

interface ArticleCardProps {
  article: Article
  onClick: () => void
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <Card
      // ❌ 去掉 cursor-pointer，✅ 如需明确可加 cursor-default
      className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="secondary"
            className="text-xs bg-gradient-to-br from-[#4057FC] to-[#9222FB] text-white border-0 hover:shadow-md transition-shadow"
          >
            {article.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(article.date).toLocaleDateString("zh-CN")}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground transition-colors line-clamp-2">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {article.description}
        </p>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          onClick={onClick}
          // ✅ 明确按钮为手型
          className="w-full cursor-pointer bg-white/75 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/85 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-saturate-150"
        >
          阅读全文
        </Button>
      </CardFooter>
    </Card>
  )
}
