import { useState, useEffect } from "react";
import { Search, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import BlogModal from "./BlogModal";
import PhotoViewer from "./PhotoViewer";
import { blogPosts, BlogPost } from "@/data/blogs";

const Writing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedPhotoPhotos, setSelectedPhotoPhotos] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset modal state when component mounts or location changes
  useEffect(() => {
    setSelectedArticle(null);
  }, [location.pathname]);

  // Handle navigation state for opening specific article
  useEffect(() => {
    if (location.state?.openArticle) {
      const article = blogPosts.find(a => a.id === location.state.openArticle);
      if (article) {
        setSelectedArticle(article);
        // Clear the state to prevent reopening on subsequent renders
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate, location.pathname]);

  const filteredArticles = blogPosts.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePhotoClick = (photos: string[], index: number) => {
    setSelectedPhotoPhotos(photos);
    setSelectedPhotoIndex(index);
    setPhotoViewerOpen(true);
  };

  const handleArticleClick = (article: BlogPost) => {
    console.log('=== Article Click Debug ===');
    console.log('Article clicked:', article);
    console.log('Article title:', article.title);
    console.log('Article id:', article.id);
    console.log('Article type:', typeof article);
    console.log('Setting selectedArticle to:', article);
    // Open the blog modal instead of navigating
    setSelectedArticle(article);
    console.log('selectedArticle state should now be:', article);
    console.log('=== End Debug ===');
  };

  const handleReadMoreClick = (e: React.MouseEvent, article: BlogPost) => {
    e.stopPropagation();
    console.log('Read more clicked:', article.title);
    console.log('Setting selectedArticle to:', article);
    setSelectedArticle(article);
    console.log('selectedArticle state should now be:', article);
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log('=== selectedArticle State Change ===');
    console.log('selectedArticle:', selectedArticle);
    console.log('selectedArticle type:', typeof selectedArticle);
    console.log('selectedArticle title:', selectedArticle?.title);
    console.log('selectedArticle id:', selectedArticle?.id);
    console.log('Modal open state:', !!selectedArticle);
    console.log('=== End State Change Debug ===');
  }, [selectedArticle]);

  return (
    <section id="writing" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/writing')}
          >
            My <span className="text-white">Writing</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Sharing insights, experiences, and lessons learned throughout my professional journey. 
            Thoughts on technology, leadership, and personal growth.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredArticles.map((article, index) => (
            <Card 
              key={article.title}
              className="glass-card hover-lift cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleArticleClick(article)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              
              {/* Photo Preview */}
              {article.mainPhoto && (
                <div className="px-6 -mt-2 mb-4">
                  <div 
                    className="relative overflow-hidden rounded-lg border border-border cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open the blog modal instead of photo viewer
                      setSelectedArticle(article);
                    }}
                  >
                    <img
                      src={article.mainPhoto}
                      alt={`${article.title} preview`}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <CardContent>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{article.readTime}</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform cursor-pointer" onClick={(e) => handleReadMoreClick(e, article)}>
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No articles found matching "{searchTerm}". Try a different search term.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Photo Viewer Modal */}
      <PhotoViewer
        photos={selectedPhotoPhotos}
        initialIndex={selectedPhotoIndex}
        isOpen={photoViewerOpen}
        onClose={() => setPhotoViewerOpen(false)}
      />
    </section>
  );
};

export default Writing;