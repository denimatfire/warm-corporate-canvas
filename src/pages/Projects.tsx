import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List, SortAsc, SortDesc, Eye, Download, ExternalLink, FileText, Calendar, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { initializeSEO } from "@/lib/seo-utils";
import { getPublishedProjects, getProjectCategories, getProjectTags, searchProjects, Project } from "@/lib/projects-api";
import { supabase } from "@/lib/articles-api";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Initialize SEO for projects page
    initializeSEO('projects');
  }, []);

  // Fetch projects with filters
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects", { searchQuery, selectedCategory, selectedTag, sortBy }],
    queryFn: async () => {
      console.log('Fetching projects with filters:', { searchQuery, selectedCategory, selectedTag, sortBy });
      if (searchQuery.trim()) {
        const searchResults = await searchProjects(searchQuery, {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          status: "published"
        });
        console.log('Search results:', searchResults);
        return searchResults;
      }
      const publishedProjects = await getPublishedProjects();
      console.log('Published projects:', publishedProjects);
      return publishedProjects;
    }
  });

  // Debug logging
  useEffect(() => {
    console.log('Projects state:', { projects, isLoading, error });
  }, [projects, isLoading, error]);

  // Fetch categories and tags
  const { data: categories = [] } = useQuery({
    queryKey: ["project-categories"],
    queryFn: getProjectCategories
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["project-tags"],
    queryFn: getProjectTags
  });

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return (b.view_count || 0) - (a.view_count || 0);
      case "title":
        return a.title.localeCompare(b.title);
      case "category":
        return (a.category || "").localeCompare(b.category || "");
      default:
        return 0;
    }
  });

  // Filter projects by category and tag
  const filteredProjects = sortedProjects.filter(project => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const tagMatch = selectedTag === "all" || project.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleProjectClick = (project: Project) => {
    // Navigate to presentation viewer
    window.location.href = `/presentation/${project.slug}`;
  };

  const handleDownload = async (project: Project) => {
    if (project.presentation_type === 'file' && project.presentation_file_path) {
      try {
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
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Projects & <span className="text-primary">Presentations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore my portfolio of projects, presentations, and technical demonstrations. 
              From academic research to professional case studies.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects, presentations, or topics..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="py-8 px-6 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {tags.slice(0, 20).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {isSearching ? `Search Results for "${searchQuery}"` : "All Projects"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Projects Grid/List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {isSearching ? 'Try adjusting your search terms or filters.' : 'No projects have been published yet.'}
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProjects.map((project) => (
                  viewMode === "grid" ? (
                    // Grid View
                    <Card 
                      key={project.id} 
                      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      onClick={() => handleProjectClick(project)}
                    >
                      {/* Cover Image */}
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-primary/50" />
                          </div>
                        )}
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
                          {/* Category */}
                          {project.category && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {project.category}
                              </span>
                            </div>
                          )}
                          
                          {/* Tags */}
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 2}
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
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // List View
                    <Card 
                      key={project.id} 
                      className="group cursor-pointer hover:shadow-md transition-all duration-300"
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                            {project.cover_image ? (
                              <img
                                src={project.cover_image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-8 h-8 text-primary/50" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {project.title}
                              </h3>
                              <Badge 
                                variant={project.presentation_type === 'file' ? 'default' : 'secondary'}
                                className="flex items-center gap-1 text-xs flex-shrink-0"
                              >
                                {getPresentationIcon(project)}
                                {project.presentation_type === 'file' ? 'File' : 'Link'}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground line-clamp-2 mb-3">
                              {project.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {project.category && (
                                <span className="text-primary font-medium">
                                  {project.category}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {project.view_count || 0} views
                              </span>
                              {project.presentation_type === 'file' && (
                                <span className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  {project.download_count || 0} downloads
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(project.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectClick(project);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(project);
                              }}
                              className="flex items-center gap-1"
                            >
                              {project.presentation_type === 'file' ? (
                                <Download className="w-4 h-4" />
                              ) : (
                                <ExternalLink className="w-4 h-4" />
                              )}
                              {project.presentation_type === 'file' ? 'Download' : 'Open'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
