// FAQ数据获取Hook - 为Notion集成预留
import { useState, useEffect } from 'react';
import { FAQ } from '../types/faq';

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      // 这里后续替换为实际的Notion API调用
      // const response = await fetch('/api/faqs');
      // const data = await response.json();
      
      // 目前使用模拟数据
      const mockFAQs: FAQ[] = [
        {
          id: '1',
          question: '什么是GEO（生成式引擎优化）？',
          answer: 'GEO是Generative Engine Optimization的缩写，是一种专门针对AI搜索引擎和大语言模型的内容优化策略。',
          category: '基础概念'
        },
        // ... 其他FAQ数据
      ];
      
      setFaqs(mockFAQs);
    } catch (err) {
      setError('获取FAQ失败');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  return { faqs, loading, error, refetch: fetchFAQs };
}
