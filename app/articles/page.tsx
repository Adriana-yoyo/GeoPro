"use client"

import { useState } from "react"
import { Navigation } from "@/components/articles/navigation"
import { ArticleCard } from "@/components/articles/article-card"
import { ArticleModal } from "@/components/articles/article-modal"


// Mock data for articles
const articles = [
  {
    id: 1,
    title: "什么是GEO？生成式引擎优化将如何改变未来的搜索",
    description: "深入解析生成式引擎优化(GEO)的核心概念，探讨AI驱动的搜索引擎如何重塑内容发现和信息获取的未来。",
    date: "2024-01-15",
    content:
      "随着ChatGPT、Claude、Perplexity等AI搜索工具的兴起，传统的SEO正在向GEO转变。生成式引擎优化不再仅仅关注关键词排名，而是专注于如何让AI理解、信任并引用你的内容。这种转变意味着内容创作者需要重新思考内容策略，从面向搜索引擎转向面向AI模型的优化。GEO的核心在于提供准确、权威、结构化的信息，让AI能够准确理解并在回答用户问题时引用你的内容。",
    category: "GEO基础",
  },
  {
    id: 2,
    title: "为什么品牌在AI搜索时代必须重视GEO",
    description: "分析AI搜索时代品牌面临的新挑战，解释为什么GEO优化已成为品牌数字化战略的核心组成部分。",
    date: "2024-01-12",
    content:
      "在AI搜索时代，用户获取信息的方式发生了根本性变化。传统的搜索结果页面被AI生成的直接答案所取代，这意味着品牌需要确保自己的内容能够被AI准确理解和引用。不重视GEO的品牌将面临在AI搜索结果中被边缘化的风险。品牌需要建立权威性、提供准确信息、优化内容结构，确保在AI回答相关问题时能够被提及和推荐。这不仅关乎流量，更关乎品牌在数字世界中的存在感和影响力。",
    category: "品牌策略",
  },
  {
    id: 3,
    title: "提问意图图谱：GEO优化的核心武器",
    description: "介绍如何构建和使用提问意图图谱，这是GEO优化中最重要的策略工具之一。",
    date: "2024-01-10",
    content:
      "提问意图图谱是GEO优化的核心工具，它帮助我们理解用户在AI搜索中的真实需求。与传统SEO关注关键词不同，GEO需要深入分析用户的提问模式、意图层次和信息需求。通过构建完整的提问意图图谱，我们可以预测用户可能向AI提出的问题，并针对性地创建内容。这包括分析问题类型（事实性、比较性、操作性）、用户背景（专业程度、使用场景）和期望答案格式。掌握提问意图图谱，就掌握了GEO优化的核心竞争力。",
    category: "策略工具",
  },
  {
    id: 4,
    title: "品牌如何通过GEO建立可信度与权威性",
    description: "探讨品牌在AI搜索环境中建立权威性和可信度的具体方法和最佳实践。",
    date: "2024-01-08",
    content:
      "在AI搜索时代，权威性和可信度是决定内容是否被AI引用的关键因素。品牌需要通过多个维度建立权威性：首先是内容质量，提供准确、深入、有价值的信息；其次是引用网络，建立与权威机构和专家的连接；第三是一致性，确保跨平台信息的统一性；最后是透明度，清晰标注信息来源和更新时间。此外，品牌还需要积极参与行业讨论，发布原创研究，与权威媒体合作，逐步建立在AI眼中的专业形象。",
    category: "权威建设",
  },
  {
    id: 5,
    title: "GEO优化能为企业带来什么？流量、信任与品牌价值",
    description: "全面分析GEO优化为企业带来的多重价值，包括流量获取、信任建立和品牌价值提升。",
    date: "2024-01-05",
    content:
      "GEO优化为企业带来的价值远超传统SEO。首先是高质量流量：AI推荐的用户往往具有更明确的需求和更高的转化意向。其次是信任建设：被AI引用意味着内容获得了第三方背书，这种第三方背书极大提升了用户信任。第三是品牌价值：在AI回答中被频繁提及的品牌将获得更高的知名度和权威性。此外，GEO还能帮助企业建立长期的数字资产，因为优质的结构化内容将持续为AI提供价值，形成可持续的竞争优势。",
    category: "价值分析",
  },
  {
    id: 6,
    title: "GEO与AIGC：当内容生产与优化合二为一",
    description: "探索GEO优化与AI生成内容的深度融合，揭示内容生产和优化一体化的未来趋势。",
    date: "2024-01-03",
    content:
      "GEO与AIGC的结合代表了内容营销的未来方向。AI生成内容(AIGC)不仅能够大规模生产内容，更能够根据GEO原则自动优化内容结构和表达方式。这种融合带来了革命性变化：内容生产过程中就考虑了AI理解和引用的需求，实现了生产即优化。企业可以利用AIGC工具创建符合GEO标准的内容，同时通过GEO反馈不断优化AIGC的输出质量。这种良性循环将大大提升内容营销的效率和效果，让企业在AI搜索时代占据先机。",
    category: "技术融合",
  },
]

export default function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">精选文章</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            探索我们精心策划的GEO优化文章，获取最新的地理位置优化洞察和实用策略
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              // ✅ 只把“阅读全文”按钮点击事件传进去
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>
      </main>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}
