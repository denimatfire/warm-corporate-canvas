import { supabase } from './articles-api';

export interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface ImageUploadOptions {
  folder?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  quality?: number; // 0-1 for JPEG compression
}

export class ImageUploadService {
  private static readonly DEFAULT_FOLDER = 'article-covers';
  private static readonly DEFAULT_MAX_SIZE = 5; // 5MB
  private static readonly DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private static readonly DEFAULT_QUALITY = 0.8;

  /**
   * Upload an image file to Supabase Storage
   */
  static async uploadImage(
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    try {
      // Debug: Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔐 Auth status:', { user: !!user, error: authError });
      
      // Additional auth debugging
      if (user) {
        console.log('✅ User details:', {
          id: user.id,
          email: user.email,
          role: user.role,
          aud: user.aud
        });
      } else {
        console.log('❌ No user found');
        if (authError) {
          console.error('🔴 Auth error details:', authError);
        }
      }
      
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔑 Session status:', { 
        hasSession: !!session, 
        error: sessionError,
        expiresAt: session?.expires_at 
      });
      
      if (!user) {
        throw new Error('User not authenticated. Please log in first.');
      }

      // Validate file
      this.validateFile(file, options);

      // Generate unique filename
      const filename = this.generateFilename(file);
      const folder = options.folder || this.DEFAULT_FOLDER;
      const filePath = `${folder}/${filename}`;

      console.log('📁 Uploading to path:', filePath);
      console.log('👤 User ID:', user.id);

      // Optimize image if needed
      const optimizedFile = await this.optimizeImage(file, options);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('Article_images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error details:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: optimizedFile.size,
        type: optimizedFile.type
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('Article_images')
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Image deletion error:', error);
      throw error;
    }
  }

  /**
   * Update an image (delete old, upload new)
   */
  static async updateImage(
    oldFilePath: string | null,
    newFile: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    try {
      // Delete old image if it exists
      if (oldFilePath) {
        await this.deleteImage(oldFilePath);
      }

      // Upload new image
      return await this.uploadImage(newFile, options);
    } catch (error) {
      console.error('Image update error:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File, options: ImageUploadOptions): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
  }

  /**
   * Generate unique filename
   */
  private static generateFilename(file: File): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Optimize image for web
   */
  private static async optimizeImage(
    file: File,
    options: ImageUploadOptions
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions (max 1200px width/height)
        const maxDimension = 1200;
        let { width, height } = img;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality setting
        const quality = options.quality || this.DEFAULT_QUALITY;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file); // Fallback to original file
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Check if image is landscape or portrait
   */
  static async getImageOrientation(file: File): Promise<'landscape' | 'portrait' | 'square'> {
    const { width, height } = await this.getImageDimensions(file);
    
    if (width > height) return 'landscape';
    if (height > width) return 'portrait';
    return 'square';
  }
}

// Convenience functions
export const uploadImage = ImageUploadService.uploadImage.bind(ImageUploadService);
export const deleteImage = ImageUploadService.deleteImage.bind(ImageUploadService);
export const updateImage = ImageUploadService.updateImage.bind(ImageUploadService);
export const getImageDimensions = ImageUploadService.getImageDimensions.bind(ImageUploadService);
export const getImageOrientation = ImageUploadService.getImageOrientation.bind(ImageUploadService);

// Utility functions for image cleanup
export const extractImagePathFromUrl = (url: string): string | null => {
  try {
    // Extract path from Supabase URL
    // Example: https://xxx.supabase.co/storage/v1/object/public/Article_images/content-images/123456-abc123.jpg
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const storageIndex = pathParts.findIndex(part => part === 'storage');
    if (storageIndex !== -1 && pathParts[storageIndex + 4] === 'Article_images') {
      // Return the path after 'Article_images'
      return pathParts.slice(storageIndex + 5).join('/');
    }
    return null;
  } catch (error) {
    console.error('Error extracting image path from URL:', error);
    return null;
  }
};

export const isSupabaseImageUrl = (url: string): boolean => {
  return url.includes('supabase.co') && url.includes('Article_images');
};

export const batchDeleteImages = async (filePaths: string[]): Promise<{ success: string[], failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];

  for (const filePath of filePaths) {
    try {
      await ImageUploadService.deleteImage(filePath);
      success.push(filePath);
    } catch (error) {
      console.error(`Failed to delete image: ${filePath}`, error);
      failed.push(filePath);
    }
  }

  return { success, failed };
};
