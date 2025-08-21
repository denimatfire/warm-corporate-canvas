import { useState, useEffect } from "react";
import { Search, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import BlogModal from "./BlogModal";
import { blogPosts, BlogPost } from "@/data/blogs";

const Writing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
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
              onClick={() => setSelectedArticle(article)}
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
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
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
                  <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform">
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
    </section>
  );
};

export default Writing;