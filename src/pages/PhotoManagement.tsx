import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Upload, X, Settings, RefreshCw } from "lucide-react";
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
import { photosApi, Photo, CreatePhotoData, UpdatePhotoData } from "@/lib/photos-api";

const PhotoManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnpublished, setShowUnpublished] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    caption: "",
    category: "",
    tags: "",
    is_published: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const queryClient = useQueryClient();

  // Fetch photos with filters
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos", { searchQuery, selectedCategory, showUnpublished }],
    queryFn: () => {
      const filters: any = {};
      if (selectedCategory && selectedCategory !== "all") filters.category = selectedCategory;
      if (showUnpublished !== undefined) filters.is_published = showUnpublished ? undefined : true;
      
      if (searchQuery) {
        return photosApi.search(searchQuery, filters);
      }
      return photosApi.getAll(filters);
    }
  });

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["photo-categories"],
    queryFn: photosApi.getCategories
  });

  // Create photo mutation
  const createPhotoMutation = useMutation({
    mutationFn: (data: CreatePhotoData) => photosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo uploaded successfully!");
      setIsUploadDialogOpen(false);
      resetUploadForm();
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  // Update photo mutation
  const updatePhotoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePhotoData }) => 
      photosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo updated successfully!");
      setEditingPhoto(null);
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: photosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    }
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: photosApi.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo publish status updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    }
  });

  const resetUploadForm = () => {
    setUploadForm({
      title: "",
      caption: "",
      category: "",
      tags: "",
      is_published: false
    });
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadForm.title.trim()) {
      toast.error("Please select a file and provide a title");
      return;
    }

    const photoData: CreatePhotoData = {
      title: uploadForm.title.trim(),
      caption: uploadForm.caption.trim() || undefined,
      category: uploadForm.category.trim() || undefined,
      image_file: selectedFile,
      tags: uploadForm.tags.trim() ? uploadForm.tags.split(",").map(tag => tag.trim()) : undefined,
      is_published: uploadForm.is_published
    };

    createPhotoMutation.mutate(photoData);
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setUploadForm({
      title: photo.title,
      caption: photo.caption || "",
      category: photo.category || "",
      tags: photo.tags.join(", "),
      is_published: photo.is_published
    });
  };

  const handleUpdate = () => {
    if (!editingPhoto) return;

    const updateData: UpdatePhotoData = {
      title: uploadForm.title.trim() || undefined,
      caption: uploadForm.caption.trim() || undefined,
      category: uploadForm.category.trim() || undefined,
      tags: uploadForm.tags.trim() ? uploadForm.tags.split(",").map(tag => tag.trim()) : undefined,
      is_published: uploadForm.is_published
    };

    updatePhotoMutation.mutate({ id: editingPhoto.id, data: updateData });
  };

  const handleDelete = (photo: Photo) => {
    deletePhotoMutation.mutate(photo.id);
  };

  const handleTogglePublish = (photo: Photo) => {
    togglePublishMutation.mutate(photo.id);
  };

  const filteredPhotos = photos.filter(photo => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return photo.title.toLowerCase().includes(query) || 
             photo.caption?.toLowerCase().includes(query) ||
             photo.category?.toLowerCase().includes(query) ||
             photo.tags.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Photo Management</h1>
            <p className="text-muted-foreground">
              Upload, organize, and manage your portfolio photos
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showUnpublished ? "default" : "outline"}
                onClick={() => setShowUnpublished(!showUnpublished)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showUnpublished ? "All Photos" : "Published Only"}
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    toast.info("Fixing photos...");
                    const result = await photosApi.fixPhotosWithoutAuthorId();
                    if (result.fixed > 0) {
                      toast.success(`Fixed ${result.fixed} photos!`);
                      queryClient.invalidateQueries({ queryKey: ["photos"] });
                    } else {
                      toast.info("All photos are already properly configured");
                    }
                  } catch (error) {
                    toast.error(`Failed to fix photos: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Fix Photos
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    toast.info("Checking photo status...");
                    // Force refresh to see current state
                    await queryClient.invalidateQueries({ queryKey: ["photos"] });
                    toast.success("Photos list refreshed! Check console for details.");
                  } catch (error) {
                    toast.error(`Failed to refresh: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Check Status
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    // Force refresh the photos list
                    await queryClient.invalidateQueries({ queryKey: ["photos"] });
                    toast.success("Photos list refreshed!");
                  } catch (error) {
                    toast.error(`Failed to refresh: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" aria-describedby="upload-dialog-description">
                  <DialogHeader>
                    <DialogTitle>Upload New Photo</DialogTitle>
                    <p id="upload-dialog-description" className="text-sm text-muted-foreground">
                      Upload a new photo to your portfolio with title, caption, category, and tags.
                    </p>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Photo File</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        {selectedFile ? (
                          <div className="space-y-2">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {selectedFile.name}
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
                            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Click to select or drag and drop
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
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
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter photo title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={uploadForm.category}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Personal, Academic"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        value={uploadForm.caption}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                        placeholder="Describe your photo..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="tag1, tag2, tag3 (comma separated)"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={uploadForm.is_published}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, is_published: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="is_published">Publish immediately</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={createPhotoMutation.isPending}
                      >
                        {createPhotoMutation.isPending ? "Uploading..." : "Upload Photo"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Photo Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No photos found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{photo.title}</CardTitle>
                      <Badge variant={photo.is_published ? "default" : "secondary"}>
                        {photo.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {photo.category && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary">
                            {photo.category}
                          </span>
                        </div>
                      )}
                      
                      {photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {photo.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{photo.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                        <span>{photo.is_published ? "Public" : "Private"}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(photo)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(photo)}
                          className="flex-1"
                        >
                          {photo.is_published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Photo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{photo.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(photo)}
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
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="edit-dialog-description">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <p id="edit-dialog-description" className="text-sm text-muted-foreground">
              Modify the photo details including title, caption, category, tags, and publish status.
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Show current photo */}
            {editingPhoto && (
              <div className="text-center">
                <img
                  src={editingPhoto.image_url}
                  alt={editingPhoto.title}
                  className="max-h-48 mx-auto rounded-lg border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Current photo: {editingPhoto.title}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-caption">Caption</Label>
              <Textarea
                id="edit-caption"
                value={uploadForm.caption}
                onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is_published"
                checked={uploadForm.is_published}
                onChange={(e) => setUploadForm(prev => ({ ...prev, is_published: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="edit-is_published">Published</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingPhoto(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updatePhotoMutation.isPending}
              >
                {updatePhotoMutation.isPending ? "Updating..." : "Update Photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoManagement;
