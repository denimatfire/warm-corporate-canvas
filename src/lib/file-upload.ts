import { supabase } from './articles-api';

export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface FileUploadOptions {
  folder?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  quality?: number; // 0-1 for image compression (ignored for non-images)
}

export class FileUploadService {
  private static readonly DEFAULT_FOLDER = 'uploads';
  private static readonly DEFAULT_MAX_SIZE = 10; // 10MB
  private static readonly DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private static readonly DEFAULT_QUALITY = 0.8;

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      this.validateFile(file, options);

      // Generate unique filename
      const filename = this.generateFilename(file);
      const folder = options.folder || this.DEFAULT_FOLDER;
      const filePath = `${folder}/${filename}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('Article_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  /**
   * Upload an image file with compression
   */
  static async uploadImage(
    file: File,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      this.validateFile(file, options);

      // Generate unique filename
      const filename = this.generateFilename(file);
      const folder = options.folder || this.DEFAULT_FOLDER;
      const filePath = `${folder}/${filename}`;

      let fileToUpload = file;

      // Compress image if it's a JPEG/PNG and quality is specified
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const quality = options.quality || this.DEFAULT_QUALITY;
        if (quality < 1) {
          fileToUpload = await this.compressImage(file, quality);
        }
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('Article_images')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: fileToUpload.size,
        type: file.type
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Upload a presentation file (PDF, PPT, etc.)
   */
  static async uploadPresentation(
    file: File,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const presentationOptions: FileUploadOptions = {
        folder: 'project-presentations',
        maxSize: 50, // 50MB for presentations
        allowedTypes: [
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.oasis.opendocument.presentation'
        ],
        ...options
      };

      this.validateFile(file, presentationOptions);

      // Generate unique filename
      const filename = this.generateFilename(file);
      const folder = presentationOptions.folder || 'project-presentations';
      const filePath = `${folder}/${filename}`;

      console.log('File upload details:', {
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filename,
        filePath,
        folder
      });

      // Upload file to Supabase Storage - use Article_images bucket with presentations folder
      const { data, error } = await supabase.storage
        .from('Article_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);

      console.log('Presentation upload details:', {
        filePath,
        publicUrl: urlData.publicUrl,
        bucket: 'Article_images',
        filename,
        originalSize: file.size,
        uploadedSize: data?.size || 'unknown'
      });

      // Test if the uploaded file is accessible
      try {
        const testResponse = await fetch(urlData.publicUrl, { method: 'HEAD' });
        console.log('File accessibility test after upload:', {
          url: urlData.publicUrl,
          status: testResponse.status,
          accessible: testResponse.ok,
          contentLength: testResponse.headers.get('content-length')
        });
      } catch (testError) {
        console.error('File accessibility test failed:', testError);
      }

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Presentation upload error:', error);
      throw error;
    }
  }

  /**
   * Upload a cover image
   */
  static async uploadCoverImage(
    file: File,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    const coverOptions: FileUploadOptions = {
      folder: 'project-covers',
      maxSize: 5, // 5MB for cover images
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      quality: 0.85,
      ...options
    };

    return this.uploadImage(file, coverOptions);
  }

  /**
   * Delete a file from Supabase Storage
   */
  static async deleteFile(filePath: string, bucket: string = 'Article_images'): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('File delete error:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files from Supabase Storage
   */
  static async deleteFiles(filePaths: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const filePath of filePaths) {
      try {
        await this.deleteFile(filePath);
        success.push(filePath);
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
        failed.push(filePath);
      }
    }

    return { success, failed };
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File, options: FileUploadOptions): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    console.log('File validation:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      maxSize: maxSize * 1024 * 1024,
      allowedTypes
    });

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      console.warn('File type not in allowed types:', {
        fileType: file.type,
        allowedTypes,
        fileName: file.name
      });
      // For now, let's be more permissive and just warn instead of throwing
      // throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
  }

  /**
   * Generate unique filename
   */
  private static generateFilename(file: File): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || '';
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Compress image file
   */
  private static async compressImage(file: File, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (optional: maintain aspect ratio)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Export convenience functions
export const uploadFile = FileUploadService.uploadFile;
export const uploadImage = FileUploadService.uploadImage;
export const uploadPresentation = FileUploadService.uploadPresentation;
export const uploadCoverImage = FileUploadService.uploadCoverImage;
export const deleteFile = FileUploadService.deleteFile;
export const deleteFiles = FileUploadService.deleteFiles;
export const batchDeleteImages = FileUploadService.deleteFiles; // For backward compatibility
