// 文章数据类型定义 - 为Notion集成预留
export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string; // 完整内容，详情页使用
  publishDate: string;
  readTime: string;
  category: string;
  author?: string;
  tags?: string[];
  coverImage?: string;
  slug?: string; // URL友好的标识符
  status?: 'published' | 'draft' | 'archived';
  notionPageId?: string; // Notion页面ID
  lastModified?: string;
}

// Notion API响应类型
export interface NotionArticleResponse {
  results: NotionPage[];
  next_cursor?: string;
  has_more: boolean;
}

export interface NotionPage {
  id: string;
  properties: {
    Title: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Description: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Category: {
      select: {
        name: string;
      };
    };
    PublishDate: {
      date: {
        start: string;
      };
    };
    ReadTime: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Status: {
      select: {
        name: string;
      };
    };
  };
}
