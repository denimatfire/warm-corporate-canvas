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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Enhanced CSS for Word content display
const quillStyles = `
  .quill-wrapper .ql-editor {
    min-height: 400px;
    font-size: 16px;
    line-height: 1.6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* List styling */
  .quill-wrapper .ql-editor ul,
  .quill-wrapper .ql-editor ol {
    padding-left: 20px;
    margin: 10px 0;
  }
  
  .quill-wrapper .ql-editor li {
    margin: 5px 0;
    line-height: 1.6;
  }
  
  .quill-wrapper .ql-editor ul li {
    list-style-type: disc;
  }
  
  .quill-wrapper .ql-editor ol li {
    list-style-type: decimal;
  }
  
  /* Heading styles */
  .quill-wrapper .ql-editor h1,
  .quill-wrapper .ql-editor h2,
  .quill-wrapper .ql-editor h3 {
    margin: 20px 0 10px 0;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .quill-wrapper .ql-editor h1 {
    font-size: 24px;
  }
  
  .quill-wrapper .ql-editor h2 {
    font-size: 20px;
  }
  
  .quill-wrapper .ql-editor h3 {
    font-size: 18px;
  }
  
  /* Paragraph spacing */
  .quill-wrapper .ql-editor p {
    margin: 10px 0;
    line-height: 1.6;
  }
  
  /* Blockquote styling */
  .quill-wrapper .ql-editor blockquote {
    border-left: 4px solid #ddd;
    margin: 20px 0;
    padding: 10px 20px;
    background-color: #f9f9f9;
    font-style: italic;
  }
  
  /* Code block styling */
  .quill-wrapper .ql-editor pre {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
  }
  
  /* Toolbar styling */
  .quill-wrapper .ql-toolbar {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    background-color: #f8f9fa;
  }
  
  .quill-wrapper .ql-container {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  
  /* Word content cleanup */
  .quill-wrapper .ql-editor .word-content {
    font-family: inherit;
  }
`;
import { Article, calculateReadTime, generateExcerpt } from '../data/articles';
import { articlesApi } from '../lib/articles-api';
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

  // Sync content when article prop changes (for editing existing articles)
  useEffect(() => {
    if (article) {
      console.log('Article prop changed, syncing content:', article);
      setTitle(article.title || '');
      setContent(article.content || '');
      setCoverImage(article.cover_image || '');
      setTags(article.tags || []);
      setStatus(article.status || 'draft');
    }
  }, [article]);

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
         cover_image: coverImage,
         tags,
         status: 'draft' as const,
         author: currentUser?.username || 'Unknown User',
         excerpt: content ? generateExcerpt(content) : '',
         read_time: content ? calculateReadTime(content) : 0,
       };

      if (isEditing) {
        articlesApi.update(article!.id, draftArticle);
      } else {
        articlesApi.create(draftArticle);
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
         cover_image: coverImage,
         tags,
         status,
         author: currentUser?.username || 'Unknown User',
         excerpt: generateExcerpt(content),
         read_time: calculateReadTime(content),
         ...(status === 'published' && { published_at: new Date().toISOString() }),
       };

      let savedArticle: Article;

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

  // Simple Quill configuration to fix constructor error
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image'
  ];

  return (
    <>
      <style>{quillStyles}</style>
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
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
            placeholder="Start writing your article..."
            style={{ minHeight: '400px' }}
          />
          {/* Enhanced debug info for Word content */}
          <div className="p-2 bg-gray-100 text-xs text-gray-600 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Content Analysis:</strong><br/>
                Length: {content.length} | 
                Lists: {(content.includes('<ul>') || content.includes('<ol>')).toString()}<br/>
                Headings: {(content.includes('<h1>') || content.includes('<h2>') || content.includes('<h3>')).toString()}<br/>
                Word Content: {content.includes('mso-') || content.includes('o:p') ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Test Tools:</strong><br/>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const testContent = content + '<ul><li>Test bullet point</li></ul>';
                    handleContentChange(testContent);
                  }}
                  className="mr-2"
                >
                  Test List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const testContent = content + '<h2>Test Heading</h2><p>Test paragraph</p>';
                    handleContentChange(testContent);
                  }}
                >
                  Test Heading
                </Button>
              </div>
            </div>
          </div>
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
