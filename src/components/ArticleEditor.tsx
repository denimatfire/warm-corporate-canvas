import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Upload, 
  Tag, 
  X, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Image as ImageIcon,
  Search,
  Trash2,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import { Article as LocalArticle, calculateReadTime, generateExcerpt } from '../data/articles';
import { articlesApi, Article as ApiArticle } from '../lib/articles-api';
import { canPublishArticles, getCurrentUser } from '../data/auth';
import { uploadImage, updateImage, deleteImage, ImageUploadResult } from '../lib/image-upload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

interface ArticleEditorProps {
  article?: ApiArticle;
  onSave?: (article: ApiArticle) => void;
  onCancel?: () => void;
}

// Remove custom wrapper - use ReactQuill directly to avoid constructor errors

const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  article, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');

  // Simple content change handler
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Simple paste handling
  const handlePaste = (e: React.ClipboardEvent) => {
    // Let Quill handle paste naturally
  };
  const [coverImage, setCoverImage] = useState(article?.cover_image || '');
  const [coverImagePath, setCoverImagePath] = useState<string | null>(article?.cover_image_path || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastSavedContent, setLastSavedContent] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const canPublish = canPublishArticles();

  const isEditing = !!article;

  // Sync content when article prop changes (for editing existing articles)
  useEffect(() => {
    if (article) {
      console.log('Article prop changed, syncing content:', article);
      setTitle(article.title || '');
      setContent(article.content || '');
      // Only set cover image if we don't already have one or if the article has a different one
      if (!coverImage || article.cover_image !== coverImage) {
        setCoverImage(article.cover_image || '');
      }
      // Sync image path from article
      if (article.cover_image_path !== coverImagePath) {
        setCoverImagePath(article.cover_image_path || null);
      }
      setTags(article.tags || []);
      setStatus(article.status || 'draft');
    }
  }, [article, coverImage]);

  useEffect(() => {
    // Auto-save draft every 30 seconds, but only if there are actual changes
    const interval = setInterval(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []); // Remove dependencies to prevent auto-save on every content change



  // Debounced auto-save when content changes (only after user stops typing for 5 seconds)
  useEffect(() => {
    if (!content || content === lastSavedContent) return;

    const timeoutId = setTimeout(() => {
      if (content !== lastSavedContent) {
        console.log('⏰ Debounced auto-save triggered');
        handleAutoSave();
        setLastSavedContent(content);
      }
    }, 5000); // Wait 5 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [content, lastSavedContent]);

  const handleAutoSave = () => {
    if (!title && !content) return; // Don't auto-save empty articles
    
    // Only auto-save if content has actually changed
    if (content === lastSavedContent) return;

    // For editing existing articles, only auto-save if there are substantial changes
    if (isEditing && article) {
      const contentLengthDiff = Math.abs(content.length - (article.content?.length || 0));
      if (contentLengthDiff < 10) {
        console.log('🔄 Skipping auto-save - minimal changes detected');
        return;
      }
    }

    console.log('🔄 Auto-saving draft...', { isEditing, hasChanges: content !== lastSavedContent });

    const draftArticle = {
      title: title || 'Untitled Draft',
      content: content || '',
      cover_image: coverImage,
      cover_image_path: coverImagePath,
      tags,
      status: 'draft' as const,
      author: currentUser?.username || 'Unknown User',
      excerpt: content ? generateExcerpt(content) : '',
      read_time: content ? calculateReadTime(content) : 0,
    };

    try {
      if (isEditing && article?.id) {
        console.log('🔄 Updating existing article:', article.id);
        articlesApi.update(article.id, draftArticle);
      } else if (!isEditing) {
        console.log('🔄 Creating new draft article');
        articlesApi.create(draftArticle);
      }
      
      setLastSavedContent(content);
      console.log('✅ Auto-save completed');
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    
    try {
      let uploadResult: ImageUploadResult;

      if (isEditing && coverImagePath) {
        // Update existing image
        uploadResult = await updateImage(coverImagePath, file);
      } else {
        // Upload new image
        uploadResult = await uploadImage(file);
      }

      // Update state with new image URL and path
      console.log('🖼️ Image upload result:', uploadResult);
      console.log('🖼️ Setting coverImage to:', uploadResult.url);
      console.log('🖼️ Setting coverImagePath to:', uploadResult.path);
      
      // Force state update
      setCoverImage(uploadResult.url);
      setCoverImagePath(uploadResult.path);
      
      // Verify state was updated
      setTimeout(() => {
        console.log('🔄 State verification after 100ms:');
        console.log('🔄 coverImage state:', coverImage);
        console.log('🔄 coverImagePath state:', coverImagePath);
      }, 100);

      toast({
        title: 'Image uploaded successfully!',
        description: `Image uploaded: ${(uploadResult.size / 1024 / 1024).toFixed(2)}MB`,
      });

      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: 'Image upload failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveImage = async () => {
    try {
      if (coverImagePath) {
        console.log('🗑️ Attempting to delete image from path:', coverImagePath);
        
        // Delete from storage
        await deleteImage(coverImagePath);
        console.log('✅ Image deleted from storage successfully');
      }
      
      // Clear state regardless of storage deletion result
      setCoverImage('');
      setCoverImagePath(null);

      toast({
        title: 'Image removed',
        description: 'Cover image has been removed successfully.',
      });
    } catch (error) {
      console.error('❌ Image removal error:', error);
      
      // Even if storage deletion fails, clear the local state
      setCoverImage('');
      setCoverImagePath(null);
      
      toast({
        title: 'Image removed locally',
        description: 'Image was removed from the editor, but there was an issue with storage cleanup.',
        variant: 'destructive',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    
    if (!title.trim()) {
      newErrors.push('Title is required');
    }
    
    if (!content.trim()) {
      newErrors.push('Content is required');
    }
    
    if (status === 'published' && !coverImage) {
      newErrors.push('Cover image is required for published articles');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    
    try {
                   const articleData = {
        title: title.trim(),
        content: content.trim(),
        cover_image: coverImage,
        cover_image_path: coverImagePath,
        tags,
        status,
        author: currentUser?.username || 'Unknown User',
        excerpt: generateExcerpt(content),
        read_time: calculateReadTime(content),
        ...(status === 'published' && { published_at: new Date().toISOString() }),
      };

      console.log('💾 Saving article with data:', articleData);
      console.log('💾 cover_image:', articleData.cover_image);
      console.log('💾 cover_image_path:', articleData.cover_image_path);

      let savedArticle: ApiArticle;

      if (isEditing) {
        const updated = await articlesApi.update(article!.id, articleData);
        savedArticle = updated;
      } else {
        const created = await articlesApi.create(articleData);
        savedArticle = created;
      }

      toast({
        title: `Article ${isEditing ? 'updated' : 'created'} successfully!`,
        description: `Article "${savedArticle.title}" has been ${savedArticle.status === 'published' ? 'published' : 'saved as draft'}.`,
      });

      onSave?.(savedArticle);
    } catch (error) {
      toast({
        title: 'Error saving article',
        description: 'There was an error saving your article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    if (!canPublish) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can publish articles. Your article will be saved as a draft.',
        variant: 'destructive',
      });
      setStatus('draft');
      return;
    }
    
    setStatus('published');
    setTimeout(() => handleSave(), 100);
  };

  const handleDelete = async () => {
    if (!isEditing || !article) return;
    
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        // Delete cover image if it exists
        if (coverImagePath) {
          await deleteImage(coverImagePath);
        }
        
        // Delete article from database
        await articlesApi.delete(article.id);
        
        toast({
          title: 'Article deleted successfully',
          description: 'The article has been permanently removed.',
        });
        
        onCancel?.();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: 'Delete failed',
          description: 'There was an error deleting the article. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUnpublish = () => {
    if (!canPublish) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can unpublish articles.',
        variant: 'destructive',
      });
      return;
    }
    
    setStatus('draft');
    setTimeout(() => handleSave(), 100);
  };



  return (
    <>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6 space-y-6"
      >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'Make changes to your article' : 'Start writing your next great article'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Article
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            onClick={status === 'published' ? handleUnpublish : handlePublish}
            disabled={isSaving || !canPublish}
            className={`flex items-center gap-2 ${
              status === 'published' 
                ? 'bg-destructive hover:bg-destructive/90' 
                : 'bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary'
            }`}
          >
            {canPublish ? (
              <>
                {status === 'published' ? (
                  <>
                    <Shield className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publish
                  </>
                )}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Request Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          {status === 'draft' ? (
            <Clock className="w-4 h-4 text-muted-foreground" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-success" />
          )}
          <span className="text-sm font-medium">
            Status: {status === 'draft' ? 'Draft' : 'Published'}
          </span>
        </div>
        
        {content && (
          <div className="text-sm text-muted-foreground">
            Reading time: ~{calculateReadTime(content)} min
          </div>
        )}

        {!canPublish && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Publishing requires admin approval</span>
          </div>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </motion.div>
      )}

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Article Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your article title..."
          className="text-lg h-12"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Cover Image {status === 'published' && '*'}
        </Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="flex items-center gap-2"
          >
            {isUploadingImage ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Image
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {coverImage ? (
            <div className="relative">
              <div className="text-xs text-muted-foreground mb-1">
                Debug: coverImage = "{coverImage}"
                <br />
                coverImagePath = "{coverImagePath || 'null'}"
              </div>
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploadingImage}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mb-2">
              Debug: No cover image (coverImage = "{coverImage}")
              <br />
              coverImagePath = "{coverImagePath || 'null'}"
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            <p>• Supported formats: JPEG, PNG, WebP</p>
            <p>• Maximum size: 5MB</p>
            <p>• Images are automatically optimized for web</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Tags</Label>
        <div className="flex items-center gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="max-w-xs"
          />
          <Button
            variant="outline"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            size="sm"
          >
            <Tag className="w-4 h-4" />
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTag(tag)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Content *</Label>
        <TipTapEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your article..."
          className="min-h-[400px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        
        <Button
          onClick={status === 'published' ? handleUnpublish : handlePublish}
          disabled={isSaving || !canPublish}
          className={`flex items-center gap-2 ${
            status === 'published' 
              ? 'bg-destructive hover:bg-destructive/90' 
              : 'bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary'
          }`}
        >
          {canPublish ? (
            <>
              {status === 'published' ? (
                <>
                  <Shield className="w-4 h-4" />
                  Unpublish Article
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Publish Article
                </>
              )}
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Request Publish
            </>
          )}
        </Button>
      </div>
      </motion.div>
    </>
  );
};

export default ArticleEditor;
