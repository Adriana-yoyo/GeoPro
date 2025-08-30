// Notion API集成工具函数 - 后续实现
import { NotionArticleResponse, NotionPage, Article } from '../types/article';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function fetchNotionArticles(): Promise<Article[]> {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error('Notion API配置缺失');
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
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
            property: 'PublishDate',
            direction: 'descending'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Notion API请求失败');
    }

    const data: NotionArticleResponse = await response.json();
    return data.results.map(transformNotionPageToArticle);
  } catch (error) {
    console.error('获取Notion文章失败:', error);
    throw error;
  }
}

function transformNotionPageToArticle(page: NotionPage): Article {
  return {
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    description: page.properties.Description.rich_text[0]?.plain_text || '',
    category: page.properties.Category.select?.name || '',
    publishDate: page.properties.PublishDate.date?.start || '',
    readTime: page.properties.ReadTime.rich_text[0]?.plain_text || '',
    notionPageId: page.id,
  };
}
