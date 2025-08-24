import React, { useState, useRef, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Article, addArticle, updateArticle, calculateReadTime, generateExcerpt } from '../data/articles';
import { canPublishArticles, getCurrentUser } from '../data/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

interface ArticleEditorProps {
  article?: Article;
  onSave?: (article: Article) => void;
  onCancel?: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  article, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const canPublish = canPublishArticles();

  const isEditing = !!article;

  useEffect(() => {
    // Auto-save draft every 30 seconds
    const interval = setInterval(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [title, content]);

  const handleAutoSave = () => {
    if (title || content) {
      const draftArticle = {
        title: title || 'Untitled Draft',
        content: content || '',
        coverImage,
        tags,
        status: 'draft' as const,
        author: currentUser?.username || 'Unknown User',
        excerpt: content ? generateExcerpt(content) : '',
        readTime: content ? calculateReadTime(content) : 0,
      };

      if (isEditing) {
        updateArticle(article!.id, draftArticle);
      } else {
        addArticle(draftArticle);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
        coverImage,
        tags,
        status,
        author: currentUser?.username || 'Unknown User',
        excerpt: generateExcerpt(content),
        readTime: calculateReadTime(content),
        ...(status === 'published' && { publishedAt: new Date().toISOString() }),
      };

      let savedArticle: Article;

      if (isEditing) {
        const updated = updateArticle(article!.id, articleData);
        if (!updated) throw new Error('Failed to update article');
        savedArticle = updated;
      } else {
        savedArticle = addArticle(articleData);
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

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align',
    'link', 'image', 'blockquote', 'code-block'
  ];

  return (
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
            onClick={handlePublish}
            disabled={isSaving || status === 'published' || !canPublish}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
          >
            {canPublish ? (
              <>
                <Eye className="w-4 h-4" />
                Publish
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
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {coverImage && (
            <div className="relative">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCoverImage('')}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
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
        <div className="border rounded-lg overflow-hidden">
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Start writing your article..."
            className="min-h-[400px]"
            theme="snow"
          />
        </div>
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
          onClick={handlePublish}
          disabled={isSaving || status === 'published' || !canPublish}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
        >
          {canPublish ? (
            <>
              <Eye className="w-4 h-4" />
              Publish Article
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
  );
};

export default ArticleEditor;
