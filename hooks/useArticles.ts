// 文章数据获取Hook - 为Notion集成预留
import { useState, useEffect } from 'react';
import { Article } from '../types/article';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // 这里后续替换为实际的Notion API调用
      // const response = await fetch('/api/articles');
      // const data = await response.json();
      
      // 目前使用模拟数据
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'AI搜索引擎优化完全指南',
          description: '深入了解如何优化内容以在AI驱动的搜索引擎中获得更好的可见性。从基础概念到高级策略，全面掌握GEO优化技巧。',
          publishDate: '2024-01-15',
          readTime: '8分钟阅读',
          category: '基础指南'
        },
        // ... 其他文章数据
      ];
      
      setArticles(mockArticles);
    } catch (err) {
      setError('获取文章失败');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return { articles, loading, error, refetch: fetchArticles };
}
