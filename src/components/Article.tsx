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
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleById, Article as ArticleType } from "@/data/articles";
import jsPDF from "jspdf";
import { useIsMobile } from "@/hooks/use-mobile";
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

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: Date;
  likes: number;
}

const Article = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
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
    setIsLoading(true);
    
    if (id) {
      const foundArticle = getArticleById(id);
      setArticle(foundArticle || null);
      setIsLoading(false);
    }
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
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
        <div className={`${isMobile ? 'px-4' : 'max-w-4xl mx-auto px-6'} py-4`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
            {/* Navigation Buttons */}
            <div className={`flex ${isMobile ? 'justify-between' : 'items-center space-x-2'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <User className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex ${isMobile ? 'flex-wrap justify-center gap-2' : 'items-center space-x-3'}`}>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => navigate('/writing')}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {isMobile ? "Articles" : "All Articles"}
              </Button>
              
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => navigate(`/article-medium/${id}`)}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isMobile ? "Medium" : "Medium View"}
              </Button>
              
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={toggleSpeech}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isMobile ? "" : (isPlaying ? "Pause" : "Listen")}
              </Button>
              
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={downloadPDF}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                aria-label="Download article as PDF"
              >
                <Download className="w-4 h-4 mr-2" />
                {isMobile ? "" : "Download"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={`${isMobile ? 'px-4' : 'max-w-4xl mx-auto px-6'} py-8`}>
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${isMobile ? 'mb-8' : 'mb-12'} text-center`}
        >
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-center space-x-3'} mb-6`}>
            <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 border-blue-200">
              {article.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'} text-sm text-gray-500`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <h1 className={`${isMobile ? 'text-3xl lg:text-4xl' : 'text-5xl lg:text-6xl'} font-bold text-blue-900 mb-6 leading-tight max-w-4xl mx-auto`}>
            {article.title}
          </h1>
          
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto`}>
            {article.excerpt}
          </p>
          
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-blue-600">By {article.author}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm border-blue-300 text-blue-700 bg-blue-50">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${isMobile ? 'mb-8 p-4' : 'mb-12 p-6'} bg-blue-50 rounded-2xl border border-blue-200`}
        >
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Share this article:</span>
            </div>
            
            <div className={`flex ${isMobile ? 'flex-wrap justify-center gap-2' : 'items-center space-x-3'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("linkedin")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                {isMobile && <span className="ml-2">LinkedIn</span>}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("twitter")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
                {isMobile && <span className="ml-2">Twitter</span>}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("whatsapp")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                {isMobile && <span className="ml-2">WhatsApp</span>}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("copy")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Copy link"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                {isMobile && <span className="ml-2">{isCopied ? "Copied!" : "Copy"}</span>}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          ref={articleRef}
          className={`prose prose-lg max-w-none mb-16 text-gray-800 prose-headings:text-blue-900 
            ${isMobile ? 
              'prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2' : 
              'prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2'}`}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${isMobile ? 'mb-8 p-4' : 'mb-12 p-6'} bg-blue-50 rounded-2xl border border-blue-200`}
        >
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-center space-x-6'}`}>
            <Button
              variant="ghost"
              size={isMobile ? "default" : "lg"}
              onClick={handleLike}
              className={`${isMobile ? 'text-base' : 'text-lg'} ${liked ? "text-red-500" : "text-blue-600"} hover:bg-red-50`}
            >
              <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} mr-2 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"} {likesCount > 0 && `(${likesCount})`}
            </Button>
            
            <Button
              variant="ghost"
              size={isMobile ? "default" : "lg"}
              onClick={() => document.querySelector('[data-comment-section]')?.scrollIntoView({ behavior: 'smooth' })}
              className={`${isMobile ? 'text-base' : 'text-lg'} text-blue-600 hover:bg-blue-100`}
            >
              <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} mr-2`} />
              {totalComments} Comments
            </Button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-8"
          data-comment-section
        >
          <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-900 mb-8 text-center`}>Join the Discussion</h3>
          
          {/* Comment Form */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                  <Input
                    placeholder="Your name"
                    value={newComment.name}
                    onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border-blue-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <Input
                    placeholder="Your comment"
                    value={newComment.comment}
                    onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                    className="bg-white border-blue-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'px-6 py-2 text-base' : 'px-8 py-3 text-lg'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
                      <span>Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      <span>Post Comment</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-blue-200 shadow-sm">
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-start justify-between'} mb-3`}>
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <h4 className="font-semibold text-blue-900 truncate">{comment.name}</h4>
                        </div>
                        <div className={`flex ${isMobile ? 'justify-between' : 'items-center'} space-x-2`}>
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
                      <p className="text-gray-700 mb-4 break-words">{comment.comment}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className="text-blue-500 hover:text-red-500 hover:bg-red-50"
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
              <div className="text-center py-12">
                <MessageCircle className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-blue-300 mx-auto mb-4`} />
                <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500`}>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={`${isMobile ? 'w-[95vw] mx-4' : ''}`}>
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

export default Article;
