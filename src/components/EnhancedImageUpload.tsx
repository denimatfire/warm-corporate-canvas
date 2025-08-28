import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, Crop, Image as ImageIcon, X, Download } from 'lucide-react';
import { uploadImage, deleteImage } from '../lib/image-upload';
import { useToast } from '../hooks/use-toast';
import ImageCropper from './ImageCropper';

interface AspectRatioOption {
  value: number;
  label: string;
  description: string;
}

const aspectRatioOptions: AspectRatioOption[] = [
  { value: 16/9, label: '16:9', description: 'Widescreen' },
  { value: 4/3, label: '4:3', description: 'Standard' },
  { value: 1, label: '1:1', description: 'Square' },
  { value: 3/4, label: '3:4', description: 'Portrait' },
  { value: 9/16, label: '9:16', description: 'Mobile' },
  { value: 0, label: 'Free', description: 'Custom' },
];

interface EnhancedImageUploadProps {
  onImageUploaded?: (imageData: { url: string; path: string; name: string }) => void;
  className?: string;
}

export default function EnhancedImageUpload({ onImageUploaded, className }: EnhancedImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; path: string; name: string }>>([]);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number>(16/9);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const handleCropComplete = useCallback(async (croppedBlob: Blob) => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      // Create a new file from the cropped blob
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      const result = await uploadImage(croppedFile, {
        folder: 'cropped-images'
      });

      const newImage = {
        url: result.url,
        path: result.path,
        name: selectedFile.name
      };

      setUploadedImages(prev => [...prev, newImage]);
      onImageUploaded?.(newImage);

      toast({
        title: "Image uploaded successfully!",
        description: `Cropped and uploaded: ${(croppedBlob.size / 1024 / 1024).toFixed(2)}MB`,
      });

      // Cleanup
      setSelectedFile(null);
      setPreviewUrl('');
      setShowCropper(false);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onImageUploaded, toast]);

  const handleDeleteImage = async (path: string) => {
    try {
      await deleteImage(path);
      setUploadedImages(prev => prev.filter(img => img.path !== path));
      toast({
        title: "Image deleted",
        description: "Image has been removed from storage",
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleCancelCrop = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setShowCropper(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enhanced Image Upload
          </CardTitle>
          <CardDescription>
            Upload images with advanced cropping, rotation, and editing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aspect Ratio Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <Select value={selectedAspectRatio.toString()} onValueChange={(value) => setSelectedAspectRatio(parseFloat(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatioOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {option.description}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Click to select an image or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="enhanced-upload"
              />
              
              <label htmlFor="enhanced-upload">
                <Button
                  variant="outline"
                  disabled={isUploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Processing...' : 'Choose Image'}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Upload Status */}
          {isUploading && (
            <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-700">Processing and uploading image...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Cropper Modal */}
      <ImageCropper
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        onCancel={handleCancelCrop}
        aspectRatio={selectedAspectRatio === 0 ? undefined : selectedAspectRatio}
        isOpen={showCropper}
        onOpenChange={setShowCropper}
      />

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Uploaded Images ({uploadedImages.length})
            </CardTitle>
            <CardDescription>
              Your cropped and processed images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(image.path)}
                      className="absolute top-2 right-2 w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-gray-500 truncate">{image.path}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(image.url, '_blank')}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4" />
                <span>Interactive cropping with guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Rotation and zoom controls</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Multiple aspect ratio presets</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>High-quality output</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
