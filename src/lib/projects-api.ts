import { supabase } from './articles-api';
import { FileUploadService, FileUploadOptions } from './file-upload';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  cover_image_path?: string;
  
  // Presentation details
  presentation_type: 'file' | 'external_url';
  presentation_url?: string;
  presentation_file_path?: string;
  presentation_file_name?: string;
  presentation_file_size?: number;
  presentation_file_type?: string;
  
  // Metadata
  tags: string[];
  category?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  view_count: number;
  download_count: number;
  author_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  content?: string;
  presentation_type: 'file' | 'external_url';
  presentation_file?: File;
  presentation_url?: string;
  cover_image_file?: File;
  tags?: string[];
  category?: string;
  is_featured?: boolean;
  status?: 'draft' | 'published';
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  content?: string;
  presentation_type?: 'file' | 'external_url';
  presentation_file?: File;
  presentation_url?: string;
  cover_image_file?: File;
  tags?: string[];
  category?: string;
  is_featured?: boolean;
  status?: 'draft' | 'published';
}

export interface ProjectFilters {
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  presentation_type?: 'file' | 'external_url';
  is_featured?: boolean;
  author_id?: string;
}


export const projectsApi = {
  // Get all projects (with optional filters)
  getAll: async (filters: ProjectFilters = {}): Promise<Project[]> => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }
      if (filters.presentation_type) {
        query = query.eq('presentation_type', filters.presentation_type);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.author_id) {
        query = query.eq('author_id', filters.author_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },

  // Get published projects only (for public display)
  getPublished: async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch published projects:', error);
      throw error;
    }
  },

  // Get featured projects (for homepage)
  getFeatured: async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  },

  // Get project by slug
  getBySlug: async (slug: string): Promise<Project> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch project by slug:', error);
      throw error;
    }
  },

  // Create new project
  create: async (projectData: CreateProjectData): Promise<Project> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Generate slug
      const { generateSlug, generateUniqueSlug } = await import('./slug-utils');
      const baseSlug = generateSlug(projectData.title);
      
      // Get existing slugs to ensure uniqueness
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('slug');
      
      const existingSlugs = existingProjects?.map(project => project.slug) || [];
      const slug = generateUniqueSlug(baseSlug, existingSlugs);

      let coverImageUrl = '';
      let coverImagePath = '';

      // Handle cover image upload
      if (projectData.cover_image_file) {
        const uploadResult = await FileUploadService.uploadCoverImage(
          projectData.cover_image_file
        );

        coverImageUrl = uploadResult.url;
        coverImagePath = uploadResult.path;
      }

      let presentationUrl = '';
      let presentationFilePath = '';
      let presentationFileName = '';
      let presentationFileSize = 0;
      let presentationFileType = '';

      // Handle presentation file/URL
      if (projectData.presentation_type === 'file' && projectData.presentation_file) {
        const uploadResult = await FileUploadService.uploadPresentation(
          projectData.presentation_file
        );

        presentationFilePath = uploadResult.path;
        presentationFileName = projectData.presentation_file.name;
        presentationFileSize = projectData.presentation_file.size;
        presentationFileType = projectData.presentation_file.type;
      } else if (projectData.presentation_type === 'external_url' && projectData.presentation_url) {
        presentationUrl = projectData.presentation_url;
      }

      // Prepare project data for database
      const projectRecord = {
        title: projectData.title,
        slug,
        description: projectData.description,
        content: projectData.content || '',
        cover_image: coverImageUrl,
        cover_image_path: coverImagePath,
        presentation_type: projectData.presentation_type,
        presentation_url: presentationUrl,
        presentation_file_path: presentationFilePath,
        presentation_file_name: presentationFileName,
        presentation_file_size: presentationFileSize,
        presentation_file_type: presentationFileType,
        tags: projectData.tags || [],
        category: projectData.category || 'Uncategorized',
        is_featured: projectData.is_featured || false,
        status: projectData.status || 'draft',
        author_id: user.id,
        published_at: projectData.status === 'published' ? new Date().toISOString() : null
      };

      // Insert into database
      const { data, error } = await supabase
        .from('projects')
        .insert(projectRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  // Update project
  update: async (id: string, projectData: UpdateProjectData): Promise<Project> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get existing project to check ownership
      const existingProject = await projectsApi.getById(id);
      if (existingProject.author_id !== user.id) {
        throw new Error('Unauthorized: You can only update your own projects');
      }

      // Generate new slug if title is being updated
      let slug = existingProject.slug;
      if (projectData.title && projectData.title !== existingProject.title) {
        const { generateSlug, generateUniqueSlug } = await import('./slug-utils');
        const baseSlug = generateSlug(projectData.title);
        
        // Get existing slugs to ensure uniqueness (excluding current project)
        const { data: existingProjects } = await supabase
          .from('projects')
          .select('slug')
          .neq('id', id);
        
        const existingSlugs = existingProjects?.map(project => project.slug) || [];
        slug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      let coverImageUrl = existingProject.cover_image;
      let coverImagePath = existingProject.cover_image_path;

      // Handle cover image update
      if (projectData.cover_image_file) {
        const uploadResult = await FileUploadService.uploadCoverImage(
          projectData.cover_image_file
        );

        coverImageUrl = uploadResult.url;
        coverImagePath = uploadResult.path;

        // Delete old cover image
        if (existingProject.cover_image_path && existingProject.cover_image_path !== coverImagePath) {
          await FileUploadService.deleteFile(existingProject.cover_image_path);
        }
      }

      let presentationUrl = existingProject.presentation_url;
      let presentationFilePath = existingProject.presentation_file_path;
      let presentationFileName = existingProject.presentation_file_name;
      let presentationFileSize = existingProject.presentation_file_size;
      let presentationFileType = existingProject.presentation_file_type;

      // Handle presentation update
      if (projectData.presentation_file) {
        const uploadResult = await FileUploadService.uploadPresentation(
          projectData.presentation_file
        );

        presentationFilePath = uploadResult.path;
        presentationFileName = projectData.presentation_file.name;
        presentationFileSize = projectData.presentation_file.size;
        presentationFileType = projectData.presentation_file.type;

        // Delete old presentation file
        if (existingProject.presentation_file_path && existingProject.presentation_file_path !== presentationFilePath) {
          await FileUploadService.deleteFile(existingProject.presentation_file_path);
        }
      } else if (projectData.presentation_url !== undefined) {
        presentationUrl = projectData.presentation_url;
      }

      // Prepare update data
      const updateData: any = {
        title: projectData.title,
        slug,
        description: projectData.description,
        content: projectData.content,
        cover_image: coverImageUrl,
        cover_image_path: coverImagePath,
        presentation_type: projectData.presentation_type,
        presentation_url: presentationUrl,
        presentation_file_path: presentationFilePath,
        presentation_file_name: presentationFileName,
        presentation_file_size: presentationFileSize,
        presentation_file_type: presentationFileType,
        tags: projectData.tags,
        category: projectData.category,
        is_featured: projectData.is_featured,
        status: projectData.status
      };

      // Handle published_at timestamp
      if (projectData.status === 'published' && !existingProject.published_at) {
        updateData.published_at = new Date().toISOString();
      } else if (projectData.status === 'draft') {
        updateData.published_at = null;
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      // Update in database
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get existing project to check ownership and get file paths
      const existingProject = await projectsApi.getById(id);
      if (existingProject.author_id !== user.id) {
        throw new Error('Unauthorized: You can only delete your own projects');
      }

      // Delete files from storage
      const filesToDelete = [];
      if (existingProject.cover_image_path) {
        filesToDelete.push(existingProject.cover_image_path);
      }
      if (existingProject.presentation_file_path) {
        filesToDelete.push(existingProject.presentation_file_path);
      }

      if (filesToDelete.length > 0) {
        try {
          await FileUploadService.deleteFiles(filesToDelete);
        } catch (error) {
          console.warn('Failed to delete some files:', error);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },

  // Toggle publish status
  togglePublish: async (id: string): Promise<Project> => {
    try {
      const existingProject = await projectsApi.getById(id);
      const newPublishStatus = !(existingProject.status === 'published');
      
      return await projectsApi.update(id, {
        status: newPublishStatus ? 'published' : 'draft'
      });
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      throw error;
    }
  },

  // Increment view count
  incrementViewCount: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        project_id: id
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to increment view count:', error);
      throw error;
    }
  },

  // Increment download count
  incrementDownloadCount: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_download_count', {
        project_id: id
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to increment download count:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      const categories = [...new Set(data.map(item => item.category))];
      return categories.sort();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  // Get tags
  getTags: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('tags');

      if (error) throw error;
      
      const allTags = data.flatMap(item => item.tags || []);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.sort();
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      throw error;
    }
  },

  // Search projects
  search: async (query: string, filters: ProjectFilters = {}): Promise<Project[]> => {
    try {
      let searchQuery = supabase
        .from('projects')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (filters.category) {
        searchQuery = searchQuery.eq('category', filters.category);
      }
      if (filters.status !== undefined) {
        searchQuery = searchQuery.eq('status', filters.status);
      }
      if (filters.presentation_type) {
        searchQuery = searchQuery.eq('presentation_type', filters.presentation_type);
      }
      if (filters.author_id) {
        searchQuery = searchQuery.eq('author_id', filters.author_id);
      }

      const { data, error } = await searchQuery;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search projects:', error);
      throw error;
    }
  },

  // Get project statistics
  getStats: async (): Promise<{ total: number; published: number; drafts: number; totalTags: number; totalViews: number }> => {
    try {
      const [totalResult, publishedResult, draftsResult, viewsResult] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('projects').select('view_count').eq('status', 'published')
      ]);

      if (totalResult.error) throw totalResult.error;
      if (publishedResult.error) throw publishedResult.error;
      if (draftsResult.error) throw draftsResult.error;
      if (viewsResult.error) throw viewsResult.error;

      // Get unique tags count
      const { data: allProjects } = await supabase
        .from('projects')
        .select('tags');

      const allTags = allProjects?.flatMap(project => project.tags || []) || [];
      const uniqueTags = new Set(allTags);

      // Calculate total views
      const totalViews = viewsResult.data?.reduce((sum, project) => sum + (project.view_count || 0), 0) || 0;

      return {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        drafts: draftsResult.count || 0,
        totalTags: uniqueTags.size,
        totalViews
      };
    } catch (error) {
      console.error('Failed to fetch project statistics:', error);
      throw error;
    }
  },

  // Validate external URL
  validateExternalUrl: async (url: string): Promise<{ valid: boolean; preview?: any }> => {
    try {
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(url)) {
        return { valid: false };
      }

      // Check if it's a supported platform
      const supportedPlatforms = [
        'slideshare.net',
        'docs.google.com/presentation',
        'prezi.com',
        'youtube.com',
        'youtu.be'
      ];

      const isSupported = supportedPlatforms.some(platform => url.includes(platform));
      
      return { 
        valid: isSupported,
        preview: isSupported ? { url, platform: supportedPlatforms.find(p => url.includes(p)) } : undefined
      };
    } catch (error) {
      console.error('Failed to validate external URL:', error);
      return { valid: false };
    }
  }
};

// Export convenience functions
export const {
  getAll: getAllProjects,
  getPublished: getPublishedProjects,
  getFeatured: getFeaturedProjects,
  getById: getProjectById,
  getBySlug: getProjectBySlug,
  create: createProject,
  update: updateProject,
  delete: deleteProject,
  togglePublish: toggleProjectPublish,
  getCategories: getProjectCategories,
  getTags: getProjectTags,
  search: searchProjects
} = projectsApi;
