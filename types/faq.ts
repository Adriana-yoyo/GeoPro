// FAQ数据类型定义 - 为Notion集成预留
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  status?: 'published' | 'draft' | 'archived';
  notionPageId?: string;
  lastModified?: string;
  tags?: string[];
}

// Notion FAQ API响应类型
export interface NotionFAQResponse {
  results: NotionFAQPage[];
  next_cursor?: string;
  has_more: boolean;
}

export interface NotionFAQPage {
  id: string;
  properties: {
    Question: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Answer: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Category: {
      select: {
        name: string;
      };
    };
    Order: {
      number: number;
    };
    Status: {
      select: {
        name: string;
      };
    };
  };
}
