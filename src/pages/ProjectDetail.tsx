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
  Presentation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { initializeSEO } from "@/lib/seo-utils";
import { getProjectBySlug, projectsApi, Project } from "@/lib/projects-api";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      initializeSEO('project', { slug });
    }
  }, [slug]);

  // Fetch project by slug
  const { data: project, error, isLoading: queryLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug!),
    enabled: !!slug,
    retry: 1
  });

  // Handle loading state
  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero text-foreground">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
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
      <div className="min-h-screen bg-gradient-hero text-foreground">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-hero text-foreground">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist.
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
        
        // Create download link
        const link = document.createElement('a');
        link.href = project.presentation_file_path;
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

  const handleView = () => {
    if (project.presentation_type === 'external_url' && project.presentation_url) {
      window.open(project.presentation_url, '_blank');
    } else if (project.presentation_type === 'file' && project.presentation_file_path) {
      // For file uploads, we could open in a new tab or show a preview
      window.open(project.presentation_file_path, '_blank');
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
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Meta */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
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

                <p className="text-xl text-muted-foreground">
                  {project.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Content */}
              {project.content && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About This Project</h3>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={handleView} size="lg" className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {project.presentation_type === 'file' ? 'View File' : 'Open Link'}
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <Card>
                <CardContent className="p-0">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full aspect-video object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg">
                      <Presentation className="w-16 h-16 text-primary/50" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Type</h4>
                    <p className="flex items-center gap-2">
                      {getPresentationIcon()}
                      {project.presentation_type === 'file' ? 'File Upload' : 'External URL'}
                    </p>
                  </div>

                  {project.category && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Category</h4>
                      <p>{project.category}</p>
                    </div>
                  )}

                  {project.presentation_type === 'file' && project.presentation_file_size && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">File Size</h4>
                      <p>{formatFileSize(project.presentation_file_size)}</p>
                    </div>
                  )}

                  {project.presentation_type === 'file' && project.presentation_file_name && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">File Name</h4>
                      <p className="text-sm break-all">{project.presentation_file_name}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                    <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>

                  {project.published_at && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Published</h4>
                      <p>{new Date(project.published_at).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Projects (placeholder for future implementation) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Related projects will appear here in future updates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
