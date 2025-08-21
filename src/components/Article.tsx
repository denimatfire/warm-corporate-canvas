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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { blogPosts, BlogPost } from "@/data/blogs";
import jsPDF from "jspdf";

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
  
  const articleRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Find the current article based on ID
  const article = blogPosts.find(a => a.id === id);

  // Redirect if article not found
  useEffect(() => {
    if (!article) {
      navigate('/writing');
    }
  }, [article, navigate]);

  if (!article) return null;

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

    window.addEventListener("scroll", handleScroll);
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
        name: newComment.name,
        comment: newComment.comment,
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

  const totalComments = comments.length + article.comments;

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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Writing
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeech}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Listen"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                aria-label="Download article as PDF"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 border-blue-200">
              {article.category}
            </Badge>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight max-w-4xl mx-auto">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
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
          className="mb-12 p-6 bg-blue-50 rounded-2xl border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Share this article:</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("linkedin")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("twitter")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareArticle("whatsapp")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
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
          className="prose prose-lg max-w-none mb-16 text-gray-800 prose-headings:text-blue-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 p-6 bg-blue-50 rounded-2xl border border-blue-200"
        >
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLike}
              className={`text-lg ${liked ? "text-red-500" : "text-blue-600"} hover:bg-red-50`}
            >
              <Heart className={`w-6 h-6 mr-2 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"} {likesCount > 0 && `(${likesCount})`}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => document.querySelector('[data-comment-section]')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg text-blue-600 hover:bg-blue-100"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
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
          <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">Join the Discussion</h3>
          
          {/* Comment Form */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
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
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-blue-900">{comment.name}</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                          {comment.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 text-lg">{comment.comment}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id)}
                        className="text-blue-500 hover:text-red-500 hover:bg-red-50"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {comments.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Article;
