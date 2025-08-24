import { useState, useEffect } from "react";
import { Search, Calendar, MessageCircle, ArrowRight, BookOpen, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import PhotoViewer from "./PhotoViewer";
import { getPublishedArticles, Article } from "@/data/articles";

const Writing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedPhotoPhotos, setSelectedPhotoPhotos] = useState<string[]>([]);
  const [useMediumView, setUseMediumView] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Load articles from the unified system
  useEffect(() => {
    const publishedArticles = getPublishedArticles();
    setArticles(publishedArticles);
  }, []);

  // Load user preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('articleViewStyle');
    if (savedPreference) {
      setUseMediumView(savedPreference === 'medium');
    }
  }, []);

  // Save user preference to localStorage
  const handleViewToggle = (useMedium: boolean) => {
    setUseMediumView(useMedium);
    localStorage.setItem('articleViewStyle', useMedium ? 'medium' : 'regular');
  };

  // Reset state when component mounts or location changes
  useEffect(() => {
    // Clean up any previous state
  }, [location.pathname]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePhotoClick = (photos: string[], index: number) => {
    setSelectedPhotoPhotos(photos);
    setSelectedPhotoIndex(index);
    setPhotoViewerOpen(true);
  };

  const handleArticleClick = (article: Article) => {
    // Navigate to the appropriate article view based on toggle state
    if (useMediumView) {
      navigate(`/article-medium/${article.id}`);
    } else {
      navigate(`/article/${article.id}`);
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    
    // Navigate to the appropriate article view based on toggle state
    if (useMediumView) {
      navigate(`/article-medium/${article.id}`);
    } else {
      navigate(`/article/${article.id}`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

          {/* View Toggle and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-lg p-1 border border-border">
              <Button
                variant={!useMediumView ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewToggle(false)}
                className={`flex items-center space-x-2 ${!useMediumView ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Regular</span>
              </Button>
              <Button
                variant={useMediumView ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewToggle(true)}
                className={`flex items-center space-x-2 ${useMediumView ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Medium</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-card border-border focus:border-primary w-80"
              />
            </div>
          </div>

          {/* View Style Indicator */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              {useMediumView ? (
                <span className="flex items-center justify-center space-x-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Medium-style reading experience</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Standard reading experience</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredArticles.map((article, index) => (
            <Card 
              key={article.id}
              className="glass-card hover-lift cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleArticleClick(article)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              
              {/* Photo Preview */}
              {article.coverImage && (
                <div className="px-6 -mt-2 mb-4">
                  <div className="relative overflow-hidden rounded-lg border border-border">
                    <img
                      src={article.coverImage}
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
                    <span>{article.readTime} min read</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>0</span>
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