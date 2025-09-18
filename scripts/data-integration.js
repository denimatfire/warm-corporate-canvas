#!/usr/bin/env node

/**
 * Data Integration for Dynamic Meta Tags
 * 
 * This script fetches data from your existing APIs and data sources
 * to populate the meta tag generation system with real content.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetch articles from your existing articles.ts data
 * In production, this would also fetch from Supabase articles table
 */
const fetchArticles = async () => {
  try {
    // Read from your existing articles.ts file
    const articlesPath = path.join(__dirname, '../src/data/articles.ts');
    
    if (!fs.existsSync(articlesPath)) {
      console.log('⚠️  Articles.ts not found, using sample data');
      return getSampleArticles();
    }

    // For now, return sample data that matches your structure
    // In production, you'd integrate with your actual data loading
    return [
      {
        id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
        title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
        excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time. A bold strategy that actually worked.',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=entropy&auto=format',
        author: 'Dhrubajyoti Das',
        publishedAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        tags: ['GATE exam', 'engineering', 'study strategy', 'exam preparation', 'education'],
        readTime: 8,
        category: 'Education'
      },
      {
        id: 'mastering-react-hooks',
        title: 'Mastering React Hooks: A Complete Guide',
        excerpt: 'Learn how to use React Hooks effectively to build modern, efficient React applications with cleaner code.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
        author: 'Dhrubajyoti Das',
        publishedAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z',
        tags: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Hooks'],
        readTime: 12,
        category: 'Technology'
      },
      {
        id: 'building-scalable-apis',
        title: 'Building Scalable APIs with Node.js and TypeScript',
        excerpt: 'A comprehensive guide to building robust, scalable REST APIs using Node.js, TypeScript, and modern best practices.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop',
        author: 'Dhrubajyoti Das',
        publishedAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
        tags: ['Node.js', 'TypeScript', 'API', 'Backend', 'Scalability'],
        readTime: 15,
        category: 'Technology'
      }
    ];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return getSampleArticles();
  }
};

/**
 * Fetch photos from Supabase (simulated for now)
 * In production, this would use your photosApi
 */
const fetchPhotos = async () => {
  try {
    // This would use your actual photosApi.getPublished()
    // For now, returning sample data that matches your Photo interface
    return [
      {
        id: 'sunset-mountain-view',
        title: 'Golden Hour at Mountain Peak',
        caption: 'A breathtaking sunset captured from the mountain peak during my hiking adventure.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
        category: 'Nature',
        tags: ['sunset', 'mountain', 'hiking', 'nature', 'golden hour'],
        publishedAt: '2024-01-10T00:00:00Z',
        location: 'Himalayan Range'
      },
      {
        id: 'urban-architecture',
        title: 'Modern City Architecture',
        caption: 'Exploring the geometric patterns and clean lines of contemporary urban architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop',
        category: 'Architecture',
        tags: ['architecture', 'urban', 'modern', 'city', 'geometric'],
        publishedAt: '2024-01-12T00:00:00Z',
        location: 'Downtown District'
      },
      {
        id: 'street-photography',
        title: 'Life in Motion',
        caption: 'Candid moments of everyday life captured through the lens of street photography.',
        imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop',
        category: 'Street',
        tags: ['street photography', 'candid', 'urban life', 'documentary'],
        publishedAt: '2024-01-14T00:00:00Z',
        location: 'City Center'
      }
    ];
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

/**
 * Fetch projects from Supabase (simulated for now)
 * In production, this would use your projectsApi
 */
const fetchProjects = async () => {
  try {
    // This would use your actual projectsApi.getPublished()
    // For now, returning sample data that matches your Project interface
    return [
      {
        id: 'portfolio-website',
        slug: 'portfolio-website',
        title: 'Personal Portfolio Website',
        description: 'A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features dynamic content management, photo galleries, and project showcases.',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Web Development', 'Portfolio'],
        category: 'Web Development',
        publishedAt: '2024-01-05T00:00:00Z',
        presentationType: 'external_url'
      },
      {
        id: 'task-management-app',
        slug: 'task-management-app',
        title: 'Advanced Task Management Application',
        description: 'A full-stack task management application with real-time collaboration, file attachments, and advanced filtering capabilities.',
        coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop',
        tags: ['React', 'Node.js', 'MongoDB', 'Real-time', 'Collaboration'],
        category: 'Full Stack',
        publishedAt: '2024-01-08T00:00:00Z',
        presentationType: 'file'
      },
      {
        id: 'data-visualization-dashboard',
        slug: 'data-visualization-dashboard',
        title: 'Interactive Data Visualization Dashboard',
        description: 'A comprehensive dashboard for data visualization using D3.js and React, featuring interactive charts, real-time updates, and export capabilities.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
        tags: ['D3.js', 'React', 'Data Visualization', 'Dashboard', 'Analytics'],
        category: 'Data Science',
        publishedAt: '2024-01-12T00:00:00Z',
        presentationType: 'external_url'
      }
    ];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

/**
 * Sample articles fallback
 */
const getSampleArticles = () => [
  {
    id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
    title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
    excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=entropy&auto=format',
    author: 'Dhrubajyoti Das',
    publishedAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    tags: ['GATE exam', 'engineering', 'study strategy', 'exam preparation', 'education'],
    readTime: 8,
    category: 'Education'
  }
];

/**
 * Integrate with Supabase APIs (for production)
 * This function shows how you would integrate with your existing APIs
 */
const integrateWithSupabaseAPIs = async () => {
  try {
    console.log('🔗 Integrating with Supabase APIs...');
    
    // Example of how to integrate with your existing APIs
    // You would uncomment and modify these when ready for production
    
    /*
    // Import your APIs
    const { articlesApi } = await import('../src/lib/articles-api.js');
    const { photosApi } = await import('../src/lib/photos-api.js');
    const { projectsApi } = await import('../src/lib/projects-api.js');
    
    // Fetch real data from Supabase
    const [articles, photos, projects] = await Promise.all([
      articlesApi.getPublished(),
      photosApi.getPublished(),
      projectsApi.getPublished()
    ]);
    
    return { articles, photos, projects };
    */
    
    // For now, use simulated data
    const [articles, photos, projects] = await Promise.all([
      fetchArticles(),
      fetchPhotos(),
      fetchProjects()
    ]);
    
    return { articles, photos, projects };
    
  } catch (error) {
    console.error('Error integrating with APIs:', error);
    // Fallback to sample data
    return {
      articles: await fetchArticles(),
      photos: await fetchPhotos(),
      projects: await fetchProjects()
    };
  }
};

/**
 * Save integrated data to a file for use by the meta tag generator
 */
const saveIntegratedData = (data) => {
  const outputPath = path.join(__dirname, 'integrated-content-data.json');
  
  const formattedData = {
    lastUpdated: new Date().toISOString(),
    totalItems: data.articles.length + data.photos.length + data.projects.length,
    articles: data.articles,
    photos: data.photos,
    projects: data.projects
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
  console.log(`💾 Saved integrated data to: ${outputPath}`);
  
  return formattedData;
};

/**
 * Main integration function
 */
const runDataIntegration = async () => {
  try {
    console.log('🚀 Starting data integration...\n');
    
    const integratedData = await integrateWithSupabaseAPIs();
    
    console.log('📊 Data integration summary:');
    console.log(`   Articles: ${integratedData.articles.length}`);
    console.log(`   Photos: ${integratedData.photos.length}`);
    console.log(`   Projects: ${integratedData.projects.length}`);
    console.log(`   Total items: ${integratedData.articles.length + integratedData.photos.length + integratedData.projects.length}\n`);
    
    const savedData = saveIntegratedData(integratedData);
    
    console.log('✅ Data integration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the integrated data in integrated-content-data.json');
    console.log('2. Run the meta tag generation script');
    console.log('3. Test the generated HTML files');
    
    return savedData;
    
  } catch (error) {
    console.error('❌ Data integration failed:', error);
    throw error;
  }
};

// Export functions for use by other scripts
export {
  runDataIntegration,
  integrateWithSupabaseAPIs,
  fetchArticles,
  fetchPhotos,
  fetchProjects,
  saveIntegratedData
};

// Run integration if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDataIntegration().catch(console.error);
}
