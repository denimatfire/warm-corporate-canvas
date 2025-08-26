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

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  readTime: number;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  author?: string;
  readTime?: number;
}

// Import Google Sheets service functions
import { 
  getAllArticlesFromDrive, 
  addArticleToDrive, 
  updateArticleInDrive, 
  deleteArticleFromDrive,
  verifyGoogleSheetState,
  getAuthStatus 
} from './google-sheets-service';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }
  
  try {
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to parse API response');
  }
};

// Article API functions
export const articlesApi = {
  // Get all articles
  async getAll(): Promise<Article[]> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=getAll`);
      const result = await handleApiResponse<Article[]>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch articles');
      }
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  },

  // Get published articles only
  async getPublished(): Promise<Article[]> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=getPublished`);
      const result = await handleApiResponse<Article[]>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch published articles');
      }
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch published articles:', error);
      throw error;
    }
  },

  // Get article by ID
  async getById(id: string): Promise<Article> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=getById&id=${encodeURIComponent(id)}`);
      const result = await handleApiResponse<Article>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Article not found');
      }
      
      return result.data;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  },

  // Create new article
  async create(articleData: CreateArticleData): Promise<Article> {
    try {
      const response = await fetch(ARTICLES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          data: articleData,
        }),
      });
      
      const result = await handleApiResponse<Article>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create article');
      }
      
      return result.data;
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error;
    }
  },

  // Update existing article
  async update(id: string, updates: UpdateArticleData): Promise<Article> {
    try {
      const response = await fetch(ARTICLES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          id,
          data: updates,
        }),
      });
      
      const result = await handleApiResponse<Article>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update article');
      }
      
      return result.data;
    } catch (error) {
      console.error(`Failed to update article ${id}:`, error);
      throw error;
    }
  },

  // Delete article
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(ARTICLES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id,
        }),
      });
      
      const result = await handleApiResponse<{ success: boolean }>(response);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete article');
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to delete article ${id}:`, error);
      throw error;
    }
  },

  // Search articles
  async search(query: string): Promise<Article[]> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=search&query=${encodeURIComponent(query)}`);
      const result = await handleApiResponse<Article[]>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Search failed');
      }
      
      return result.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },

  // Get articles by tag
  async getByTag(tag: string): Promise<Article[]> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=getByTag&tag=${encodeURIComponent(tag)}`);
      const result = await handleApiResponse<Article[]>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch articles by tag');
      }
      
      return result.data;
    } catch (error) {
      console.error(`Failed to fetch articles by tag ${tag}:`, error);
      throw error;
    }
  },

  // Get article statistics
  async getStats(): Promise<{ total: number; published: number; drafts: number; totalTags: number }> {
    try {
      const response = await fetch(`${ARTICLES_API_URL}?action=getStats`);
      const result = await handleApiResponse<{ total: number; published: number; drafts: number; totalTags: number }>(response);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch article statistics');
      }
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch article statistics:', error);
      throw error;
    }
  },
};

// Fallback to localStorage if API is not configured
export const articlesApiWithFallback = {
  async getAll(): Promise<Article[]> {
    try {
      return await articlesApi.getAll();
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      return getArticlesFromLocalStorage();
    }
  },

  async getPublished(): Promise<Article[]> {
    try {
      return await articlesApi.getPublished();
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      return getPublishedArticlesFromLocalStorage();
    }
  },

  async getById(id: string): Promise<Article> {
    try {
      return await articlesApi.getById(id);
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      const article = getArticleFromLocalStorage(id);
      if (!article) throw new Error('Article not found');
      return article;
    }
  },

  async create(articleData: CreateArticleData): Promise<Article> {
    try {
      return await articlesApi.create(articleData);
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      return createArticleInLocalStorage(articleData);
    }
  },

  async update(id: string, updates: UpdateArticleData): Promise<Article> {
    try {
      return await articlesApi.update(id, updates);
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      const article = updateArticleInLocalStorage(id, updates);
      if (!article) throw new Error('Article not found');
      return article;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      return await articlesApi.delete(id);
    } catch (error) {
      console.warn('API failed, falling back to localStorage:', error);
      return deleteArticleFromLocalStorage(id);
    }
  },
};

// Local storage fallback functions
function getArticlesFromLocalStorage(): Article[] {
  try {
    const stored = localStorage.getItem('articles');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

function getPublishedArticlesFromLocalStorage(): Article[] {
  const articles = getArticlesFromLocalStorage();
  return articles.filter(article => article.status === 'published');
}

function getArticleFromLocalStorage(id: string): Article | undefined {
  const articles = getArticlesFromLocalStorage();
  return articles.find(article => article.id === id);
}

function createArticleInLocalStorage(articleData: CreateArticleData): Article {
  const articles = getArticlesFromLocalStorage();
  const newArticle: Article = {
    ...articleData,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  articles.push(newArticle);
  localStorage.setItem('articles', JSON.stringify(articles));
  return newArticle;
}

function updateArticleInLocalStorage(id: string, updates: UpdateArticleData): Article | null {
  const articles = getArticlesFromLocalStorage();
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('articles', JSON.stringify(articles));
  return articles[index];
}

function deleteArticleFromLocalStorage(id: string): boolean {
  const articles = getArticlesFromLocalStorage();
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return false;
  
  articles.splice(index, 1);
  localStorage.setItem('articles', JSON.stringify(articles));
  return true;
}
