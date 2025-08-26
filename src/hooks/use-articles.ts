import { useState, useEffect, useCallback } from 'react';
import { articlesApiWithFallback, type Article, type CreateArticleData, type UpdateArticleData } from '../lib/articles-api-new';

interface UseArticlesReturn {
  // Articles data
  articles: Article[];
  publishedArticles: Article[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  createArticle: (data: CreateArticleData) => Promise<Article>;
  updateArticle: (id: string, data: UpdateArticleData) => Promise<Article>;
  deleteArticle: (id: string) => Promise<boolean>;
  refreshArticles: () => Promise<void>;
  
  // Utility functions
  getArticleById: (id: string) => Article | undefined;
  searchArticles: (query: string) => Article[];
  getArticlesByTag: (tag: string) => Article[];
}

export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all articles
  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const allArticles = await articlesApiWithFallback.getAll();
      setArticles(allArticles);
      
      const published = allArticles.filter(article => article.status === 'published');
      setPublishedArticles(published);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load articles';
      setError(errorMessage);
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load published articles only
  const loadPublishedArticles = useCallback(async () => {
    try {
      setError(null);
      
      const published = await articlesApiWithFallback.getPublished();
      setPublishedArticles(published);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load published articles';
      setError(errorMessage);
      console.error('Error loading published articles:', err);
    }
  }, []);

  // Create new article
  const createArticle = useCallback(async (data: CreateArticleData): Promise<Article> => {
    try {
      setIsCreating(true);
      setError(null);
      
      const newArticle = await articlesApiWithFallback.create(data);
      
      // Update local state
      setArticles(prev => [...prev, newArticle]);
      
      if (newArticle.status === 'published') {
        setPublishedArticles(prev => [...prev, newArticle]);
      }
      
      return newArticle;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article';
      setError(errorMessage);
      console.error('Error creating article:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update existing article
  const updateArticle = useCallback(async (id: string, data: UpdateArticleData): Promise<Article> => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedArticle = await articlesApiWithFallback.update(id, data);
      
      // Update local state
      setArticles(prev => prev.map(article => 
        article.id === id ? updatedArticle : article
      ));
      
      // Update published articles if status changed
      if (data.status !== undefined) {
        if (data.status === 'published') {
          setPublishedArticles(prev => {
            const exists = prev.find(a => a.id === id);
            if (!exists) {
              return [...prev, updatedArticle];
            }
            return prev.map(article => 
              article.id === id ? updatedArticle : article
            );
          });
        } else {
          setPublishedArticles(prev => prev.filter(article => article.id !== id));
        }
      } else {
        setPublishedArticles(prev => prev.map(article => 
          article.id === id ? updatedArticle : article
        ));
      }
      
      return updatedArticle;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article';
      setError(errorMessage);
      console.error('Error updating article:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete article
  const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const success = await articlesApiWithFallback.delete(id);
      
      if (success) {
        // Update local state
        setArticles(prev => prev.filter(article => article.id !== id));
        setPublishedArticles(prev => prev.filter(article => article.id !== id));
      }
      
      return success;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article';
      setError(errorMessage);
      console.error('Error deleting article:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Refresh articles
  const refreshArticles = useCallback(async () => {
    await loadArticles();
  }, [loadArticles]);

  // Get article by ID from local state
  const getArticleById = useCallback((id: string): Article | undefined => {
    return articles.find(article => article.id === id);
  }, [articles]);

  // Search articles in local state
  const searchArticles = useCallback((query: string): Article[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      article.author.toLowerCase().includes(lowercaseQuery)
    );
  }, [articles]);

  // Get articles by tag from local state
  const getArticlesByTag = useCallback((tag: string): Article[] => {
    const lowercaseTag = tag.toLowerCase();
    return articles.filter(article => 
      article.tags.some(t => t.toLowerCase() === lowercaseTag)
    );
  }, [articles]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load articles on mount
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Auto-refresh published articles when articles change
  useEffect(() => {
    const published = articles.filter(article => article.status === 'published');
    setPublishedArticles(published);
  }, [articles]);

  return {
    // Data
    articles,
    publishedArticles,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    refreshArticles,
    
    // Utility functions
    getArticleById,
    searchArticles,
    getArticlesByTag,
  };
}

// Hook for managing a single article
export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const articleData = await articlesApiWithFallback.getById(id);
      setArticle(articleData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load article';
      setError(errorMessage);
      console.error('Error loading article:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  return {
    article,
    isLoading,
    error,
    refresh: loadArticle,
  };
}

// Hook for article search
export function useArticleSearch() {
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      
      const results = await articlesApiWithFallback.search(query);
      setSearchResults(results);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setSearchError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    search,
    clearSearch,
  };
}
