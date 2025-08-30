import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  MessageCircle, 
  Download, 
  Play, 
  Pause, 
  Volume2,
  Linkedin,
  Twitter,
  Copy,
  Check,
  Send,
  Calendar,
  User,
  Clock,
  Tag
} from 'lucide-react';
import { Article, Comment, addComment, getCommentsByArticleId } from '../data/articles';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import jsPDF from 'jspdf';
import { formatArticleContent } from '../lib/utils';

interface PublishedArticleProps {
  article: Article;
}

const PublishedArticle: React.FC<PublishedArticleProps> = ({ article }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    setupReadingProgress();
    
    // Update meta tags for social media sharing
    updateMetaTags();
    
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
      // Reset meta tags when component unmounts
      resetMetaTags();
    };
  }, [article.id]);

  // Update meta tags for social media sharing
  const updateMetaTags = () => {
    // Update page title
    document.title = `${article.title} - Dhrubajyoti Das Portfolio`;
    
    // Update Open Graph meta tags
    updateMetaTag('og:title', article.title);
    updateMetaTag('og:description', article.excerpt || 'Read this article on Dhrubajyoti Das Portfolio');
    updateMetaTag('og:type', 'article');
    
    // Update Twitter meta tags
    updateMetaTag('twitter:title', article.title);
    updateMetaTag('twitter:description', article.excerpt || 'Read this article on Dhrubajyoti Das Portfolio');
    
    // Update article-specific meta tags
    updateMetaTag('article:author', article.author);
    updateMetaTag('article:published_time', article.published_at || article.created_at);
    updateMetaTag('article:modified_time', article.updated_at);
    
    // If article has a cover image, use it
    if (article.cover_image) {
      updateMetaTag('og:image', article.cover_image);
      updateMetaTag('twitter:image', article.cover_image);
    }
    
    // If article has tags, add them
    if (article.tags && article.tags.length > 0) {
      updateMetaTag('article:tag', article.tags.join(', '));
    }
  };

  // Reset meta tags to default portfolio values
  const resetMetaTags = () => {
    document.title = 'Dhrubajyoti Das - Personal Portfolio';
    
    // Reset to default portfolio meta tags
    updateMetaTag('og:title', 'Dhrubajyoti Das - Personal Portfolio');
    updateMetaTag('og:description', 'Professional portfolio showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:image', 'https://warm-corporate-canvas.netlify.app/portfolio-preview.png');
    
    updateMetaTag('twitter:title', 'Dhrubajyoti Das - Personal Portfolio');
    updateMetaTag('twitter:description', 'Professional portfolio showcasing expertise in technology, leadership, and innovation.');
    updateMetaTag('twitter:image', 'https://warm-corporate-canvas.netlify.app/portfolio-preview.png');
    
    // Remove article-specific meta tags
    removeMetaTag('article:author');
    removeMetaTag('article:published_time');
    removeMetaTag('article:modified_time');
    removeMetaTag('article:tag');
  };

  // Helper function to update meta tags
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else if (property.startsWith('article:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Helper function to remove meta tags
  const removeMetaTag = (property: string) => {
    const meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
    if (meta) {
      meta.remove();
    }
  };

  const loadComments = () => {
    const articleComments = getCommentsByArticleId(article.id);
    setComments(articleComments);
  };

  const setupReadingProgress = () => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const currentProgress = (element.scrollTop / totalHeight) * 100;
        setReadingProgress(Math.min(currentProgress, 100));
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = addComment({
      articleId: article.id,
      author: 'Anonymous User', // You can implement user authentication later
      content: newComment.trim(),
    });

    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: 'Comment added',
      description: 'Your comment has been added successfully.',
    });
  };

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechRef.current) {
        window.speechSynthesis.resume();
      } else {
        const text = contentRef.current?.innerText || '';
        speechRef.current = new SpeechSynthesisUtterance(text);
        speechRef.current.rate = 0.9;
        speechRef.current.pitch = 1;
        
        speechRef.current.onend = () => {
          setIsPlaying(false);
          speechRef.current = null;
        };
        
        window.speechSynthesis.speak(speechRef.current);
      }
      setIsPlaying(true);
    }
  };

  const handleShare = (platform: 'linkedin' | 'twitter' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt || '';

    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast({
          title: 'Link copied',
          description: 'Article link has been copied to clipboard.',
        });
        break;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.text(article.title, 20, 30);
      
      // Add metadata
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
              doc.text(`By ${article.author} | ${new Date(article.published_at || article.updated_at).toLocaleDateString()}`, 20, 45);
      
      if (article.tags.length > 0) {
        doc.text(`Tags: ${article.tags.join(', ')}`, 20, 55);
      }
      
      // Add content (simplified HTML to text conversion)
      const content = contentRef.current?.innerText || '';
      const lines = doc.splitTextToSize(content, 170);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(lines, 20, 70);
      
      // Save the PDF
      doc.save(`${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      
      toast({
        title: 'PDF downloaded',
        description: 'Article has been downloaded as PDF successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'There was an error downloading the PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <Progress value={readingProgress} className="h-1" />
      </div>

      {/* Sticky Header with Share */}
      <div className="fixed top-1 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground font-medium">Article</span>
            </div>
            
            {/* Share Section */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('copy')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2"
                aria-label="Copy link"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 pb-8 space-y-6"
      >
        {article.cover_image && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
                              {formatDate(article.published_at || article.updated_at)}
            </div>
            
            {article.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.read_time} min read
              </div>
            )}
          </div>

          {article.excerpt && (
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 text-muted-foreground mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          )}
        </div>



        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={toggleAudio}
            className="flex items-center gap-2"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? 'Pause' : 'Listen'}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>

        {/* Share Options */}
        {isSharing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 pt-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
              className="flex items-center gap-2"
            >
              {copiedLink ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Article Content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none pb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      {/* Custom CSS for better image display in published articles */}
      <style>{`
        .prose img {
          display: block !important;
          margin: 1.5rem auto !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.2s ease-in-out !important;
          max-width: 100% !important;
          height: auto !important;
        }
        
        .prose img:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          transform: translateY(-2px) !important;
        }
        
        .prose .image-container {
          text-align: center !important;
          margin: 2rem 0 !important;
        }
        
        .prose .image-container img {
          margin: 0 auto !important;
        }
        
        /* Ensure all images are centered by default */
        .prose figure {
          text-align: center !important;
          margin: 2rem 0 !important;
        }
        
        .prose figure img {
          margin: 0 auto !important;
        }
        
        /* Override any left-aligned image styles */
        .prose img[style*="text-align: left"],
        .prose img[style*="float: left"] {
          text-align: center !important;
          float: none !important;
          margin: 1.5rem auto !important;
        }
      `}</style>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t pt-12 space-y-6"
      >
        <h3 className="text-2xl font-bold text-foreground">
          Comments ({comments.length})
        </h3>

        {/* Add Comment */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {comment.author}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-foreground">{comment.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PublishedArticle;
