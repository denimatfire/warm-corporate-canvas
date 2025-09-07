# React PDF Presentation Viewer

A comprehensive PDF presentation viewer built with React, react-pdf (pdf.js), and Supabase that works seamlessly across desktop, iPad, and mobile devices.

## Features

### ✅ **Cross-Platform Compatibility**
- **Desktop**: Full-featured viewer with 600px width
- **iPad**: Responsive design that adapts to tablet screens
- **Mobile**: Touch-optimized interface with dynamic sizing

### ✅ **PDF Rendering**
- Uses `react-pdf` (pdf.js) instead of iframes for better iOS compatibility
- Fetches signed URLs from Supabase for secure file access
- Fallback to public URLs with automatic retry logic
- Optimized rendering with disabled text and annotation layers for performance

### ✅ **Navigation Controls**
- Previous/Next page buttons
- First/Last page shortcuts
- Current page indicator (e.g., "3 / 15")
- Keyboard navigation (arrow keys, Home, End)
- Touch-friendly controls for mobile devices

### ✅ **Responsive Design**
- Dynamic width calculation based on screen size
- Mobile: 400px max width with 0.8x scale
- Tablet: 500px max width with 0.9x scale  
- Desktop: 600px width with 1.0x scale
- Automatic scaling and container adjustments

### ✅ **Supabase Integration**
- Automatic signed URL generation for secure file access
- Public URL fallback with accessibility testing
- 1-hour expiry for signed URLs
- Error handling and retry mechanisms

## Components

### 1. **PDFViewer Component** (`src/components/PDFViewer.tsx`)
The core PDF rendering component with:
- PDF.js integration via react-pdf
- Responsive width and scale calculations
- Navigation controls and keyboard shortcuts
- Error handling and loading states
- Download functionality

### 2. **PDFPresentationPage** (`src/pages/PDFPresentationPage.tsx`)
Full-page presentation viewer with:
- Article-style layout (title, description, viewer)
- Social interaction buttons (like, comment, share)
- Download section
- Related projects navigation
- SEO optimization

### 3. **Updated SlideViewer** (`src/components/SlideViewer.tsx`)
Enhanced to automatically use PDFViewer for PDF files:
- Detects PDF file types
- Routes to PDFViewer component
- Maintains existing functionality for other file types

## Usage

### Basic Usage
```tsx
import PDFViewer from '@/components/PDFViewer';

<PDFViewer 
  project={{
    id: "1",
    title: "My Presentation",
    description: "A great presentation",
    presentation_type: "file",
    presentation_file_path: "path/to/file.pdf",
    presentation_file_type: "application/pdf"
  }}
/>
```

### Full Page Usage
```tsx
// Navigate to /pdf/slug-name
// Automatically renders PDFPresentationPage
```

### Modal Usage
```tsx
<PDFViewer 
  project={project}
  isModal={true}
  onClose={() => setShowModal(false)}
/>
```

## Routing

The PDF viewer is integrated into the existing routing system:

- **PDF Files**: `/pdf/:slug` → `PDFPresentationPage`
- **Other Files**: `/presentation/:slug` → `PresentationViewerPage`
- **Automatic Detection**: Projects component automatically routes PDF files to the PDF viewer

## Responsive Breakpoints

### Mobile (< 640px)
- Container width: `min(window.innerWidth - 32, 400)`
- Scale: `0.8`
- Touch-optimized controls
- Full-width buttons

### Tablet (640px - 1024px)
- Container width: `min(window.innerWidth - 64, 500)`
- Scale: `0.9`
- Balanced layout
- Medium-sized controls

### Desktop (> 1024px)
- Container width: `600px`
- Scale: `1.0`
- Full-featured interface
- All navigation options

## Keyboard Shortcuts

- **← →**: Previous/Next page
- **Home**: First page
- **End**: Last page
- **Escape**: Close modal (if applicable)

## Mobile Touch Support

- **Touch Actions**: `pan-x pan-y` for proper scrolling
- **Webkit Scrolling**: `-webkit-overflow-scrolling: touch`
- **Overscroll Behavior**: `contain` to prevent page bouncing
- **Touch Targets**: Minimum 44px for accessibility

## Error Handling

### URL Fetching
1. Try public URL first
2. Test accessibility with HEAD request
3. Fallback to signed URL if public fails
4. Display error message if both fail

### PDF Loading
1. Show loading spinner during fetch
2. Display error card if PDF fails to load
3. Provide retry and download options
4. Graceful fallback for unsupported files

## Performance Optimizations

- **Disabled Text Layer**: Faster rendering
- **Disabled Annotation Layer**: Reduced memory usage
- **Dynamic Scaling**: Optimal size for each device
- **Lazy Loading**: PDF loads only when needed
- **Worker Optimization**: Uses CDN-hosted PDF.js worker

## Dependencies

```json
{
  "react-pdf": "^7.x.x",
  "pdfjs-dist": "^3.x.x"
}
```

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (including iOS)
- **Edge**: Full support
- **Mobile Browsers**: Optimized for touch

## Security

- **Signed URLs**: 1-hour expiry for security
- **CORS Handling**: Proper cross-origin configuration
- **File Validation**: Type checking before rendering
- **Error Boundaries**: Graceful error handling

## Future Enhancements

- [ ] Zoom controls
- [ ] Full-screen mode
- [ ] Thumbnail navigation
- [ ] Search within PDF
- [ ] Print functionality
- [ ] Annotation support
- [ ] Multi-page preview
- [ ] Custom themes

## Troubleshooting

### Common Issues

1. **PDF not loading**: Check file path and Supabase permissions
2. **Mobile scrolling issues**: Ensure touch-action CSS is applied
3. **iOS compatibility**: Use react-pdf instead of iframes
4. **Performance issues**: Disable text/annotation layers

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('PDF Debug:', { url, error, pageNumber });
```

## Integration Notes

The PDF viewer seamlessly integrates with the existing portfolio system:

- **Projects Page**: Automatically detects PDF files and routes accordingly
- **SEO**: Full meta tag support for PDF presentations
- **Analytics**: View count tracking (when implemented)
- **Social Sharing**: Share PDF presentations with proper metadata

This implementation provides a robust, cross-platform PDF viewing experience that works consistently across all devices while maintaining the existing design system and user experience.
