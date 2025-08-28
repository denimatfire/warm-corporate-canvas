import { createClient } from '@supabase/supabase-js';

// For parsing HTML content to extract image paths
declare global {
  interface Window {
    DOMParser: typeof DOMParser;
  }
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  cover_image_path?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  read_time: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  cover_image_path?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  read_time: number;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  cover_image_path?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  author?: string;
  read_time?: number;
  published_at?: string | null;
}

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Article API functions using Supabase
export const articlesApi = {
  // Get all articles
  async getAll(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  },

  // Get published articles only
  async getPublished(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch published articles:', error);
      throw error;
    }
  },

  // Get article by ID
  async getById(id: string): Promise<Article> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Article not found');
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error);
      throw error;
    }
  },

  // Create new article
  async create(articleData: CreateArticleData): Promise<Article> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create article');
      
      return data;
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error;
    }
  },

  // Update existing article
  async update(id: string, updates: UpdateArticleData): Promise<Article> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Handle published_at field properly
      if (updates.status === 'published' && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      } else if (updates.status === 'draft') {
        updateData.published_at = null;
      }

      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Article not found');
      
      return data;
    } catch (error) {
      console.error(`Failed to update article ${id}:`, error);
      throw error;
    }
  },

  // Delete article
  async delete(id: string): Promise<boolean> {
    try {
      // First, get the article to extract image paths before deletion
      const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!article) throw new Error('Article not found');

      // Extract all image paths from the article content and cover image
      const imagePathsToDelete: string[] = [];

      // Add cover image path if it exists
      if (article.cover_image_path) {
        imagePathsToDelete.push(article.cover_image_path);
      }

      // Extract content images from the article content
      const contentImages = this.extractImagePathsFromContent(article.content);
      imagePathsToDelete.push(...contentImages);

      // Remove duplicates
      const uniqueImagePaths = [...new Set(imagePathsToDelete)].filter(Boolean);

      // Delete all associated images from Supabase Storage
      if (uniqueImagePaths.length > 0) {
        try {
          await this.deleteImagesFromStorage(uniqueImagePaths);
          console.log(`🗑️ Deleted ${uniqueImagePaths.length} images for article ${id}`);
        } catch (imageError) {
          console.warn(`⚠️ Failed to delete some images for article ${id}:`, imageError);
          // Continue with article deletion even if image deletion fails
        }
      }

      // Now delete the article from the database
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Failed to delete article ${id}:`, error);
      throw error;
    }
  },

  // Helper function to extract image paths from article content
  private extractImagePathsFromContent(content: string): string[] {
    const imagePaths: string[] = [];
    
    try {
      // Parse HTML content to find image tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const imgElements = doc.querySelectorAll('img[src]');
      
      imgElements.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && this.isSupabaseImageUrl(src)) {
          const path = this.extractImagePathFromUrl(src);
          if (path) {
            imagePaths.push(path);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to parse article content for image extraction:', error);
    }
    
    return imagePaths;
  },

  // Helper function to check if URL is a Supabase image
  private isSupabaseImageUrl(url: string): boolean {
    return url.includes('supabase.co') && url.includes('Article_images');
  },

  // Helper function to extract image path from Supabase URL
  private extractImagePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const storageIndex = pathParts.findIndex(part => part === 'storage');
      if (storageIndex !== -1 && pathParts[storageIndex + 4] === 'Article_images') {
        return pathParts.slice(storageIndex + 5).join('/');
      }
      return null;
    } catch (error) {
      console.error('Error extracting image path from URL:', error);
      return null;
    }
  },

  // Helper function to delete images from Supabase Storage
  private async deleteImagesFromStorage(imagePaths: string[]): Promise<void> {
    try {
      // Use the batchDeleteImages function from image-upload.ts
      const { batchDeleteImages } = await import('./image-upload');
      const result = await batchDeleteImages(imagePaths);
      
      if (result.failed.length > 0) {
        console.warn(`⚠️ Failed to delete ${result.failed.length} images:`, result.failed);
      }
      
      if (result.success.length > 0) {
        console.log(`✅ Successfully deleted ${result.success.length} images`);
      }
    } catch (error) {
      console.error('Failed to delete images from storage:', error);
      throw error;
    }
  },

  // Search articles
  async search(query: string): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },

  // Get articles by tag
  async getByTag(tag: string): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', [tag])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch articles by tag ${tag}:`, error);
      throw error;
    }
  },

  // Get article statistics
  async getStats(): Promise<{ total: number; published: number; drafts: number; totalTags: number }> {
    try {
      const [totalResult, publishedResult, draftsResult] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft')
      ]);

      if (totalResult.error) throw totalResult.error;
      if (publishedResult.error) throw publishedResult.error;
      if (draftsResult.error) throw draftsResult.error;

      // Get unique tags count
      const { data: allArticles } = await supabase
        .from('articles')
        .select('tags');

      const allTags = allArticles?.flatMap(article => article.tags || []) || [];
      const uniqueTags = new Set(allTags);

      return {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        drafts: draftsResult.count || 0,
        totalTags: uniqueTags.size
      };
    } catch (error) {
      console.error('Failed to fetch article statistics:', error);
      throw error;
    }
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('articles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, callback)
      .subscribe();
  }
};

// Fallback to localStorage if Supabase is not configured
export const articlesApiWithFallback = {
  async getAll(): Promise<Article[]> {
    try {
      return await articlesApi.getAll();
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      return getArticlesFromLocalStorage();
    }
  },

  async getPublished(): Promise<Article[]> {
    try {
      return await articlesApi.getPublished();
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      return getPublishedArticlesFromLocalStorage();
    }
  },

  async getById(id: string): Promise<Article> {
    try {
      return await articlesApi.getById(id);
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      const article = getArticleFromLocalStorage(id);
      if (!article) throw new Error('Article not found');
      return article;
    }
  },

  async create(articleData: CreateArticleData): Promise<Article> {
    try {
      return await articlesApi.create(articleData);
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      return createArticleInLocalStorage(articleData);
    }
  },

  async update(id: string, updates: UpdateArticleData): Promise<Article> {
    try {
      return await articlesApi.update(id, updates);
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      const article = updateArticleInLocalStorage(id, updates);
      if (!article) throw new Error('Article not found');
      return article;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      return await articlesApi.delete(id);
    } catch (error) {
      console.warn('Supabase failed, falling back to localStorage:', error);
      return deleteArticleFromLocalStorage(id);
    }
  },
};

// Local storage fallback functions (keeping these for offline support)
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  articles.push(newArticle);
  localStorage.setItem('articles', JSON.stringify(articles));
  return newArticle;
}

function updateArticleInLocalStorage(id: string, updates: UpdateArticleData): Article | null {
  const articles = getArticlesFromLocalStorage();
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return null;
  
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Handle published_at field properly
  if (updates.status === 'published' && !updates.published_at) {
    updateData.published_at = new Date().toISOString();
  } else if (updates.status === 'draft') {
    updateData.published_at = null;
  }
  
  articles[index] = {
    ...articles[index],
    ...updateData,
  };
  
  localStorage.setItem('articles', JSON.stringify(articles));
  return articles[index];
}

function deleteArticleFromLocalStorage(id: string): boolean {
  const articles = getArticlesFromLocalStorage();
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return false;
  
  // Note: For localStorage fallback, we can't delete images from Supabase
  // as this is only used when Supabase is unavailable
  // Images will need to be cleaned up manually when Supabase is back online
  
  articles.splice(index, 1);
  localStorage.setItem('articles', JSON.stringify(articles));
  return true;
}
