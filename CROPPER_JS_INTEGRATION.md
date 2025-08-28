# Cropper.js Integration Guide

This document outlines the integration of Cropper.js into the warm-corporate-canvas project, providing professional-grade image editing capabilities.

## 🚀 Features

### Core Functionality
- **Interactive Image Cropping**: Resizable crop selection with visual guides
- **Multiple Aspect Ratios**: Predefined ratios (16:9, 4:3, 1:1, 3:4, 9:16) plus free-form
- **Image Manipulation**: Rotate, zoom, and transform images
- **High-Quality Output**: Canvas-based processing with anti-aliasing
- **Responsive Design**: Works seamlessly on all devices

### Advanced Features
- **Touch Support**: Mobile-friendly gestures and controls
- **Real-time Preview**: Live preview of crop results
- **Quality Control**: Configurable output quality and format
- **Cloud Integration**: Direct upload to Supabase storage
- **Progress Tracking**: Visual feedback during processing

## 📦 Installation

The following packages have been installed:

```bash
npm install cropperjs react-cropper
npm install --save-dev @types/cropperjs
```

## 🏗️ Architecture

### Components Structure

```
src/
├── components/
│   ├── ImageCropper.tsx          # Core cropping component
│   ├── EnhancedImageUpload.tsx   # Upload wrapper with cropping
│   └── ui/                       # Shadcn/ui components
├── pages/
│   ├── ArticleEditorDemoPage.tsx # Updated demo page
│   └── ImageUploadDemoPage.tsx   # Dedicated demo page
└── App.tsx                       # Updated routing
```

### Key Components

#### 1. ImageCropper.tsx
The core cropping component that wraps Cropper.js functionality:

```tsx
interface ImageCropperProps {
  imageFile: File | null;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Features:**
- Modal-based interface
- Aspect ratio enforcement
- Rotation controls (90° increments)
- Zoom controls (10% - 300%)
- Reset functionality
- High-quality canvas output

#### 2. EnhancedImageUpload.tsx
A comprehensive upload component that integrates cropping:

```tsx
interface EnhancedImageUploadProps {
  onImageUploaded?: (imageData: { url: string; path: string; name: string }) => void;
  className?: string;
}
```

**Features:**
- Aspect ratio selection
- File validation (type, size)
- Automatic cropping workflow
- Image gallery management
- Supabase integration

## 🎯 Usage Examples

### Basic Integration

```tsx
import EnhancedImageUpload from './components/EnhancedImageUpload';

function MyComponent() {
  const handleImageUploaded = (imageData) => {
    console.log('Image uploaded:', imageData);
  };

  return (
    <EnhancedImageUpload 
      onImageUploaded={handleImageUploaded}
    />
  );
}
```

### Custom Aspect Ratio

```tsx
<ImageCropper
  imageFile={selectedFile}
  onCropComplete={handleCrop}
  aspectRatio={16/9}  // Widescreen format
  isOpen={showCropper}
  onOpenChange={setShowCropper}
/>
```

### Free-form Cropping

```tsx
<ImageCropper
  imageFile={selectedFile}
  onCropComplete={handleCrop}
  aspectRatio={0}     // Free-form (no ratio constraint)
  isOpen={showCropper}
  onOpenChange={setShowCropper}
/>
```

## 🔧 Configuration Options

### Cropper.js Options

```tsx
<Cropper
  ref={setCropper}
  src={imageUrl}
  style={{ height: 400, width: '100%' }}
  aspectRatio={aspectRatio}
  viewMode={1}                    // Restrict crop box to image bounds
  dragMode="move"                 // Allow image movement
  autoCropArea={1}               // Auto-crop area size
  restore={false}                // Don't restore crop data
  guides={true}                  // Show crop guides
  center={true}                  // Show center indicator
  highlight={false}              // Don't highlight crop box
  cropBoxMovable={true}          // Allow crop box movement
  cropBoxResizable={true}        // Allow crop box resizing
  toggleDragModeOnDblclick={false}
  onCropChange={handleCropChange}
  responsive={true}              // Responsive behavior
  checkCrossOrigin={false}       // Disable CORS checking
/>
```

### Aspect Ratio Presets

```tsx
const aspectRatioOptions = [
  { value: 16/9, label: '16:9', description: 'Widescreen' },
  { value: 4/3, label: '4:3', description: 'Standard' },
  { value: 1, label: '1:1', description: 'Square' },
  { value: 3/4, label: '3:4', description: 'Portrait' },
  { value: 9/16, label: '9:16', description: 'Mobile' },
  { value: 0, label: 'Free', description: 'Custom' },
];
```

## 🎨 Styling

### CSS Classes
The component uses Tailwind CSS classes for styling:

```tsx
// Modal styling
<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">

// Cropper container
<div className="relative bg-gray-100 rounded-lg overflow-hidden">

// Controls layout
<div className="space-y-4">
  <div className="flex items-center gap-4">
    <span className="text-sm font-medium">Rotation:</span>
    // ... controls
  </div>
</div>
```

### Custom Styling
You can override styles by modifying the component or adding custom CSS:

```css
/* Custom cropper styles */
.cropper-container {
  border-radius: 8px;
  overflow: hidden;
}

.cropper-crop-box {
  border: 2px solid #3b82f6;
}
```

## 🔄 Workflow

### 1. File Selection
- User selects image file
- File validation (type, size)
- Preview generation

### 2. Cropping Interface
- Modal opens with cropper
- User adjusts crop area
- Optional rotation/zoom
- Real-time preview

### 3. Processing
- Canvas-based cropping
- Quality optimization
- Format conversion (to JPEG)

### 4. Upload
- Blob creation
- Supabase upload
- Progress tracking
- Success feedback

## 🚀 Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Cropper.js loads only when needed
- **Canvas Processing**: Efficient image manipulation
- **Debounced Updates**: Smooth user experience
- **Memory Management**: Proper cleanup of object URLs

### File Size Limits
- **Input**: Up to 10MB
- **Output**: Optimized JPEG with 90% quality
- **Format**: Automatic conversion to JPEG for consistency

## 🧪 Testing

### Demo Pages
1. **ArticleEditorDemoPage**: Overview with link to image demo
2. **ImageUploadDemoPage**: Dedicated testing environment

### Test Scenarios
- [ ] File type validation
- [ ] Size limit enforcement
- [ ] Aspect ratio constraints
- [ ] Rotation functionality
- [ ] Zoom controls
- [ ] Crop accuracy
- [ ] Upload integration
- [ ] Error handling

## 🐛 Troubleshooting

### Common Issues

#### 1. Cropper Not Loading
```bash
# Check if packages are installed
npm list cropperjs react-cropper

# Verify CSS import
import 'cropperjs/dist/cropper.css';
```

#### 2. Image Not Displaying
```tsx
// Ensure proper file handling
const imageUrl = URL.createObjectURL(imageFile);

// Clean up object URLs
useEffect(() => {
  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };
}, [imageUrl]);
```

#### 3. Aspect Ratio Issues
```tsx
// Check aspect ratio value
console.log('Aspect ratio:', aspectRatio);

// Ensure proper type conversion
const ratio = parseFloat(value);
```

### Debug Mode
Enable debug logging:

```tsx
const handleCropChange = (e: any) => {
  console.log('Crop data:', e.detail);
  setCropData(e.detail);
};
```

## 🔮 Future Enhancements

### Planned Features
- **Batch Processing**: Multiple image cropping
- **Advanced Filters**: Brightness, contrast, saturation
- **Watermarking**: Add text/image watermarks
- **Format Options**: PNG, WebP support
- **Preset Templates**: Common crop presets

### Integration Opportunities
- **Article Editor**: Direct integration with TipTap
- **Photo Gallery**: Enhanced photo management
- **User Profiles**: Avatar cropping
- **E-commerce**: Product image optimization

## 📚 Resources

### Documentation
- [Cropper.js Official Docs](https://github.com/fengyuanchen/cropperjs)
- [React-Cropper Package](https://github.com/react-cropper/react-cropper)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Related Components
- `ImageUploadTest.tsx` - Basic upload functionality
- `EnhancedTipTapEditor.tsx` - Rich text editor
- `PhotoViewer.tsx` - Image viewing component

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: Maintain strict typing
2. **Responsive Design**: Mobile-first approach
3. **Accessibility**: ARIA labels and keyboard support
4. **Performance**: Optimize for large images
5. **Testing**: Comprehensive test coverage

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow existing component patterns
- Add JSDoc comments for complex functions

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
