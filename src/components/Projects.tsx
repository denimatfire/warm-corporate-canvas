import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, Download, Eye, ArrowRight, Settings, Presentation } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
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

  const pillButton =
    "group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary";

  return (
    <section id="projects" className={`relative py-24 ${isMobile ? 'px-4' : 'px-6'}`}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              Projects &amp; <span className="text-gradient">presentations</span>
            </>
          }
          description="Explore my portfolio of projects, presentations, and technical demonstrations. From academic research to professional case studies."
          action={
            <div className="flex flex-wrap gap-2">
              {isAuthenticated && (
                <button onClick={() => navigate('/admin/projects')} className={pillButton}>
                  <Settings className="h-4 w-4" />
                  Manage
                </button>
              )}
              {!showAll && displayProjects.length > 0 && (
                <button onClick={() => navigate('/projects')} className={pillButton}>
                  All projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          }
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass animate-pulse overflow-hidden rounded-3xl">
                <div className="aspect-video bg-foreground/5" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-foreground/10" />
                  <div className="h-3 w-full rounded bg-foreground/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
            <Presentation className="mb-4 h-12 w-12 text-destructive" />
            <h3 className="mb-2 font-display text-xl font-semibold text-foreground">Error loading projects</h3>
            <p className="mb-6 text-muted-foreground">
              There was an error loading the projects. Please try refreshing the page.
            </p>
            <button onClick={() => window.location.reload()} className={pillButton}>
              Refresh page
            </button>
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Presentation className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated ? 'Start by creating your first project.' : 'Projects will appear here once published.'}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/admin/projects')}
                className="mt-6 rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-[hsl(240_24%_6%)]"
              >
                Create first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.06}>
                <article
                  onClick={() => handleProjectClick(project)}
                  className="glass glow-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-transparent">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Presentation className="h-14 w-14 text-primary/60 transition-colors group-hover:text-primary" />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {getPresentationIcon(project)}
                      {project.presentation_type === 'file' ? 'File' : 'Link'}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {project.category && (
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">{project.category}</div>
                    )}
                    <h3 className="line-clamp-2 font-display text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                    {project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {project.view_count || 0}
                        </span>
                        {project.presentation_type === 'file' && (
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {project.download_count || 0}
                          </span>
                        )}
                        {project.presentation_type === 'file' && project.presentation_file_size && (
                          <span>{formatFileSize(project.presentation_file_size)}</span>
                        )}
                      </div>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
