import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Eye, 
  Calendar, 
  Tag, 
  Share2,
  Star,
  Heart,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PresentationNavigation from "@/components/PresentationNavigation";
import SlideViewer from "@/components/SlideViewer";
import { initializeSEO } from "@/lib/seo-utils";
import { getProjectBySlug, Project } from "@/lib/projects-api";
import { useIsMobile } from "@/hooks/use-mobile";

const PresentationViewerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch project by slug
  const { data: project, error, isLoading: queryLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug!),
    enabled: !!slug,
    retry: 1
  });

  useEffect(() => {
    if (project) {
      initializeSEO('presentation', project);
    }
  }, [project]);

  // Handle loading state
  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);


  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <PresentationNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Presentation Not Found</h1>
            <p className="text-gray-600 mb-6">
              The presentation you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/projects')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <PresentationNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading presentation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <PresentationNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Presentation Not Found</h1>
            <p className="text-gray-600 mb-6">
              The presentation you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could show a toast here
        console.log('URL copied to clipboard');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // Here you would typically make an API call to update the like count
  };

  const handleComment = () => {
    // Here you would typically open a comment modal or navigate to comments
    console.log('Open comments');
  };


  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PresentationNavigation 
        projectTitle={project?.title}
        onBack={() => navigate('/projects')}
      />
      
      <div className="pt-16">
        {/* Compact Header */}
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Title and Meta - Compact */}
          <div className="text-center mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                    {project.title}
                  </h1>
            
            {/* Description - Smaller */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-4">
                  {project.description}
                </p>

            {/* Meta Information - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                    {project.view_count || 0} views
                  </div>
                  {project.category && (
                    <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                      {project.category}
                    </div>
                  )}
              {project.is_featured && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  Featured
                </div>
              )}
              </div>

            {/* Tags - Compact */}
              {project.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {project.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                {project.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{project.tags.length - 4}
                  </Badge>
                )}
                </div>
              )}

          </div>
        </div>

        {/* Presentation Viewer - Centered */}
        <div className="max-w-6xl mx-auto px-6">
          <SlideViewer 
            project={project}
            isFullscreen={false}
          />
        </div>

        {/* Social Interaction Section - Below Viewer */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-6">
            {/* Like Button */}
                <Button 
              onClick={handleLike}
              variant={isLiked ? "default" : "outline"}
                  size="lg" 
              className={`flex items-center gap-2 px-6 py-3 ${
                isLiked 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
              Like
                </Button>
                
            {/* Comment Button */}
                <Button 
              onClick={handleComment}
                  variant="outline" 
                  size="lg"
              className="flex items-center gap-2 px-6 py-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            >
              <MessageCircle className="w-5 h-5" />
              {commentCount > 0 && <span className="ml-1">{commentCount}</span>}
              Comment
                </Button>

            {/* Share Button */}
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  size="lg"
              className="flex items-center gap-2 px-6 py-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

        {/* Explore Other Projects Section */}
        <div className="max-w-4xl mx-auto px-6 py-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Explore Other Projects and Presentations
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover more insights, case studies, and technical demonstrations from my portfolio.
            </p>
            <Button
              onClick={() => navigate('/projects')}
              size="lg"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewerPage;
