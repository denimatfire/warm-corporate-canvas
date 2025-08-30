import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Copy, 
  Download, 
  Play, 
  Pause, 
  Volume2,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Send,
  Check,
  Heart,
  BookOpen,
  Trash2,
  AlertTriangle,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { articlesApi, Article as ArticleType } from "@/lib/articles-api";
import jsPDF from "jspdf";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatArticleContent } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ensureMetaTagsImmediate, debugMetaTags, resetMetaTags } from "@/lib/meta-tags";

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: Date;
  likes: number;
}

const Article_medium = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  const articleRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Find the current article based on ID
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      
      if (id) {
        try {
          const foundArticle = await articlesApi.getById(id);
          setArticle(foundArticle);
          
          // Update meta tags for social media sharing
          if (foundArticle) {
            // Use immediate meta tag update for better social media crawler compatibility
            ensureMetaTagsImmediate({
              title: foundArticle.title,
              description: foundArticle.excerpt || 'Read this article on Dhrubajyoti Das Portfolio',
              image: foundArticle.cover_image,
              url: window.location.href,
              type: 'article',
              author: foundArticle.author,
              publishedTime: foundArticle.published_at || foundArticle.created_at,
              modifiedTime: foundArticle.updated_at,
              tags: foundArticle.tags || [],
              readingTime: foundArticle.read_time
            });
            
            // Debug: Log current meta tags after update
            setTimeout(() => {
              console.log('Meta tags after update in Article_medium:');
              debugMetaTags();
            }, 100);
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          setArticle(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchArticle();
    
    // Cleanup: reset meta tags when component unmounts
    return () => {
      resetMetaTags();
    };
  }, [id]);

  // Redirect if article not found (only after loading is complete)
  useEffect(() => {
    if (!isLoading && article === null && id) {
      navigate('/writing');
    }
  }, [article, id, navigate, isLoading]);

  // Handle back navigation with fallback
  const handleBackNavigation = () => {
    // Try to go back, if no history, go to writing page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/writing');
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const element = articleRef.current;
        const totalHeight = element.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text-to-Speech functionality
  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = articleRef.current?.innerText || "";
      speechRef.current = new SpeechSynthesisUtterance(text);
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 1;
      
      speechRef.current.onend = () => setIsPlaying(false);
      speechRef.current.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
    }
  };

  // Share functionality
  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt;

    switch (platform) {
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " - " + text)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(title + " - " + url)}`);
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  // Download as PDF
  const downloadPDF = () => {
    if (!article) return;
    
    const doc = new jsPDF();
    const text = articleRef.current?.innerText || "";
    
    doc.setFontSize(16);
    doc.text(article.title, 20, 20);
    
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 40);
    
    doc.save(`${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  // Comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        name: newComment.name.trim(),
        comment: newComment.comment.trim(),
        timestamp: new Date(),
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment({ name: "", comment: "" });
      setIsSubmitting(false);
    }, 500);
  };

  // Handle article like
  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  // Handle comment like
  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  // Handle comment deletion
  const handleCommentDelete = (comment: Comment) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  // Confirm comment deletion
  const confirmCommentDelete = () => {
    if (commentToDelete) {
      setComments(prev => prev.filter(comment => comment.id !== commentToDelete.id));
      setCommentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Cancel comment deletion
  const cancelCommentDelete = () => {
    setCommentToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const totalComments = comments.length;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Meta tags are now handled by the centralized utility in src/lib/meta-tags.ts

  // Show loading state while checking for article
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Show error state if article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Article not found...</p>
          <Button 
            onClick={() => navigate('/writing')}
            className="mt-4"
          >
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Medium-style Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Medium-style Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/writing')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Writing
              </Button>
            </div>
            
                         {/* Share Section */}
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-500 mr-2">Share:</span>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => shareArticle("linkedin")}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label="Share on LinkedIn"
               >
                 <Linkedin className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => shareArticle("twitter")}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label="Share on Twitter"
               >
                 <Twitter className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => shareArticle("whatsapp")}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label="Share on WhatsApp"
               >
                 <MessageCircle className="w-4 h-4" />
               </Button>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => shareArticle("copy")}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label="Copy link"
               >
                 {isCopied ? (
                   <Check className="w-4 h-4 text-green-500" />
                 ) : (
                   <Copy className="w-4 h-4" />
                 )}
               </Button>
             </div>

             {/* Action Buttons */}
             <div className="flex items-center space-x-2">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={toggleSpeech}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label={isPlaying ? "Pause audio" : "Play audio"}
               >
                 {isPlaying ? (
                   <Pause className="w-4 h-4" />
                 ) : (
                   <Play className="w-4 h-4" />
                 )}
               </Button>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setBookmarked(!bookmarked)}
                 className={`p-2 ${bookmarked ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-100`}
                 aria-label="Bookmark article"
               >
                 <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
               </Button>
               
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={downloadPDF}
                 className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                 aria-label="Download article as PDF"
               >
                 <Download className="w-4 h-4" />
               </Button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Medium-style Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-12 text-center"
        >

          
          {/* Title - Medium's signature large, bold typography */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight max-w-4xl mx-auto font-serif">
            {article.title}
          </h1>
          
          {/* Excerpt - Medium's subtitle style */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
            {article.excerpt}
          </p>
          
          {/* Author and Meta Info */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{article.read_time} min read</span>
            </div>
          </div>
          

        </motion.div>

        

        {/* Medium-style Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          ref={articleRef}
          className="px-6 mb-16"
        >
          <div className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:font-serif
            prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-16 prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12 
            prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8 prose-p:font-light prose-ul:mb-8 prose-li:mb-3
            prose-strong:font-semibold prose-strong:text-gray-900 prose-em:text-gray-700 prose-blockquote:border-l-4 
            prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600"
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
        </motion.div>

        {/* Medium-style Article Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="px-6 mb-12"
        >
          <div className="flex items-center justify-center space-x-8 py-8 border-t border-gray-100">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLike}
              className={`text-lg ${liked ? "text-red-500" : "text-gray-600"} hover:bg-gray-100`}
            >
              <Heart className={`w-6 h-6 mr-3 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"} {likesCount > 0 && `(${likesCount})`}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => document.querySelector('[data-comment-section]')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg text-gray-600 hover:bg-gray-100"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              {totalComments} Comments
            </Button>
          </div>
        </motion.div>

        {/* Medium-style Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="px-6 mb-16"
          data-comment-section
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center font-serif">Join the Discussion</h3>
          
          {/* Comment Form */}
          <Card className="bg-gray-50 border-gray-200 mb-12">
            <CardContent className="p-8">
              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Your name"
                    value={newComment.name}
                    onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    required
                  />
                  <Input
                    placeholder="Your comment"
                    value={newComment.comment}
                    onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Post Comment</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-8">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <User className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          <h4 className="font-semibold text-gray-900 truncate">{comment.name}</h4>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentDelete(comment)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 break-words font-light leading-relaxed">{comment.comment}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {comments.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <p className="text-lg text-gray-500 font-light">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete Comment</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
              {commentToDelete && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Comment by {commentToDelete.name}:</p>
                  <p className="text-sm text-gray-500 mt-1">"{commentToDelete.comment}"</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCommentDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCommentDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Article_medium;
