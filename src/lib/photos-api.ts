import { supabase } from './articles-api';
import { ImageUploadService, ImageUploadOptions } from './image-upload';

export interface Photo {
  id: string;
  title: string;
  caption?: string;
  category?: string;
  image_url: string;
  image_path: string;
  is_published: boolean;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id?: string;
}

export interface CreatePhotoData {
  title: string;
  caption?: string;
  category?: string;
  image_file: File;
  tags?: string[];
  metadata?: Record<string, any>;
  is_published?: boolean;
}

export interface UpdatePhotoData {
  title?: string;
  caption?: string;
  category?: string;
  image_file?: File;
  tags?: string[];
  metadata?: Record<string, any>;
  is_published?: boolean;
}

export interface PhotoFilters {
  category?: string;
  tags?: string[];
  is_published?: boolean;
  author_id?: string;
}

export const photosApi = {
  // Get all photos (with optional filters)
  getAll: async (filters: PhotoFilters = {}): Promise<Photo[]> => {
    try {
      let query = supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published);
      }
      if (filters.author_id) {
        query = query.eq('author_id', filters.author_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      throw error;
    }
  },

  // Get published photos only (for public display)
  getPublished: async (): Promise<Photo[]> => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch published photos:', error);
      throw error;
    }
  },

  // Get photo by ID
  getById: async (id: string): Promise<Photo> => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch photo:', error);
      throw error;
    }
  },

  // Create new photo
  create: async (photoData: CreatePhotoData): Promise<Photo> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Upload image to Supabase Storage
      const uploadOptions: ImageUploadOptions = {
        folder: 'portfolio-photos',
        maxSize: 10, // 10MB
        quality: 0.85
      };

      const uploadResult = await ImageUploadService.uploadImage(
        photoData.image_file,
        uploadOptions
      );

      // Prepare photo data for database
      const photoRecord = {
        title: photoData.title,
        caption: photoData.caption || '',
        category: photoData.category || 'Uncategorized',
        image_url: uploadResult.url,
        image_path: uploadResult.path,
        tags: photoData.tags || [],
        metadata: photoData.metadata || {},
        is_published: photoData.is_published || false,
        author_id: user.id,
        published_at: photoData.is_published ? new Date().toISOString() : null
      };

      // Insert into database
      const { data, error } = await supabase
        .from('photos')
        .insert(photoRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create photo:', error);
      throw error;
    }
  },

  // Update photo
  update: async (id: string, photoData: UpdatePhotoData): Promise<Photo> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('🔑 Current user:', { id: user.id, email: user.email });

      // Get existing photo to check ownership and get current image path
      const existingPhoto = await photosApi.getById(id);
      console.log('🔍 Photo ownership check:', {
        photoId: id,
        photoTitle: existingPhoto.title,
        photoAuthorId: existingPhoto.author_id,
        currentUserId: user.id,
        isOwner: existingPhoto.author_id === user.id,
        photoAuthorIdType: typeof existingPhoto.author_id,
        currentUserIdType: typeof user.id
      });
      
      if (existingPhoto.author_id !== user.id) {
        console.error('❌ Authorization failed:', {
          photoAuthorId: existingPhoto.author_id,
          currentUserId: user.id,
          comparison: existingPhoto.author_id === user.id
        });
        throw new Error('Unauthorized: You can only update your own photos');
      }

      let imageUrl = existingPhoto.image_url;
      let imagePath = existingPhoto.image_path;

      // Handle image update if new file is provided
      if (photoData.image_file) {
        const uploadOptions: ImageUploadOptions = {
          folder: 'portfolio-photos',
          maxSize: 10,
          quality: 0.85
        };

        const uploadResult = await ImageUploadService.uploadImage(
          photoData.image_file,
          uploadOptions
        );

        imageUrl = uploadResult.url;
        imagePath = uploadResult.path;

        // Delete old image
        if (existingPhoto.image_path !== imagePath) {
          await ImageUploadService.deleteImage(existingPhoto.image_path);
        }
      }

      // Prepare update data
      const updateData: any = {
        title: photoData.title,
        caption: photoData.caption,
        category: photoData.category,
        image_url: imageUrl,
        image_path: imagePath,
        tags: photoData.tags,
        metadata: photoData.metadata,
        is_published: photoData.is_published
      };

      // Handle published_at timestamp
      if (photoData.is_published !== undefined) {
        if (photoData.is_published && !existingPhoto.published_at) {
          updateData.published_at = new Date().toISOString();
        } else if (!photoData.is_published) {
          updateData.published_at = null;
        }
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      // Update in database
      const { data, error } = await supabase
        .from('photos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update photo:', error);
      throw error;
    }
  },

  // Delete photo
  delete: async (id: string): Promise<void> => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get existing photo to check ownership and get image path
      const existingPhoto = await photosApi.getById(id);
      if (existingPhoto.author_id !== user.id) {
        throw new Error('Unauthorized: You can only delete your own photos');
      }

      // Delete image from storage
      await ImageUploadService.deleteImage(existingPhoto.image_path);

      // Delete from database
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete photo:', error);
      throw error;
    }
  },

  // Toggle publish status
  togglePublish: async (id: string): Promise<Photo> => {
    try {
      const existingPhoto = await photosApi.getById(id);
      const newPublishStatus = !existingPhoto.is_published;
      
      return await photosApi.update(id, {
        is_published: newPublishStatus
      });
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('photos')
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
        .from('photos')
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

  // Search photos
  search: async (query: string, filters: PhotoFilters = {}): Promise<Photo[]> => {
    try {
      let searchQuery = supabase
        .from('photos')
        .select('*')
        .or(`title.ilike.%${query}%,caption.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (filters.category) {
        searchQuery = searchQuery.eq('category', filters.category);
      }
      if (filters.is_published !== undefined) {
        searchQuery = searchQuery.eq('is_published', filters.is_published);
      }
      if (filters.author_id) {
        searchQuery = searchQuery.eq('author_id', filters.author_id);
      }

      const { data, error } = await searchQuery;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search photos:', error);
      throw error;
    }
  },

  // Utility function to fix photos without author_id (run this once to fix existing photos)
  fixPhotosWithoutAuthorId: async (): Promise<{ fixed: number; errors: number }> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('🔧 Starting photo fix for user:', user.id);

      // First, let's see all photos and their current author_id status
      const { data: allPhotos, error: allPhotosError } = await supabase
        .from('photos')
        .select('id, title, author_id');

      if (allPhotosError) {
        console.error('❌ Failed to fetch all photos:', allPhotosError);
        throw allPhotosError;
      }

      console.log('📸 All photos in database:', allPhotos);

      // Get photos without author_id (UUID fields can't be empty strings)
      const { data: photosWithoutAuthor, error: fetchError } = await supabase
        .from('photos')
        .select('id, title, author_id')
        .is('author_id', null);

      if (fetchError) throw fetchError;

      if (!photosWithoutAuthor || photosWithoutAuthor.length === 0) {
        console.log('✅ All photos already have author_id set');
        return { fixed: 0, errors: 0 };
      }

      console.log(`🔧 Found ${photosWithoutAuthor.length} photos without author_id:`, photosWithoutAuthor);

      let fixed = 0;
      let errors = 0;

      for (const photo of photosWithoutAuthor) {
        try {
          console.log(`🔧 Fixing photo: ${photo.title} (ID: ${photo.id})`);
          
          const { error: updateError } = await supabase
            .from('photos')
            .update({ author_id: user.id })
            .eq('id', photo.id);

          if (updateError) {
            console.error(`❌ Failed to fix photo ${photo.id}:`, updateError);
            errors++;
          } else {
            console.log(`✅ Fixed photo: ${photo.title}`);
            fixed++;
          }
        } catch (error) {
          console.error(`❌ Error fixing photo ${photo.id}:`, error);
          errors++;
        }
      }

      console.log(`🎯 Photo fixing complete: ${fixed} fixed, ${errors} errors`);
      return { fixed, errors };
    } catch (error) {
      console.error('Failed to fix photos without author_id:', error);
      throw error;
    }
  }
};

// Export convenience functions
export const {
  getAll: getAllPhotos,
  getPublished: getPublishedPhotos,
  getById: getPhotoById,
  create: createPhoto,
  update: updatePhoto,
  delete: deletePhoto,
  togglePublish: togglePhotoPublish,
  getCategories: getPhotoCategories,
  getTags: getPhotoTags,
  search: searchPhotos
} = photosApi;
