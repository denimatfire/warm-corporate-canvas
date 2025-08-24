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

// Import existing blog posts to convert them
import { blogPosts } from './blogs';

// Convert blog posts to articles format
const convertBlogPostsToArticles = (): Article[] => {
  console.log('=== CONVERTING BLOG POSTS ===');
  console.log('Blog posts to convert:', blogPosts.length);
  console.log('Blog post IDs:', blogPosts.map(b => b.id));
  
  const converted = blogPosts.map((blogPost, index) => {
    console.log(`Converting blog post ${index + 1}: ${blogPost.title} (ID: ${blogPost.id})`);
    
    try {
      // Convert markdown content to HTML
      const htmlContent = convertMarkdownToHtml(blogPost.content);
      
      // Extract read time from string (e.g., "8 min read" -> 8)
      const readTimeMatch = blogPost.readTime.match(/(\d+)/);
      const readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 5;
      
      // Convert date string to ISO format
      const date = new Date(blogPost.date).toISOString();
      
      const article: Article = {
        id: blogPost.id,
        title: blogPost.title,
        content: htmlContent,
        excerpt: blogPost.excerpt,
        coverImage: blogPost.mainPhoto,
        tags: blogPost.tags,
        status: 'published' as const,
        author: blogPost.author,
        readTime: readTime,
        publishedAt: date,
        createdAt: date,
        updatedAt: date,
      };
      
      console.log(`✅ Successfully converted: ${article.title} with ID: ${article.id}`);
      return article;
    } catch (error) {
      console.error(`❌ Error converting blog post ${blogPost.title}:`, error);
      // Return a fallback article to prevent crashes
      return {
        id: `fallback-${index}`,
        title: blogPost.title || 'Untitled Article',
        content: '<p>Content could not be loaded</p>',
        excerpt: blogPost.excerpt || 'No excerpt available',
        coverImage: blogPost.mainPhoto || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        tags: blogPost.tags || ['General'],
        status: 'published' as const,
        author: blogPost.author || 'Unknown Author',
        readTime: 5,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  });
  
  console.log('=== CONVERSION COMPLETE ===');
  console.log('Total converted articles:', converted.length);
  console.log('Converted article IDs:', converted.map(a => a.id));
  console.log('Converted article titles:', converted.map(a => a.title));
  
  return converted;
};

// Simple markdown to HTML converter
const convertMarkdownToHtml = (markdown: string): string => {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Convert photos
  html = html.replace(/\[PHOTO:(.*?)\]/g, '<img src="$1" alt="Article image" class="w-full h-auto rounded-lg my-4" />');
  
  // Convert paragraphs (text not in other tags)
  html = html.replace(/^(?!<[h|u|i|s])(.*$)/gim, '<p>$1</p>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
};

// Initialize with sample data if no articles exist
const initializeArticles = () => {
  console.log('=== INITIALIZING ARTICLES ===');
  const stored = localStorage.getItem('articles');
  
  if (stored) {
    console.log('Found stored articles in localStorage');
    try {
      articles = JSON.parse(stored);
      console.log('Loaded articles from localStorage:', articles.length);
      console.log('Article IDs from localStorage:', articles.map(a => a.id));
    } catch (error) {
      console.error('Error parsing stored articles:', error);
      console.log('Clearing corrupted localStorage and reinitializing...');
      localStorage.removeItem('articles');
      initializeArticles();
      return;
    }
  } else {
    console.log('No stored articles found, initializing with default data...');
    // Initialize with existing blog posts converted to articles
    const convertedArticles = convertBlogPostsToArticles();
    console.log('Converted articles:', convertedArticles.length);
    console.log('Converted article IDs:', convertedArticles.map(a => a.id));
    
    // Add the GATE exam article
    const gateArticle: Article = {
      id: 'gate-exam-45-days',
      title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy That Worked',
      excerpt: 'Discover my personal 45-day GATE preparation strategy that helped me succeed. Learn how focus, discipline, and smart study techniques can make all the difference.',
      content: `
<h2>Introduction: The Power of Taking Calculated Risks</h2>

<p>Hello, friends! 🎓 Passing the GATE exam in just 45 days might sound impossible, but with the right mindset and a well-structured plan, it can be done. Success often requires taking risks—but the key is to take calculated ones that maximize your strengths and minimize wasted effort.</p>

<p>In this post, I'll share my exact strategy for preparing in a short time frame, how I stayed motivated, and the lessons I learned along the way.</p>

<h2>Why I Chose a 45-Day Strategy</h2>

<p>During my 5th semester of engineering, I realized that guidance was essential to crack GATE. I enrolled in coaching, but at that time, resources like MADE EASY online classes, Facebook groups, and WhatsApp study circles were not as popular as they are today.</p>

<p>Even after coaching, I didn't begin preparation right away. Instead, I waited until my 7th semester exams ended on December 12th, 2014. After a short break, I started preparing seriously from December 15th—with just 45 days left until the exam.</p>

<h2>Step 1: Choosing Focus Over Coverage</h2>

<p>Instead of trying to cover the entire syllabus (a trap many fall into), I made a bold decision:</p>

<ul>
<li>Focus only on the subjects I felt confident in.</li>
<li>Skip topics that required excessive memorization.</li>
</ul>

<p>This helped me stay motivated and avoid unnecessary stress. My philosophy was simple: It's not about studying everything—it's about mastering what you know best.</p>

<h2>Step 2: Structuring the 45-Day Plan</h2>

<p>Here's how I divided my preparation:</p>

<h3>Phase 1: 25 Days of Deep Study</h3>
<ul>
<li>Spent 3 days per subject.</li>
<li>Made short, formula-based notes to revise quickly.</li>
<li>Solved previous year question papers after each subject.</li>
<li>Avoided distractions like Facebook and WhatsApp completely.</li>
</ul>

<h3>Phase 2: 20 Days of Revision & Practice</h3>
<ul>
<li>Spent 1–2 days per subject.</li>
<li>Revised everything at least 3 times.</li>
<li>Solved mock papers and revisited textbooks for difficult concepts.</li>
</ul>

<p>By the end of this cycle, I had covered the entire syllabus in just 25 days and spent the remaining 20 days strengthening speed and accuracy.</p>

<h2>Balancing Speed and Accuracy</h2>

<p>One thing I learned was that GATE is not about memorization—it's about understanding concepts.</p>

<ul>
<li>My speed was excellent, which helped me attempt many questions.</li>
<li>But my accuracy was weaker, costing me valuable marks.</li>
</ul>

<p>For example, in GATE 2015, I attempted 90 marks but ended up scoring 65.66 marks. This showed me that while speed matters, accuracy is the true game-changer.</p>

<h2>Sacrifices That Paid Off</h2>

<p>Preparing in such a short span wasn't easy. It meant:</p>

<ul>
<li>Skipping social events.</li>
<li>Cutting down time-wasting apps.</li>
<li>Staying focused and disciplined every single day.</li>
</ul>

<p>These sacrifices helped me stay laser-focused on my goals and avoid burnout.</p>

<h2>Key Lessons from My GATE Journey</h2>

<ul>
<li>Prioritize smart study over hard study.</li>
<li>Focus on your strengths rather than trying to cover everything.</li>
<li>Consistency beats intensity in the long run.</li>
<li>Take calculated risks based on your assessment.</li>
</ul>

<h2>Conclusion</h2>

<p>Passing GATE in 45 days is challenging but achievable with the right strategy. The key is to focus on what you know best, maintain consistency, and stay motivated throughout the process.</p>

<p>Remember, success in competitive exams is not about how much time you have—it's about how effectively you use that time.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
      tags: ['GATE Exam', 'Study Strategy', 'Engineering', 'Exam Preparation', 'Success Story', '45 Days'],
      status: 'published',
      author: 'Dhrubajyoti Das',
      readTime: 8,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Combine converted articles with the new GATE article
    articles = [...convertedArticles, gateArticle];
    console.log('Total articles after initialization:', articles.length);
    console.log('Final article IDs:', articles.map(a => a.id));
    console.log('Final article titles:', articles.map(a => a.title));
    
    localStorage.setItem('articles', JSON.stringify(articles));
    console.log('Articles saved to localStorage');
  }
  
  console.log('=== END INITIALIZATION ===');
  console.log('Current articles array:', articles);
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
  console.log(`Looking for article with ID: ${id}`);
  console.log('Available articles:', articles.map(a => ({ id: a.id, title: a.title })));
  
  const article = articles.find(article => article.id === id);
  
  if (article) {
    console.log(`Found article: ${article.title}`);
  } else {
    console.log(`Article with ID ${id} not found`);
  }
  
  return article;
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
  return articles.filter(article => article.status === 'published');
};

// Get article statistics
export const getArticleStats = () => {
  const total = articles.length;
  const published = articles.filter(a => a.status === 'published').length;
  const drafts = articles.filter(a => a.status === 'draft').length;
  const totalTags = new Set(articles.flatMap(a => a.tags)).size;
  
  return { total, published, drafts, totalTags };
};

// Migration function to sync existing blog posts
export const migrateBlogPosts = (): void => {
  const convertedArticles = convertBlogPostsToArticles();
  
  // Check if articles already exist to avoid duplicates
  const existingIds = articles.map(a => a.id);
  const newArticles = convertedArticles.filter(article => !existingIds.includes(article.id));
  
  if (newArticles.length > 0) {
    articles.push(...newArticles);
    saveArticles();
    console.log(`Migrated ${newArticles.length} blog posts to articles`);
  }
};

// Force re-initialization (useful for development)
export const reinitializeArticles = (): void => {
  console.log('Force re-initializing articles...');
  localStorage.removeItem('articles');
  console.log('localStorage cleared');
  initializeArticles();
  console.log('Articles re-initialized');
};

// Debug function to show current state
export const debugArticles = (): void => {
  console.log('=== Articles Debug Info ===');
  console.log('Total articles:', articles.length);
  console.log('Articles:', articles.map(a => ({ id: a.id, title: a.title, status: a.status })));
  console.log('localStorage has articles:', !!localStorage.getItem('articles'));
  console.log('=======================');
};

// Test function to verify article system is working
export const testArticleSystem = (): void => {
  console.log('=== TESTING ARTICLE SYSTEM ===');
  console.log('Total articles:', articles.length);
  console.log('Article IDs:', articles.map(a => a.id));
  console.log('Article titles:', articles.map(a => a.title));
  
  // Test finding articles by ID
  articles.forEach(article => {
    const found = getArticleById(article.id);
    if (found) {
      console.log(`✅ Found article: ${found.title} (ID: ${found.id})`);
    } else {
      console.log(`❌ Could not find article: ${article.title} (ID: ${article.id})`);
    }
  });
  
  console.log('=== END TEST ===');
};

// Make debug functions available globally for troubleshooting
if (typeof window !== 'undefined') {
  (window as any).reinitializeArticles = reinitializeArticles;
  (window as any).debugArticles = debugArticles;
  (window as any).getArticles = getArticles;
  (window as any).getArticleById = getArticleById;
  (window as any).testArticleSystem = testArticleSystem;
}
