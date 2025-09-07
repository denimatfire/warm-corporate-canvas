import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  FileText,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Presentation,
  Maximize2,
  Minimize2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import SlideViewer from "@/components/SlideViewer";
import { initializeSEO } from "@/lib/seo-utils";
import { getProjectBySlug, projectsApi, Project } from "@/lib/projects-api";
import { supabase } from "@/lib/articles-api";
import { useIsMobile } from "@/hooks/use-mobile";

const PresentationViewerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
        <Navigation />
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
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

  const handleDownload = async () => {
    if (project.presentation_type === 'file' && project.presentation_file_path) {
      try {
        // Increment download count
        await projectsApi.incrementDownloadCount(project.id);
        
        // Generate the full public URL from the file path
        const { data: urlData } = supabase.storage
          .from('Article_images')
          .getPublicUrl(project.presentation_file_path);
        
        // Create download link
        const link = document.createElement('a');
        link.href = urlData.publicUrl;
        link.download = project.presentation_file_name || `${project.slug}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else if (project.presentation_type === 'external_url' && project.presentation_url) {
      window.open(project.presentation_url, '_blank');
    }
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPresentationIcon = () => {
    if (project.presentation_type === 'file') {
      return <FileText className="w-5 h-5" />;
    }
    return <ExternalLink className="w-5 h-5" />;
  };

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Navigation />}
      
      <div className={`${isFullscreen ? 'h-full' : 'pt-20'}`}>
        {/* Header - Medium-like design */}
        {!isFullscreen && (
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
              className="mb-6 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>

            {/* Title and Meta */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    {project.is_featured && (
                      <Star className="w-6 h-6 text-yellow-500" />
                    )}
                    <Badge 
                      variant={project.presentation_type === 'file' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {getPresentationIcon()}
                      {project.presentation_type === 'file' ? 'File Upload' : 'External URL'}
                    </Badge>
                  </div>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {project.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {project.view_count || 0} views
                  </div>
                  {project.presentation_type === 'file' && (
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {project.download_count || 0} downloads
                    </div>
                  )}
                  {project.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {project.category}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={toggleFullscreen} 
                  size="lg" 
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Maximize2 className="w-5 h-5" />
                  Fullscreen
                </Button>
                
                <Button 
                  onClick={handleDownload} 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {project.presentation_type === 'file' ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                  {project.presentation_type === 'file' ? 'Download' : 'Open External'}
                </Button>

                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Controls */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate('/projects')}
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Slide Viewer */}
        <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto px-6 pb-8'}`}>
          <SlideViewer 
            project={project}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export default PresentationViewerPage;
