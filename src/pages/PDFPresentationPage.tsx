import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Eye, 
  Calendar, 
  Tag, 
  Share2,
  Star,
  Heart,
  MessageCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PDFViewer from '@/components/PDFViewer';
import PresentationNavigation from '@/components/PresentationNavigation';
import { initializeSEO } from '@/lib/seo-utils';
import { getProjectBySlug, Project } from '@/lib/projects-api';
import { useIsMobile } from '@/hooks/use-mobile';

const PDFPresentationPage: React.FC = () => {
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

  // Check if this is a PDF file
  if (project.presentation_type !== 'file' || project.presentation_file_type !== 'application/pdf') {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <PresentationNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Not a PDF File</h1>
            <p className="text-gray-600 mb-6">
              This presentation is not a PDF file and cannot be viewed with the PDF viewer.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/projects')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <Button onClick={() => navigate(`/presentation/${slug}`)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original
              </Button>
            </div>
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
        console.log('URL copied to clipboard');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    console.log('Open comments');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PresentationNavigation 
        projectTitle={project?.title}
        onBack={() => navigate('/projects')}
      />
      
      <div className="pt-16">
        {/* Article-style Header */}
        <article className="max-w-4xl mx-auto px-6 py-8">
          {/* Title and Meta */}
          <header className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {project.title}
            </h1>
            
            {/* Description */}
            {project.description && (
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
                {project.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {project.view_count || 0} views
              </div>
              {project.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {project.category}
                </div>
              )}
              {project.is_featured && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Featured
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* PDF Viewer */}
          <div className="mb-8">
            <PDFViewer project={project} />
          </div>

          {/* Social Interaction Section */}
          <div className="flex items-center justify-center gap-6 mb-8">
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

          {/* Download Section */}
          <div className="text-center mb-8">
            <Button
              onClick={() => {
                // This will be handled by the PDFViewer component
                const link = document.createElement('a');
                if (project.presentation_file_path) {
                  // We'll need to get the URL from the PDFViewer or implement it here
                  console.log('Download triggered');
                }
              }}
              size="lg"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white mx-auto"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </article>

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

export default PDFPresentationPage;
