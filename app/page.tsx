"use client";

import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  MessageCircle,
  Mail,
  Star,
  Sparkles,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";

// 类型
interface Article {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  category: string;
  content: string;
}
type HomeArticle = Article;

type ArticleModalProps = {
  article: Article | null;
  onClose: () => void;
};

const ArticleModal = ({ article, onClose }: ArticleModalProps) => {
  const [mounted, setMounted] = useState(false);

  // 仅在客户端挂载后再渲染 Portal，避免 "document is undefined" / 水合时机问题
  useEffect(() => {
    setMounted(true);
  }, []);

  // 锁滚动 + ESC 关闭
  useEffect(() => {
    if (!mounted || !article) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, article, onClose]);

  if (!article || !mounted) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-8
                 bg-black/40 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 内容 */}
        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
            {article.category && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {article.category}
              </span>
            )}
            {article.publishDate && <span>{article.publishDate}</span>}
            {article.readTime && <span>{article.readTime}</span>}
          </div>

          <h2 className="mb-2 text-3xl font-bold leading-tight text-gray-900">{article.title}</h2>
          {article.description && <p className="mb-6 text-lg text-gray-600">{article.description}</p>}

          <hr className="mb-6 border-gray-200" />

          {/* 正文：纯文本用 whitespace-pre-line；若将来是 HTML 字符串，换成 dangerouslySetInnerHTML */}
          <article className="prose max-w-none text-gray-800 prose-p:leading-7">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );

  // 只在客户端挂载之后才调用 portal
  return createPortal(overlay, document.body);
};

export default function HomePage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const [articles, setArticles] = useState<HomeArticle[]>([]);
  useEffect(() => {
  (async () => {
    try {
      const res = await fetch("/api/articles", { cache: "no-store" });
      const data = await res.json();
      setArticles(
        (data.items || []).map((it: any) => ({
          id: it.slug,
          title: it.title,
          description: it.description,
          publishDate: it.displayDate || (it.publishedAt ? String(it.publishedAt).slice(0,10) : ""),
          readTime: "",      // 暂无就留空；后续你也可在 frontmatter 增加 readTime
          category: it.category,
          content: it.content,  // 给弹窗展示全文
        }))
      );
    } catch (e) {
      console.error("Load articles failed", e);
    }
  })();
}, []);
  
    useEffect(() => {
  (async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      const map = new Map<string, string>();
      (data.items || []).forEach((c: any) => map.set(c.slug, c.name));
      setArticles(prev => prev.map(a => ({ ...a, category: map.get(a.category) || a.category })));
    } catch (e) {
      console.error("Load categories failed", e);
    }
  })();
}, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0,1,2,3,4,5,6,7]));
// 如果想默认全部收起：改成 new Set()

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      <div className="w-full bg-white overflow-hidden">
        {/* Navigation */}
        <nav className="px-8 py-6 sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GEO Pro</span>
            </div>

            <div className="hidden md:flex space-x-8">
              {["home", "services", "process", "faq", "articles-preview", "contact"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className="text-gray-900 hover:text-purple-600 transition-all duration-300 font-medium hover:scale-105 transform"
                >
                  {sec === "home"
                    ? "Home"
                    : sec === "services"
                    ? "Services"
                    : sec === "process"
                    ? "Process"
                    : sec === "faq"
                    ? "FAQ"
                    : sec === "articles-preview"
                    ? "Articles"
                    : "Contact"}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105 transform bg-transparent"
                onClick={() => scrollToSection("contact")}
              >
                Consult
              </Button>
              <Button
                onClick={() => scrollToSection("services")}
                className="text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 transform"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section id="home" className="px-8 py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-700 text-sm font-medium mb-8">
                <Star className="h-4 w-4 mr-2" />
                YOUR TRUSTED GEO CONSULTANT
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                优化您的内容在
                <br />
                <span className="relative">
                  AI搜索中的表现
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-purple-200 -z-10" />
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-gray-600 mb-8 font-light">
                Optimize your content performance in AI search
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                通过打造专为大模型设计的内容系统，让品牌在各大主流AI搜索平台中被主动引用、持续曝光。
              </p>
              <div className="h-0.5 w-32 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-400 rounded-full mb-8" />
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="w-80 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">AI搜索优化</h3>
                    <p className="text-sm text-gray-600">让您的内容在AI平台中脱颖而出</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="px-8 py-20 bg-gray-50">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4">— 我们的服务 Services</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">提供专业的GEO服务</h2>
            <h3 className="text-2xl text-gray-600">Comprehensive GEO Solutions</h3>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "提问意图图谱设计", desc: "分析用户问题，构建问题地图，引导内容创作。" },
              { icon: TrendingUp, title: "AI友好型内容撰写", desc: "为大模型优化的内容撰写，提高引用率和曝光度。" },
              { icon: Users, title: "多平台发布策略", desc: "确保内容在各大AI搜索平台均被采纳和展示。" },
            ].map((service) => (
              <Card key={service.title} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <service.icon className="h-8 w-8 text-purple-600 mb-4" />
                  <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4">— 工作流程 Process</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">简单四步，完成GEO优化</h2>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, step: "需求分析", desc: "了解客户需求和目标。" },
              { icon: Target, step: "策略设计", desc: "制定内容优化策略。" },
              { icon: CheckCircle, step: "内容执行", desc: "撰写并优化内容。" },
              { icon: TrendingUp, step: "效果监测", desc: "追踪效果并持续优化。" },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300">
                <item.icon className="h-10 w-10 text-purple-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{item.step}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
<section id="faq" className="px-8 py-24 relative overflow-hidden">
  {/* 背景点缀渐变 */}
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
  </div>

  <div className="text-center mb-16">
    <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold mb-3 tracking-wide">
      — 常见问题 FAQ
    </p>
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
      您可能关心的问题
    </h2>
    <p className="text-gray-600">还有疑问？在底部联系我们即可。</p>
  </div>

  {(() => {
    const faqs = [
      { q: "什么是 GEO 优化？", a: "GEO 是面向 AI 搜索/生成式问答的内容优化方法，帮助内容被正确理解、引用与推荐。" },
      { q: "GEO 与传统 SEO 有何不同？", a: "SEO 更关注关键词和链接；GEO 关注“问题意图—结构化知识—可引用性”，面向对话式检索与答案质量。" },
      { q: "内容如何更容易被 AI 引用？", a: "进行意图图谱设计、清晰结构与证据、权威来源标注，并进行多平台分发以提升可检索与可引用性。" },
      { q: "适用的业务/内容场景有哪些？", a: "SaaS、教育、医疗、金融、专业服务、产品文档/FAQ、案例研究等知识密集型场景效果最好。" },
      { q: "项目周期与典型流程？", a: "通常 4–8 周：审计与基线 → 意图图谱与策略 → 内容生产与结构化 → 分发 → 监测与迭代。" },
      { q: "如何衡量 GEO 的效果？", a: "AI 引用/提及、答案质量与覆盖度、目标问题命中率、品牌/产品召回、流量与转化等指标。" },
      { q: "是否需要大改现有网站？", a: "无需大改。增加结构化版块（FAQ/文档中心/参考页）、完善元数据与站内链接即可获得显著提升。" },
      { q: "交付物都包含什么？", a: "意图图谱、内容规划与模板、落地页/FAQ 文案、多平台分发清单、监测报表；费用按范围与内容量评估。" },
    ];

    const toggle = (idx: number) => {
      setOpenFaqs(prev => {
        const next = new Set(prev);
        next.has(idx) ? next.delete(idx) : next.add(idx);
        return next;
      });
    };

    return (
      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((item, i) => {
          const isOpen = openFaqs.has(i);
          return (
            <div
              key={i}
              className={[
                "group rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md",
                "shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)]",
                "transition-all duration-300"
              ].join(" ")}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 text-left flex items-center gap-3"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <span className="flex-1 text-lg md:text-xl font-semibold text-gray-900">
                  {item.q}
                </span>
                <ChevronDown
                  className={[
                    "h-5 w-5 text-gray-400 transition-transform duration-300",
                    isOpen ? "rotate-180" : ""
                  ].join(" ")}
                />
              </button>

              <div
                className={[
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 text-gray-600 leading-7">{item.a}</div>
                </div>
              </div>

              {!isOpen && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    );
  })()}
</section>

        {/* Articles Preview */}
<section id="articles-preview" className="px-8 py-20 bg-white">
  <div className="text-center mb-16">
    <p className="text-purple-600 font-semibold mb-4">— 专业文章 Articles</p>
    <h2 className="text-4xl font-bold text-gray-900 mb-4">精选文章</h2>
    <h3 className="text-2xl text-gray-600">Featured Articles</h3>
  </div>

  <div className="max-w-6xl mx-auto">
   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {(articles.length ? articles : []).map((art) => (
    <div key={art.id}>
      <div
        onClick={() => setSelectedArticle(art)}
        className="border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 transform bg-white rounded-xl"
      >
        <div className="p-6 pb-4 flex-1">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {art.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300 leading-tight">
            {art.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {art.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{art.publishDate}</span>
            <span>{art.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  ))}
  {!articles.length && (
    <div className="col-span-full text-center text-gray-500">
      暂无文章，去 /admin 新建一篇试试～
    </div>
  )}
</div>

    <div className="text-center mt-12">
      <Button
        asChild
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105 transform px-8 py-3 bg-transparent"
      >
        <Link href="/articles">查看更多文章 View More Articles</Link>
      </Button>
    </div>
  </div>
</section>

        {/* Contact */}
<section id="contact" className="px-8 py-24 bg-gray-50">
  <div className="text-center mb-16">
    <p className="text-purple-600 font-semibold mb-4">— 联系我们 Contact</p>
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">随时咨询</h2>
    <h3 className="text-2xl text-gray-600">Get in touch with us</h3>
  </div>

  {/* 关键点：max-w 调成 5xl，栅格改为 1/2 列；卡片加 w-full 让其撑满列 */}
  <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Email */}
    <div className="w-full h-full p-8 border border-gray-100 rounded-2xl
                    bg-white shadow-sm hover:shadow-md transition-shadow">
      <Mail className="h-6 w-6 text-purple-600 mb-3" />
      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
      <a
        href="mailto:632205280@qq.com"
        className="text-gray-700 hover:text-purple-600 underline-offset-4 hover:underline break-all"
      >
        632205280@qq.com
      </a>
    </div>

    {/* 小红书 */}
    <div className="w-full h-full p-8 border border-gray-100 rounded-2xl
                    bg-white shadow-sm hover:shadow-md transition-shadow">
      <MessageCircle className="h-6 w-6 text-purple-600 mb-3" />
      <h4 className="font-semibold text-gray-900 mb-1">小红书</h4>
      <p className="text-gray-700">账号：505776905</p>
    </div>
  </div>
</section>

        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </div>
    </div>
  );
}
