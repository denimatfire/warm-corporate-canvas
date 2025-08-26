// Article interface definition
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

// Import Google Sheets service functions
import { 
  getAllArticlesFromDrive, 
  addArticleToDrive, 
  updateArticleInDrive, 
  deleteArticleFromDrive,
  verifyGoogleSheetState,
  getAuthStatus 
} from './google-sheets-service';

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

// Article API functions
export const articlesApi = {
  // Get all articles
  async getAll(): Promise<Article[]> {
    try {
      console.log('📊 Fetching articles from Google Sheets...');
      const articles = await getAllArticlesFromDrive();
      console.log(`✅ Successfully fetched ${articles.length} articles from Google Sheets`);
      return articles;
    } catch (error) {
      console.error('❌ Failed to fetch articles from Google Sheets:', error);
      throw error;
    }
  },

  // Get published articles only
  async getPublished(): Promise<Article[]> {
    try {
      const allArticles = await this.getAll();
      return allArticles.filter(article => article.status === 'published');
    } catch (error) {
      console.error('❌ Failed to fetch published articles:', error);
      throw error;
    }
  },

  // Get article by ID
  async getById(id: string): Promise<Article> {
    try {
      const allArticles = await this.getAll();
      const article = allArticles.find(a => a.id === id);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    } catch (error) {
      console.error(`❌ Failed to fetch article ${id}:`, error);
      throw error;
    }
  },

  // Create new article
  async create(articleData: CreateArticleData): Promise<Article> {
    try {
      console.log('📝 Creating new article in Google Sheets...');
      const newArticle = await addArticleToDrive(articleData);
      console.log('✅ Article created successfully:', newArticle.title);
      return newArticle;
    } catch (error) {
      console.error('❌ Failed to create article:', error);
      throw error;
    }
  },

  // Update existing article
  async update(id: string, updates: UpdateArticleData): Promise<Article> {
    try {
      console.log(`📝 Updating article ${id} in Google Sheets...`);
      const updatedArticle = await updateArticleInDrive(id, updates);
      if (!updatedArticle) {
        throw new Error('Article not found');
      }
      console.log('✅ Article updated successfully:', updatedArticle.title);
      return updatedArticle;
    } catch (error) {
      console.error(`❌ Failed to update article ${id}:`, error);
      throw error;
    }
  },

  // Delete article
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting article ${id} from Google Sheets...`);
      const success = await deleteArticleFromDrive(id);
      if (success) {
        console.log('✅ Article deleted successfully');
      } else {
        console.log('⚠️ Article not found for deletion');
      }
      return success;
    } catch (error) {
      console.error(`❌ Failed to delete article ${id}:`, error);
      throw error;
    }
  },

  // Search articles
  async search(query: string): Promise<Article[]> {
    try {
      const allArticles = await this.getAll();
      const lowercaseQuery = query.toLowerCase();
      
      return allArticles.filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        article.author.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  },

  // Get articles by tag
  async getByTag(tag: string): Promise<Article[]> {
    try {
      const allArticles = await this.getAll();
      const lowercaseTag = tag.toLowerCase();
      
      return allArticles.filter(article => 
        article.tags.some(t => t.toLowerCase() === lowercaseTag)
      );
    } catch (error) {
      console.error(`❌ Failed to fetch articles by tag ${tag}:`, error);
      throw error;
    }
  },

  // Get article statistics
  async getStats(): Promise<{ total: number; published: number; drafts: number; totalTags: number }> {
    try {
      const allArticles = await this.getAll();
      const total = allArticles.length;
      const published = allArticles.filter(a => a.status === 'published').length;
      const drafts = allArticles.filter(a => a.status === 'draft').length;
      
      // Count unique tags
      const allTags = allArticles.flatMap(a => a.tags);
      const uniqueTags = new Set(allTags);
      const totalTags = uniqueTags.size;
      
      return { total, published, drafts, totalTags };
    } catch (error) {
      console.error('❌ Failed to fetch article statistics:', error);
      throw error;
    }
  },

  // Verify Google Sheet state
  async verifyState(): Promise<void> {
    try {
      await verifyGoogleSheetState();
    } catch (error) {
      console.error('❌ Failed to verify Google Sheet state:', error);
    }
  },

  // Get authentication status
  getAuthStatus() {
    return getAuthStatus();
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
