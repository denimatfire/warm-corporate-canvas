import { useState, useEffect } from "react";
import { X, Share2, Download, BookOpen, Calendar, MessageCircle, Heart, Send, User, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/data/blogs";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import PhotoViewer from "./PhotoViewer";

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: Date;
  likes: number;
}

interface BlogModalProps {
  article: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal = ({ article, isOpen, onClose }: BlogModalProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedPhotoPhotos, setSelectedPhotoPhotos] = useState<string[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Debug logging
  console.log('BlogModal render:', { isOpen, article: article?.title, photos: article?.photos });

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Debug: Show modal state
  if (isOpen) {
    console.log('Modal should be open with article:', article?.title);
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || '',
        text: article?.excerpt || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    if (!article) return;
    const content = `# ${article.title}\n\n${article.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
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
    }, 1000);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  // Add global function for photo viewer
  useEffect(() => {
    if (article) {
      // Use the photos array directly from the article
      setSelectedPhotoPhotos(article.photos || []);
    }
    
    return () => {
      // Cleanup global function
      if ((window as any).openPhotoViewer) {
        delete (window as any).openPhotoViewer;
      }
    };
  }, [article]);

  const scrollToComments = () => {
    const commentSection = document.querySelector('[data-comment-section]');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalComments = comments.length + (article?.comments || 0);

  const handleMaximize = async () => {
    if (!article) return;
    setIsNavigating(true);
    // Close the modal and navigate to full article page
    onClose();
    // Navigate to full article page without replacing history
    navigate(`/article/${article.id}`);
  };

  const handlePhotoClick = (photos: string[], index: number) => {
    setSelectedPhotoPhotos(photos);
    setSelectedPhotoIndex(index);
    setPhotoViewerOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {article && (
          <DialogContent 
            className={`${isMobile ? 'w-[95vw] h-[95vh] mx-2' : 'max-w-4xl h-[90vh]'} p-0 flex flex-col`} 
            style={{ 
              zIndex: 9999,
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid #e5e7eb'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <DialogHeader className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} border-b border-border flex-shrink-0`}>
                <div className="flex flex-col space-y-3">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/src/assets/profile-photo.jpg" />
                      <AvatarFallback>DD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-lg font-semibold truncate">Dhrubajyoti Das</DialogTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{article.date}</span>
                        <span>•</span>
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-end'} space-x-2`}>
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "sm"}
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Close modal"
                    >
                      <X className="w-4 h-4" />
                      {isMobile && <span className="ml-2">Close</span>}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "sm"}
                      onClick={handleMaximize}
                      disabled={isNavigating}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Open in full page"
                    >
                      {isNavigating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className={isMobile ? "text-sm" : ""}>Opening...</span>
                        </div>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4 mr-2" />
                          {isMobile ? "Full" : "Full Page"}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "sm"}
                      onClick={handleShare}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {isMobile ? "" : "Share"}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size={isMobile ? "sm" : "sm"}
                      onClick={handleDownload}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isMobile ? "" : "Download"}
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              {/* Content - Fixed scrolling area */}
              <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-6'} min-h-0`}>
                <div className="max-w-none prose prose-lg dark:prose-invert">
                  {/* Article Header */}
                  <div className={`${isMobile ? 'mb-6' : 'mb-8'} text-center`}>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                        {article.category}
                      </Badge>
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-900 mb-4 leading-tight`}>{article.title}</h1>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed`}>
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Article Content */}
                  <div className={`prose prose-lg dark:prose-invert max-w-none prose-headings:text-blue-900 
                    ${isMobile ? 'prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6 prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4 prose-p:text-sm prose-p:leading-relaxed prose-p:mb-3 prose-ul:mb-3 prose-li:mb-1' : 
                    'prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-ul:mb-4 prose-li:mb-1'}`}>
                    
                    {/* Content with inline photos */}
                    <div className="text-muted-foreground leading-relaxed space-y-6">
                      {(() => {
                        const paragraphs = article.content.split('\n\n').filter(p => p.trim());
                        const photos = article.photos || [];
                        let photoIndex = 0;
                        
                        return paragraphs.map((paragraph, index) => {
                          // Check if paragraph contains a photo marker
                          const photoMatch = paragraph.match(/\[PHOTO:(.*?)\]/);
                          
                          if (photoMatch) {
                            // Extract photo URL and remove marker from paragraph
                            const photoUrl = photoMatch[1];
                            const cleanParagraph = paragraph.replace(/\[PHOTO:.*?\]/, '').trim();
                            
                            return (
                              <div key={index}>
                                {cleanParagraph && (
                                  <p className="mb-4 leading-relaxed">{cleanParagraph}</p>
                                )}
                                <div className="my-6 text-center">
                                  <img
                                    src={photoUrl}
                                    alt={`${article.title} illustration`}
                                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                                    style={{ maxHeight: '400px' }}
                                    onClick={() => handlePhotoClick([photoUrl], 0)}
                                  />
                                </div>
                              </div>
                            );
                          } else if (paragraph.trim().startsWith('##')) {
                            // Convert markdown headings to HTML
                            const level = paragraph.trim().startsWith('###') ? 3 : 2;
                            const text = paragraph.trim().replace(/^#+\s*/, '');
                            
                            return (
                              <div key={index}>
                                {level === 2 ? (
                                  <h2 className="text-blue-900 font-bold mb-4 mt-8">{text}</h2>
                                ) : (
                                  <h3 className="text-blue-900 font-semibold mb-3 mt-6">{text}</h3>
                                )}
                              </div>
                            );
                          } else if (paragraph.trim().startsWith('-')) {
                            // Convert markdown lists to HTML
                            const items = paragraph.trim().split('\n').filter(item => item.trim().startsWith('-'));
                            const listItems = items.map(item => {
                              const text = item.trim().replace(/^-\s*/, '');
                              return <li key={item} className="mb-2">{text}</li>;
                            });
                            
                            return (
                              <div key={index}>
                                <ul className="list-disc pl-6 mb-4">{listItems}</ul>
                              </div>
                            );
                          } else if (paragraph.trim()) {
                            // Regular paragraphs
                            return (
                              <div key={index}>
                                <p className="mb-4 leading-relaxed">{paragraph.trim()}</p>
                              </div>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className={`${isMobile ? 'mt-8' : 'mt-12'}`} data-comment-section>
                    <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground mb-6`}>Comments ({totalComments})</h3>
                    
                    {/* Comment Form */}
                    <Card className="mb-8 bg-card/50 border-border">
                      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                            <Input
                              placeholder="Your name"
                              value={newComment.name}
                              onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                              required
                            />
                            <Input
                              placeholder="Your comment"
                              value={newComment.comment}
                              onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                              required
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Posting...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Send className="w-4 h-4" />
                                <span>Post Comment</span>
                              </div>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id} className="bg-card/30 border-border">
                          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <h4 className="font-semibold text-foreground truncate">{comment.name}</h4>
                              </div>
                              <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                                {comment.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3 break-words">{comment.comment}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCommentLike(comment.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {comments.length === 0 && (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} border-t border-border flex-shrink-0`}>
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={liked ? "text-red-500" : ""}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${liked ? "fill-current" : ""}`} />
                      {liked ? "Liked" : "Like"} {likesCount > 0 && `(${likesCount})`}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={scrollToComments}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span>{totalComments} comments</span>
                    </Button>
                  </div>
                  <div className={`text-sm text-muted-foreground ${isMobile ? 'text-center' : ''}`}>
                    Published on {article.date}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
        
        {/* Photo Viewer Modal */}
        <PhotoViewer
          photos={selectedPhotoPhotos}
          initialIndex={selectedPhotoIndex}
          isOpen={photoViewerOpen}
          onClose={() => setPhotoViewerOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default BlogModal;