import { useState } from "react";
import { Search, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Writing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      title: "Building Scalable Frontend Architecture",
      excerpt: "Explore modern patterns and practices for creating maintainable frontend applications that scale with your team and business needs.",
      date: "Dec 15, 2024",
      category: "Development",
      readTime: "8 min read",
      comments: 24,
      tags: ["React", "Architecture", "Best Practices"]
    },
    {
      title: "Leadership Lessons from Remote Teams",
      excerpt: "Key insights and strategies for effectively leading distributed teams in the modern workplace, based on real-world experience.",
      date: "Dec 10, 2024",
      category: "Leadership",
      readTime: "6 min read",
      comments: 18,
      tags: ["Leadership", "Remote Work", "Management"]
    },
    {
      title: "The Art of Code Review Culture",
      excerpt: "How to build a constructive code review process that improves code quality while fostering team growth and collaboration.",
      date: "Dec 5, 2024",
      category: "Process",
      readTime: "10 min read",
      comments: 32,
      tags: ["Code Review", "Culture", "Team"]
    },
    {
      title: "Embracing Continuous Learning",
      excerpt: "Personal strategies and frameworks for staying current in a rapidly evolving technology landscape while maintaining work-life balance.",
      date: "Nov 28, 2024",
      category: "Career",
      readTime: "7 min read",
      comments: 15,
      tags: ["Learning", "Career", "Growth"]
    },
    {
      title: "Design Systems That Scale",
      excerpt: "Creating and maintaining design systems that grow with your organization while ensuring consistency and usability across products.",
      date: "Nov 20, 2024",
      category: "Design",
      readTime: "12 min read",
      comments: 28,
      tags: ["Design Systems", "UI/UX", "Scalability"]
    },
    {
      title: "Mentoring the Next Generation",
      excerpt: "Practical approaches to mentoring junior developers and creating an environment where everyone can thrive and contribute.",
      date: "Nov 15, 2024",
      category: "Mentorship",
      readTime: "9 min read",
      comments: 21,
      tags: ["Mentorship", "Career", "Development"]
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="writing" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            My <span className="bg-gradient-accent bg-clip-text text-transparent">Writing</span>
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
    </section>
  );
};

export default Writing;