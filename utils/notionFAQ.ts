// Notion FAQ API集成工具函数 - 后续实现
import { NotionFAQResponse, NotionFAQPage, FAQ } from '../types/faq';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_FAQ_DATABASE_ID = process.env.NOTION_FAQ_DATABASE_ID;

export async function fetchNotionFAQs(): Promise<FAQ[]> {
  if (!NOTION_API_KEY || !NOTION_FAQ_DATABASE_ID) {
    throw new Error('Notion FAQ API配置缺失');
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_FAQ_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          select: {
            equals: 'published'
          }
        },
        sorts: [
          {
            property: 'Order',
            direction: 'ascending'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Notion FAQ API请求失败');
    }

    const data: NotionFAQResponse = await response.json();
    return data.results.map(transformNotionPageToFAQ);
  } catch (error) {
    console.error('获取Notion FAQ失败:', error);
    throw error;
  }
}

function transformNotionPageToFAQ(page: NotionFAQPage): FAQ {
  return {
    id: page.id,
    question: page.properties.Question.title[0]?.plain_text || '',
    answer: page.properties.Answer.rich_text[0]?.plain_text || '',
    category: page.properties.Category.select?.name || '',
    order: page.properties.Order.number || 0,
    notionPageId: page.id,
  };
}
