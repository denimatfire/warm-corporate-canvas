import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, Download, Eye, ArrowRight, Settings, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPublishedProjects, getFeaturedProjects, Project } from "@/lib/projects-api";
import { supabase } from "@/lib/articles-api";

interface ProjectsProps {
  showAll?: boolean;
}

const Projects = ({ showAll = false }: ProjectsProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // Fetch projects based on showAll prop
  // For home page, try featured projects first, then fall back to published projects
  const { data: featuredProjects = [], isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: getFeaturedProjects,
    enabled: !showAll, // Only fetch featured projects for home page
    retry: 1
  });

  const { data: publishedProjects = [], isLoading: publishedLoading, error: publishedError } = useQuery({
    queryKey: showAll ? ["published-projects"] : ["published-projects-fallback"],
    queryFn: getPublishedProjects,
    retry: 2
    
  });

  // Use featured projects if available, otherwise use published projects
  const projects: Project[] = showAll ? publishedProjects : (featuredProjects.length > 0 ? featuredProjects : publishedProjects);
  const isLoading = showAll ? publishedLoading : (featuredLoading || publishedLoading);
  const error = showAll ? publishedError : (featuredError || publishedError);


  // Display projects (limit to 3 if not showAll)
  const displayProjects = showAll ? projects : projects.slice(0, 3);

  const handleProjectClick = (project: Project) => {
    // Increment view count
    if (project.id) {
      // This would be called when viewing the presentation
      // projectsApi.incrementViewCount(project.id);
    }
    
    // Route to PDF viewer for PDF files, otherwise to regular presentation viewer
    if (project.presentation_type === 'file' && project.presentation_file_type === 'application/pdf') {
      navigate(`/pdf/${project.slug}`);
    } else {
      navigate(`/presentation/${project.slug}`);
    }
  };


  const getPresentationIcon = (project: Project) => {
    if (project.presentation_type === 'file') {
      return <FileText className="w-4 h-4" />;
    }
    return <ExternalLink className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section id="projects" className={`py-20 ${isMobile ? 'px-4' : 'px-6'} bg-gradient-section`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-12' : 'mb-16'} animate-fade-in`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 
              className={`${isMobile ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-bold text-foreground cursor-pointer hover:text-primary transition-colors`}
              onClick={() => navigate('/projects')}
            >
              Projects & <span className="text-primary">Presentations</span>
            </h2>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/projects')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage
              </Button>
            )}
          </div>
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-muted-foreground mb-8 max-w-3xl mx-auto`}>
            Explore my portfolio of projects, presentations, and technical demonstrations. 
            From academic research to professional case studies.
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Presentation className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Projects</h3>
            <p className="text-muted-foreground mb-6">
              There was an error loading the projects. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm text-red-600">
                  <strong>Debug Info:</strong><br />
                  Error: {error.message}<br />
                  Query Key: {showAll ? "published-projects" : "home-projects"}
                </p>
              </div>
            )}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="text-center py-12">
            <Presentation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              {isAuthenticated ? 'Start by creating your first project.' : 'Projects will appear here once published.'}
            </p>
            {isAuthenticated && (
              <Button onClick={() => navigate('/admin/projects')}>
                Create First Project
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {displayProjects.map((project) => (
              <Card 
                key={project.id} 
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                onClick={() => handleProjectClick(project)}
              >
                {/* Cover Image */}
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 relative">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Presentation className="w-16 h-16 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                    </div>
                  )}
                  
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Presentation className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge 
                      variant={project.presentation_type === 'file' ? 'default' : 'secondary'}
                      className="flex items-center gap-1 text-xs"
                    >
                      {getPresentationIcon(project)}
                      {project.presentation_type === 'file' ? 'File' : 'Link'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {/* Category and Tags */}
                    {project.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {project.category}
                        </span>
                      </div>
                    )}
                    
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.view_count || 0}
                        </span>
                        {project.presentation_type === 'file' && (
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {project.download_count || 0}
                          </span>
                        )}
                      </div>
                      <span>
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* File size for file uploads */}
                    {project.presentation_type === 'file' && project.presentation_file_size && (
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(project.presentation_file_size)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Button */}
        {!showAll && displayProjects.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/projects')}
              className="group"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
