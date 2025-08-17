import { useState } from "react";
import { X, Share2, Download, BookOpen, Calendar, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface BlogModalProps {
  article: {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    comments: number;
    tags: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal = ({ article, isOpen, onClose }: BlogModalProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!article) return null;

  const fullContent = `
${article.excerpt}

## Introduction

In today's rapidly evolving technological landscape, the concepts and practices I'm sharing have become more crucial than ever. Through years of hands-on experience and continuous learning, I've discovered patterns and methodologies that consistently deliver results.

## Key Insights

The journey of professional development is multifaceted, requiring not just technical skills but also emotional intelligence, strategic thinking, and adaptability. Here are some fundamental principles that have shaped my approach:

### 1. Continuous Learning Mindset

The technology industry moves at breakneck speed. What worked yesterday might be obsolete tomorrow. Embracing a continuous learning mindset isn't just beneficial—it's essential for survival and growth.

### 2. Building Meaningful Relationships

Success in any field is rarely achieved in isolation. The relationships you build, the networks you cultivate, and the mentorships you engage in often determine the trajectory of your career more than technical skills alone.

### 3. Practical Application

Knowledge without application is merely information. The real value comes from taking what you learn and applying it to solve real-world problems. This is where theory meets practice, and true expertise is born.

## Real-World Examples

Throughout my career, I've encountered numerous situations where these principles proved invaluable. From leading remote teams across different time zones to architecting scalable systems that serve millions of users, the lessons learned are both diverse and universally applicable.

## Implementation Strategies

When implementing new strategies or technologies, I've found that a systematic approach works best:

1. **Research and Planning**: Understanding the problem space thoroughly
2. **Prototyping**: Building small, testable solutions
3. **Iteration**: Continuously improving based on feedback
4. **Documentation**: Sharing knowledge for future reference

## Conclusion

The path to expertise is paved with curiosity, persistence, and a willingness to fail and learn from those failures. As we continue to navigate an increasingly complex professional landscape, these foundational principles remain constant guides toward meaningful growth and success.

The future belongs to those who can adapt, learn, and apply their knowledge effectively. By embracing these concepts, we can build not just successful careers, but also contribute meaningfully to our communities and industries.
  `;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const content = `# ${article.title}\n\n${fullContent}`;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/src/assets/profile-photo.jpg" />
                  <AvatarFallback>DD</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-semibold">Dhrubajyoti Das</DialogTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <BookOpen className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content - Fixed scrolling area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
            <div className="max-w-none prose prose-lg dark:prose-invert">
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{article.title}</h1>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {fullContent}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={liked ? "text-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{article.comments} comments</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Published on {article.date}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;