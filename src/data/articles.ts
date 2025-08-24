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

// In-memory storage for articles
let articles: Article[] = [];

// Initialize with sample data if no articles exist
const initializeArticles = () => {
  const stored = localStorage.getItem('articles');
  if (stored) {
    articles = JSON.parse(stored);
  } else {
    // Initialize with empty array
    articles = [];
    localStorage.setItem('articles', JSON.stringify(articles));
  }
};

// Save articles to localStorage
const saveArticles = () => {
  localStorage.setItem('articles', JSON.stringify(articles));
};

// Initialize on module load
initializeArticles();

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate reading time in minutes
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Generate excerpt from content
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

// Get all articles
export const getArticles = (): Article[] => {
  return [...articles];
};

// Get published articles only
export const getPublishedArticles = (): Article[] => {
  return articles.filter(article => article.status === 'published');
};

// Get article by ID
export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

// Add new article
export const addArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article => {
  const newArticle: Article = {
    ...articleData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  articles.push(newArticle);
  saveArticles();
  
  if (localStorage.getItem('debug_articles') === 'true') {
    console.log('Article added:', newArticle);
  }
  
  return newArticle;
};

// Update existing article
export const updateArticle = (id: string, updates: Partial<Article>): Article | null => {
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveArticles();
  
  if (localStorage.getItem('debug_articles') === 'true') {
    console.log('Article updated:', articles[index]);
  }
  
  return articles[index];
};

// Delete article
export const deleteArticle = (id: string): boolean => {
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return false;
  
  articles.splice(index, 1);
  saveArticles();
  
  if (localStorage.getItem('debug_articles') === 'true') {
    console.log('Article deleted:', id);
  }
  
  return true;
};

// Search articles
export const searchArticles = (query: string): Article[] => {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Get articles by tag
export const getArticlesByTag = (tag: string): Article[] => {
  return articles.filter(article => 
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

// Get articles by author
export const getArticlesByAuthor = (author: string): Article[] => {
  return articles.filter(article => 
    article.author.toLowerCase() === author.toLowerCase()
  );
};

// Get articles by status
export const getArticlesByStatus = (status: 'draft' | 'published'): Article[] => {
  return articles.filter(article => article.status === status);
};

// Get article statistics
export const getArticleStats = () => {
  const total = articles.length;
  const published = articles.filter(a => a.status === 'published').length;
  const drafts = articles.filter(a => a.status === 'draft').length;
  const totalTags = new Set(articles.flatMap(a => a.tags)).size;
  
  return { total, published, drafts, totalTags };
};
