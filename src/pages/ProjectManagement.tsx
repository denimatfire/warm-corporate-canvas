import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Settings, 
  RefreshCw,
  ExternalLink,
  FileText,
  Download,
  Star,
  Calendar,
  Tag,
  User,
  Presentation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { 
  projectsApi, 
  Project, 
  CreateProjectData, 
  UpdateProjectData 
} from "@/lib/projects-api";

const ProjectManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPresentationType, setSelectedPresentationType] = useState<string>("all");
  const [showUnpublished, setShowUnpublished] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    content: "",
    presentation_type: "file" as "file" | "external_url",
    presentation_url: "",
    category: "",
    tags: "",
    is_featured: false,
    status: "draft" as "draft" | "published"
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");

  const queryClient = useQueryClient();

  // Fetch projects with filters
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", { searchQuery, selectedCategory, selectedPresentationType, showUnpublished }],
    queryFn: () => {
      const filters: any = {};
      if (selectedCategory && selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedPresentationType && selectedPresentationType !== "all") filters.presentation_type = selectedPresentationType;
      if (showUnpublished !== undefined) filters.status = showUnpublished ? undefined : "published";
      
      if (searchQuery) {
        return projectsApi.search(searchQuery, filters);
      }
      return projectsApi.getAll(filters);
    }
  });

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["project-categories"],
    queryFn: projectsApi.getCategories
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      setIsCreateDialogOpen(false);
      resetCreateForm();
    },
    onError: (error: Error) => {
      toast.error(`Creation failed: ${error.message}`);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) => 
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      setEditingProject(null);
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    }
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: projectsApi.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project publish status updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    }
  });

  const resetCreateForm = () => {
    setCreateForm({
      title: "",
      description: "",
      content: "",
      presentation_type: "file",
      presentation_url: "",
      category: "",
      tags: "",
      is_featured: false,
      status: "draft"
    });
    setSelectedFile(null);
    setSelectedCoverFile(null);
    setPreviewUrl("");
    setCoverPreviewUrl("");
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCoverFileSelect = (file: File) => {
    setSelectedCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreviewUrl(url);
  };

  const handleCreate = () => {
    if (!createForm.title.trim()) {
      toast.error("Please provide a title");
      return;
    }

    if (createForm.presentation_type === "file" && !selectedFile) {
      toast.error("Please select a presentation file");
      return;
    }

    if (createForm.presentation_type === "external_url" && !createForm.presentation_url.trim()) {
      toast.error("Please provide a presentation URL");
      return;
    }

    const projectData: CreateProjectData = {
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      content: createForm.content.trim() || undefined,
      presentation_type: createForm.presentation_type,
      presentation_file: createForm.presentation_type === "file" ? selectedFile : undefined,
      presentation_url: createForm.presentation_type === "external_url" ? createForm.presentation_url.trim() : undefined,
      cover_image_file: selectedCoverFile || undefined,
      tags: createForm.tags.trim() ? createForm.tags.split(",").map(tag => tag.trim()) : undefined,
      category: createForm.category.trim() || undefined,
      is_featured: createForm.is_featured,
      status: createForm.status
    };

    createProjectMutation.mutate(projectData);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setCreateForm({
      title: project.title,
      description: project.description,
      content: project.content || "",
      presentation_type: project.presentation_type,
      presentation_url: project.presentation_url || "",
      category: project.category || "",
      tags: project.tags.join(", "),
      is_featured: project.is_featured,
      status: project.status
    });
  };

  const handleUpdate = () => {
    if (!editingProject) return;

    const updateData: UpdateProjectData = {
      title: createForm.title.trim() || undefined,
      description: createForm.description.trim() || undefined,
      content: createForm.content.trim() || undefined,
      presentation_type: createForm.presentation_type,
      presentation_file: selectedFile || undefined,
      presentation_url: createForm.presentation_type === "external_url" ? createForm.presentation_url.trim() : undefined,
      cover_image_file: selectedCoverFile || undefined,
      tags: createForm.tags.trim() ? createForm.tags.split(",").map(tag => tag.trim()) : undefined,
      category: createForm.category.trim() || undefined,
      is_featured: createForm.is_featured,
      status: createForm.status
    };

    updateProjectMutation.mutate({ id: editingProject.id, data: updateData });
  };

  const handleDelete = (project: Project) => {
    deleteProjectMutation.mutate(project.id);
  };

  const handleTogglePublish = (project: Project) => {
    togglePublishMutation.mutate(project.id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPresentationIcon = (project: Project) => {
    if (project.presentation_type === 'file') {
      return <FileText className="w-4 h-4" />;
    }
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Project Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your projects and presentations
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-right flex-1 sm:flex-none">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-medium">Dhruba</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  toast.info("Refreshing projects...");
                  await queryClient.invalidateQueries({ queryKey: ["projects"] });
                  toast.success("Projects list refreshed!");
                } catch (error) {
                  toast.error(`Failed to refresh: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
              className="ml-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
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
              <Select value={selectedPresentationType} onValueChange={setSelectedPresentationType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="external_url">External URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Button
                variant={showUnpublished ? "default" : "outline"}
                onClick={() => setShowUnpublished(!showUnpublished)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                <span className="sm:hidden">
                  {showUnpublished ? "All Projects" : "Published Only"}
                </span>
                <span className="hidden sm:inline">
                  {showUnpublished ? "All Projects" : "Published Only"}
                </span>
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span className="sm:hidden">Create Project</span>
                    <span className="hidden sm:inline">Create Project</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto" aria-describedby="create-dialog-description">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <p id="create-dialog-description" className="text-sm text-muted-foreground">
                      Create a new project with presentation file or external URL.
                    </p>
                  </DialogHeader>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={createForm.title}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter project title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={createForm.category}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Academic, Professional, Technical"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the project..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Detailed Content</Label>
                      <Textarea
                        id="content"
                        value={createForm.content}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Detailed project description, methodology, results, etc..."
                        rows={5}
                      />
                    </div>

                    {/* Presentation Type */}
                    <div className="space-y-4">
                      <Label>Presentation Type *</Label>
                      <Tabs value={createForm.presentation_type} onValueChange={(value) => setCreateForm(prev => ({ ...prev, presentation_type: value as "file" | "external_url" }))}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="file">File Upload</TabsTrigger>
                          <TabsTrigger value="external_url">External URL</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="file" className="space-y-4">
                          <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center">
                            {selectedFile ? (
                              <div className="space-y-2">
                                <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-primary" />
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                  <span className="text-xs sm:text-sm text-muted-foreground text-center">
                                    {selectedFile.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({formatFileSize(selectedFile.size)})
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedFile(null);
                                      setPreviewUrl("");
                                    }}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                  Upload presentation file
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  (PDF, PPT, PPTX, ODP)
                                </p>
                                <p className="text-xs text-muted-foreground mb-4">
                                  Max size: 50MB
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.pdf,.ppt,.pptx,.odp';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) handleFileSelect(file);
                                    };
                                    input.click();
                                  }}
                                >
                                  Select File
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="external_url" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="presentation_url">Presentation URL *</Label>
                            <Input
                              id="presentation_url"
                              value={createForm.presentation_url}
                              onChange={(e) => setCreateForm(prev => ({ ...prev, presentation_url: e.target.value }))}
                              placeholder="https://slideshare.net/your-presentation"
                            />
                            <p className="text-xs text-muted-foreground">
                              Supported: SlideShare, Google Slides, Prezi, YouTube, direct PDF links
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                      <Label>Cover Image (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        {selectedCoverFile ? (
                          <div className="space-y-2">
                            <img 
                              src={coverPreviewUrl} 
                              alt="Cover preview" 
                              className="max-h-24 sm:max-h-32 mx-auto rounded-lg"
                            />
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <span className="text-xs sm:text-sm text-muted-foreground text-center">
                                {selectedCoverFile.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCoverFile(null);
                                  setCoverPreviewUrl("");
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                              Click to select cover image
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleCoverFileSelect(file);
                                };
                                input.click();
                              }}
                            >
                              Select Cover Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags and Settings */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          value={createForm.tags}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="tag1, tag2, tag3 (comma separated)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={createForm.status} onValueChange={(value) => setCreateForm(prev => ({ ...prev, status: value as "draft" | "published" }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={createForm.is_featured}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured">Featured project (show on homepage)</Label>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      <Button
                        onClick={handleCreate}
                        disabled={createProjectMutation.isPending}
                        className="w-full"
                      >
                        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <Presentation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== "all" || selectedPresentationType !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first project."
              }
            </p>
            {!searchQuery && selectedCategory === "all" && selectedPresentationType === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Presentation className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant={project.status === 'published' ? "default" : "secondary"} className="text-xs">
                        {project.status}
                      </Badge>
                      {project.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getPresentationIcon(project)}
                      <span className="text-xs font-medium text-primary">
                        {project.presentation_type === 'file' ? 'File Upload' : 'External URL'}
                      </span>
                    </div>
                    
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
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
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
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="flex items-center justify-center gap-1 flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="sm:hidden">Edit</span>
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(project)}
                        className="flex items-center justify-center gap-1 flex-1"
                      >
                        {project.status === 'published' ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            <span className="sm:hidden">Unpublish</span>
                            <span className="hidden sm:inline">Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="sm:hidden">Publish</span>
                            <span className="hidden sm:inline">Publish</span>
                          </>
                        )}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="w-4 h-4" />
                            <span className="sm:hidden ml-1">Delete</span>
                            <span className="hidden sm:inline ml-1">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto" aria-describedby="edit-dialog-description">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <p id="edit-dialog-description" className="text-sm text-muted-foreground">
              Modify the project details including title, description, presentation, and settings.
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Show current project info */}
            {editingProject && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">{editingProject.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Current: {editingProject.presentation_type === 'file' ? 'File Upload' : 'External URL'}
                </p>
              </div>
            )}
            
            {/* Same form as create dialog but for editing */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={createForm.category}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Detailed Content</Label>
              <Textarea
                id="edit-content"
                value={createForm.content}
                onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={createForm.status} onValueChange={(value) => setCreateForm(prev => ({ ...prev, status: value as "draft" | "published" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is_featured"
                checked={createForm.is_featured}
                onChange={(e) => setCreateForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="edit-is_featured">Featured project</Label>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={handleUpdate}
                disabled={updateProjectMutation.isPending}
                className="w-full"
              >
                {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingProject(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
