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
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Link,
  Undo,
  Redo,
  Palette,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Enhanced CSS for Quill editor with better styling and responsiveness
const quillStyles = `
  .quill-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-in-out;
  }

  .quill-wrapper:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .quill-wrapper .ql-toolbar {
    border: 1px solid #e2e8f0;
    border-bottom: none;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .quill-wrapper .ql-toolbar .ql-formats {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: 16px;
  }

  .quill-wrapper .ql-toolbar button {
    width: 32px;
    height: 32px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #475569;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .quill-wrapper .ql-toolbar button:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #1e293b;
    transform: translateY(-1px);
  }

  .quill-wrapper .ql-toolbar button.ql-active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .quill-wrapper .ql-toolbar .ql-picker {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #475569;
    padding: 4px 8px;
    font-size: 14px;
    min-width: 100px;
  }

  .quill-wrapper .ql-toolbar .ql-picker:hover {
    border-color: #cbd5e1;
    color: #1e293b;
  }

  .quill-wrapper .ql-container {
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: white;
  }

  .quill-wrapper .ql-editor {
    min-height: 500px;
    font-size: 16px;
    line-height: 1.7;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1e293b;
    padding: 24px;
    outline: none;
  }

  .quill-wrapper .ql-editor.ql-blank::before {
    color: #94a3b8;
    font-style: italic;
    font-size: 16px;
  }

  /* Enhanced heading styles */
  .quill-wrapper .ql-editor h1 {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 2rem 0 1rem 0;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  .quill-wrapper .ql-editor h2 {
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 1.75rem 0 0.75rem 0;
    color: #1e293b;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.25rem;
  }

  .quill-wrapper .ql-editor h3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 1.5rem 0 0.5rem 0;
    color: #334155;
  }

  /* Enhanced paragraph and text styling */
  .quill-wrapper .ql-editor p {
    margin: 1rem 0;
    line-height: 1.7;
    color: #334155;
  }

  .quill-wrapper .ql-editor strong {
    font-weight: 600;
    color: #1e293b;
  }

  .quill-wrapper .ql-editor em {
    font-style: italic;
    color: #475569;
  }

  /* Enhanced list styling */
  .quill-wrapper .ql-editor ul,
  .quill-wrapper .ql-editor ol {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }

  .quill-wrapper .ql-editor li {
    margin: 0.5rem 0;
    line-height: 1.6;
    color: #334155;
  }

  .quill-wrapper .ql-editor ul li {
    list-style-type: disc;
    color: #475569;
  }

  .quill-wrapper .ql-editor ol li {
    list-style-type: decimal;
    color: #475569;
  }

  /* Enhanced blockquote styling */
  .quill-wrapper .ql-editor blockquote {
    border-left: 4px solid #3b82f6;
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    font-style: italic;
    color: #475569;
    border-radius: 0 8px 8px 0;
    position: relative;
  }

  .quill-wrapper .ql-editor blockquote::before {
    content: '"';
    font-size: 3rem;
    color: #3b82f6;
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    font-family: Georgia, serif;
  }

  /* Enhanced code block styling */
  .quill-wrapper .ql-editor pre {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    color: #e2e8f0;
    position: relative;
  }

  .quill-wrapper .ql-editor pre::before {
    content: 'CODE';
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .quill-wrapper .ql-editor code {
    background: #f1f5f9;
    color: #dc2626;
    padding: 0.125rem 0.25rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.875em;
  }

  /* Enhanced link styling */
  .quill-wrapper .ql-editor a {
    color: #3b82f6;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .quill-wrapper .ql-editor a:hover {
    color: #2563eb;
    border-bottom-color: #2563eb;
  }

  /* Enhanced image styling */
  .quill-wrapper .ql-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
    transition: transform 0.2s ease;
  }

  .quill-wrapper .ql-editor img:hover {
    transform: scale(1.02);
  }

  /* Enhanced table styling */
  .quill-wrapper .ql-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .quill-wrapper .ql-editor th,
  .quill-wrapper .ql-editor td {
    border: 1px solid #e2e8f0;
    padding: 0.75rem;
    text-align: left;
  }

  .quill-wrapper .ql-editor th {
    background: #f8fafc;
    font-weight: 600;
    color: #1e293b;
  }

  .quill-wrapper .ql-editor td {
    background: white;
    color: #334155;
  }

  /* Enhanced toolbar separators */
  .quill-wrapper .ql-toolbar .ql-separator {
    width: 1px;
    height: 24px;
    background: #e2e8f0;
    margin: 0 8px;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .quill-wrapper .ql-toolbar {
      padding: 8px;
      gap: 4px;
    }

    .quill-wrapper .ql-toolbar .ql-formats {
      margin-right: 8px;
    }

    .quill-wrapper .ql-toolbar button {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    .quill-wrapper .ql-editor {
      padding: 16px;
      font-size: 16px;
      min-height: 400px;
    }

    .quill-wrapper .ql-editor h1 {
      font-size: 1.875rem;
    }

    .quill-wrapper .ql-editor h2 {
      font-size: 1.5rem;
    }

    .quill-wrapper .ql-editor h3 {
      font-size: 1.25rem;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .quill-wrapper .ql-toolbar {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-color: #475569;
    }

    .quill-wrapper .ql-toolbar button {
      background: #334155;
      border-color: #475569;
      color: #e2e8f0;
    }

    .quill-wrapper .ql-toolbar button:hover {
      background: #475569;
      border-color: #64748b;
      color: #f1f5f9;
    }

    .quill-wrapper .ql-toolbar button.ql-active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    .quill-wrapper .ql-container {
      border-color: #475569;
      background: #1e293b;
    }

    .quill-wrapper .ql-editor {
      color: #e2e8f0;
      background: #1e293b;
    }

    .quill-wrapper .ql-editor h1,
    .quill-wrapper .ql-editor h2,
    .quill-wrapper .ql-editor h3 {
      color: #f1f5f9;
      border-color: #475569;
    }

    .quill-wrapper .ql-editor p,
    .quill-wrapper .ql-editor li {
      color: #cbd5e1;
    }

    .quill-wrapper .ql-editor blockquote {
      background: linear-gradient(135deg, #334155 0%, #475569 100%);
      color: #cbd5e1;
    }

    .quill-wrapper .ql-editor code {
      background: #475569;
      color: #fca5a5;
    }
  }

  /* Focus states */
  .quill-wrapper .ql-editor:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #3b82f6;
  }

  /* Custom scrollbar */
  .quill-wrapper .ql-editor::-webkit-scrollbar {
    width: 8px;
  }

  .quill-wrapper .ql-editor::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  .quill-wrapper .ql-editor::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .quill-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Enhanced table styling */
  .quill-wrapper .ql-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .quill-wrapper .ql-editor th,
  .quill-wrapper .ql-editor td {
    border: 1px solid #e2e8f0;
    padding: 0.75rem;
    text-align: left;
  }

  .quill-wrapper .ql-editor th {
    background: #f8fafc;
    font-weight: 600;
    color: #1e293b;
  }

  .quill-wrapper .ql-editor td {
    background: white;
    color: #334155;
  }

  /* Video embedding */
  .quill-wrapper .ql-editor .ql-video {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
  }

  /* Syntax highlighting for code blocks */
  .quill-wrapper .ql-editor .keyword {
    color: #dc2626;
    font-weight: 600;
  }

  .quill-wrapper .ql-editor .literal {
    color: #7c3aed;
    font-weight: 600;
  }

  .quill-wrapper .ql-editor .number {
    color: #059669;
    font-weight: 600;
  }

  .quill-wrapper .ql-editor .string {
    color: #dc2626;
    font-style: italic;
  }

  /* Editor stats bar styling */
  .quill-wrapper .editor-stats {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #475569;
  }

  .quill-wrapper .editor-stats .stats-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .quill-wrapper .editor-stats .stats-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quill-wrapper .editor-stats .stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .quill-wrapper .editor-stats .auto-save-badge {
    background: #dbeafe;
    color: #1d4ed8;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* Editor footer styling */
  .quill-wrapper .editor-footer {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Enhanced focus states */
  .quill-wrapper .ql-editor:focus-within {
    outline: none;
    box-shadow: inset 0 0 0 2px #3b82f6;
  }

  /* Loading states */
  .quill-wrapper .ql-editor.ql-loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .quill-wrapper .ql-editor.ql-loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    margin: -16px 0 0 -16px;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Print styles */
  @media print {
    .quill-wrapper .ql-toolbar,
    .quill-wrapper .editor-stats,
    .quill-wrapper .editor-footer {
      display: none;
    }

    .quill-wrapper .ql-editor {
      border: none;
      padding: 0;
      min-height: auto;
    }
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

// Enhanced Quill editor wrapper with additional features
const QuillEditor = forwardRef<ReactQuill, any>((props, ref) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const handleTextChange = (content: string) => {
    // Calculate word count
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    setWordCount(wordCount);
    setCharCount(charCount);
    setReadingTime(readingTime);
    
    // Call the original onChange if provided
    if (props.onChange) {
      props.onChange(content);
    }
  };

  return (
    <div className="quill-wrapper relative">
      {/* Editor Stats Bar */}
      <div className="editor-stats">
        <div className="stats-left">
          <span className="stat-item">
            <Type className="w-4 h-4" />
            {wordCount} words
          </span>
          <span className="stat-item">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {charCount} characters
          </span>
          <span className="stat-item">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
        </div>
        <div className="stats-right">
          <span className="auto-save-badge">
            Auto-save enabled
          </span>
        </div>
      </div>
      
      <ReactQuill
        ref={ref}
        {...props}
        onChange={handleTextChange}
        preserveWhitespace={true}
        bounds=".quill-wrapper"
        theme="snow"
        placeholder="Start writing your article... Use the toolbar above to format your content."
        style={{ minHeight: '400px' }}
      />
      
      {/* Editor Footer */}
      <div className="editor-footer">
        <span>Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for links</span>
        <span>Supports tables, images, videos, and code blocks</span>
      </div>
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  article, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');

  // Enhanced content change handler with Word content processing
  const handleContentChange = (newContent: string) => {
    console.log('Content changed:', newContent);
    console.log('Content length:', newContent.length);
    console.log('Contains list elements:', newContent.includes('<ul>') || newContent.includes('<ol>'));
    
    // Process Word-specific content
    let processedContent = newContent;
    
    // Clean up Word-specific HTML
    processedContent = processedContent
      // Remove Word-specific classes and styles
      .replace(/class="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      // Clean up Word list formatting
      .replace(/<p[^>]*>\s*<span[^>]*>\s*•\s*<\/span>/g, '<li>')
      .replace(/<p[^>]*>\s*<span[^>]*>\s*\d+\.\s*<\/span>/g, '<li>')
      // Fix Word list structure
      .replace(/<p[^>]*>\s*<li>/g, '<li>')
      .replace(/<\/li>\s*<\/p>/g, '</li>')
      // Clean up empty paragraphs
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      // Fix Word heading styles
      .replace(/<p[^>]*>\s*<span[^>]*>\s*<strong[^>]*>/g, '<h2>')
      .replace(/<\/strong>\s*<\/span>\s*<\/p>/g, '</h2>');
    
    console.log('Processed content:', processedContent);
    setContent(processedContent);
  };

  // Handle paste events for Word content
  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const html = clipboardData.getData('text/html');
      const text = clipboardData.getData('text/plain');
      
      console.log('Pasted HTML:', html);
      console.log('Pasted text:', text);
      
      if (html && html.includes('mso-')) {
        // This is Word content, process it
        e.preventDefault();
        
        // Clean Word HTML
        let cleanHtml = html
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/<o:p[^>]*>.*?<\/o:p>/g, '') // Remove Office-specific tags
          .replace(/<mso-[^>]*>/g, '') // Remove MSO styles
          .replace(/<w:[^>]*>/g, '') // Remove Word-specific tags
          .replace(/class="[^"]*"/g, '') // Remove classes
          .replace(/style="[^"]*"/g, '') // Remove inline styles
          .replace(/<p[^>]*>\s*<span[^>]*>\s*•\s*<\/span>/g, '<li>') // Fix bullets
          .replace(/<p[^>]*>\s*<span[^>]*>\s*\d+\.\s*<\/span>/g, '<li>') // Fix numbers
          .replace(/<p[^>]*>\s*<li>/g, '<li>') // Fix list structure
          .replace(/<\/li>\s*<\/p>/g, '</li>')
          .replace(/<p[^>]*>\s*<\/p>/g, '') // Remove empty paragraphs
          .replace(/<p[^>]*>\s*<strong[^>]*>/g, '<h2>') // Fix headings
          .replace(/<\/strong>\s*<\/p>/g, '</h2>');
        
        console.log('Cleaned Word HTML:', cleanHtml);
        
        // Insert the cleaned content
        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          if (range) {
            quill.clipboard.dangerouslyPasteHTML(range.index, cleanHtml);
          }
        }
      }
    }
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

  const quillModules = {
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        
        // Text alignment and lists
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        
        // Colors and styling
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        
        // Media and formatting
        ['link', 'image', 'video', 'blockquote', 'code-block'],
        ['table'],
        
        // Utilities
        ['clean', 'undo', 'redo']
      ],
      handlers: {
        // Custom image handler
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const url = e.target?.result as string;
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  const range = quill.getSelection();
                  if (range) {
                    quill.insertEmbed(range.index, 'image', url);
                  }
                }
              };
              reader.readAsDataURL(file);
            }
          };
        },
        
        // Custom video handler
        video: function() {
          const url = prompt('Enter video URL:');
          if (url) {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, 'video', url);
              }
            }
          }
        },
        
        // Custom table handler
        table: function() {
          const rows = prompt('Enter number of rows:', '3');
          const cols = prompt('Enter number of columns:', '3');
          
          if (rows && cols) {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              if (range) {
                const table = quill.getModule('table');
                table.insertTable(parseInt(rows), parseInt(cols));
              }
            }
          }
        }
      }
    },
    
    // Enhanced clipboard handling
    clipboard: {
      matchVisual: false,
      matchers: [
        ['p', (node: any, delta: any) => {
          // Handle Word paragraph formatting
          if (node.style && node.style.textAlign) {
            delta.attributes = { ...delta.attributes, align: node.style.textAlign };
          }
          // Handle Word font sizes
          if (node.style && node.style.fontSize) {
            const size = node.style.fontSize;
            if (size.includes('pt')) {
              const ptSize = parseInt(size);
              if (ptSize <= 10) delta.attributes = { ...delta.attributes, size: 'small' };
              else if (ptSize >= 18) delta.attributes = { ...delta.attributes, size: 'large' };
            }
          }
          return delta;
        }],
        ['li', (node: any, delta: any) => {
          // Handle Word list items
          if (node.parentNode && node.parentNode.tagName === 'OL') {
            delta.attributes = { ...delta.attributes, list: 'ordered' };
          } else if (node.parentNode && node.parentNode.tagName === 'UL') {
            delta.attributes = { ...delta.attributes, list: 'bullet' };
          }
          return delta;
        }],
        ['table', (node: any, delta: any) => {
          // Handle Word table formatting
          if (node.tagName === 'TABLE') {
            delta.ops = [{ insert: { table: { rows: node.rows.length, cols: node.rows[0]?.cells.length || 0 } } }];
          }
          return delta;
        }]
      ]
    },
    
    // Enhanced list handling
    list: {
      keepWhitespace: true,
    },
    
    // Enhanced keyboard shortcuts
    keyboard: {
      bindings: {
        list: {
          key: 'enter',
          handler: function() {
            return true;
          }
        },
        'list autofill': {
          key: 'space',
          offset: 1,
          handler: function(range: any, context: any) {
            const quill = this.quill;
            const [line] = quill.getLine(range.index);
            if (line.formats.list) {
              quill.insertText(range.index, ' ', 'user');
              quill.formatLine(range.index, 1, 'list', line.formats.list);
            }
            return false;
          }
        }
      }
    },
    
    // Table module
    table: true,
    
    // History module for undo/redo
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    },
    
    // Syntax highlighting for code blocks
    syntax: {
      highlight: (text: string) => {
        // Basic syntax highlighting
        return text
          .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, '<span class="keyword">$1</span>')
          .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
          .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
          .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
          .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
      }
    }
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align',
    'link', 'image', 'video', 'blockquote', 'code-block',
    'indent', 'direction', 'size', 'script', 'font',
    'table', 'table-cell', 'table-row'
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
          <QuillEditor
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            onPaste={handlePaste}
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
