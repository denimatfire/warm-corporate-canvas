export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  readTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  message?: string;
}

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwju3zcTwgu_OaT8MoLqlJWVkMrFisVdbH8YeHE3nj-DmDgcrpF0fOCvG3x_wG7YYQ/exec';

export class ArticlesApiService {
  static async getAllArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=getAll`);
      const result: ApiResponse<Article[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch articles:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  static async getPublishedArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=getPublished`);
      const result: ApiResponse<Article[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch published articles:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching published articles:', error);
      return [];
    }
  }

  static async getArticleById(id: string): Promise<Article | null> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=getById&id=${id}`);
      const result: ApiResponse<Article> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch article:', result.error || 'Unknown error', 'Response:', result);
        return null;
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      return null;
    }
  }

  static async searchArticles(query: string): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=search&query=${encodeURIComponent(query)}`);
      const result: ApiResponse<Article[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to search articles:', result.error || 'Unknown error', 'Response:', result);
        return [];
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }

  static async getArticlesByTag(tag: string): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=getByTag&tag=${encodeURIComponent(tag)}`);
      const result: ApiResponse<Article[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch articles by tag:', result.error || 'Unknown error', 'Response:', result);
        return [];
      }
    } catch (error) {
      console.error('Error fetching articles by tag:', error);
      return [];
    }
  }

  static async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article | null> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          data: articleData,
        }),
      });
      
      const result: ApiResponse<Article> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to create article:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating article:', error);
      return null;
    }
  }

  static async updateArticle(id: string, updateData: Partial<Article>): Promise<Article | null> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          id: id,
          data: updateData,
        }),
      });
      
      const result: ApiResponse<Article> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to update article:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  }

  static async deleteArticle(id: string): Promise<boolean> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: id,
        }),
      });
      
      const result: ApiResponse<boolean> = await response.json();
      
      if (result.success) {
        return true;
      } else {
        console.error('Failed to delete article:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  static async getArticleStats(): Promise<{ total: number; published: number; drafts: number; totalTags: number } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}?action=getStats`);
      const result: ApiResponse<{ total: number; published: number; drafts: number; totalTags: number }> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch article stats:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching article stats:', error);
      return null;
    }
  }
}







