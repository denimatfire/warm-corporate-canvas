# 🖼️ Resizable Image Extension for Tiptap

> **Last Updated**: August 31, 2025 at 01:01 UTC  
> **Version**: 2.0.0 - Supabase Integration Release

This project now includes a custom ProseMirror NodeView with draggable resize handles for images in the Tiptap editor, replacing the previous cropper-based approach.

## ✨ **Features**

- **Native ProseMirror Integration**: Built directly on ProseMirror's NodeView system
- **Draggable Resize Handles**: 8 resize handles (4 corners + 4 edges) that appear on hover
- **Aspect Ratio Preservation**: Corner handles maintain aspect ratio, edge handles allow single-direction resizing
- **Real-time Updates**: Image dimensions are automatically saved as attributes in the document schema
- **Smooth UX**: Handles only appear on hover/focus, with smooth transitions
- **Size Constraints**: Minimum size limits (100x100px) to prevent unusable images
- **Visual Feedback**: Blue border and handles with size indicator
- **Integrated in Main Editor**: No separate demo pages - functionality is built into the ArticleEditor

## 🏗️ **Architecture**

### 1. **ResizableImage Component** (`src/components/ResizableImage.tsx`)
- React component that renders the image with resize handles
- Handles mouse events for resizing
- Manages aspect ratio calculations
- Updates image dimensions through Tiptap's `updateAttributes`

### 2. **ResizableImage Extension** (`src/components/ResizableImageExtension.ts`)
- Extends Tiptap's built-in Image extension
- Adds `width` and `height` attributes to the document schema
- Implements custom NodeView for React component integration
- Handles HTML parsing and rendering

### 3. **Integration in ArticleEditor**
- Replaces the standard Image extension with ResizableImage
- Maintains all existing image functionality (upload, URL insertion)
- Automatically saves resized dimensions to the article content
- Includes helpful tips and instructions for users

## 📖 **Usage**

### **In the Article Editor**
1. **Add an image** using the image button (🖼️) in the toolbar
2. **Hover over the image** to see resize handles appear
3. **Drag corner handles** to resize while maintaining aspect ratio
4. **Drag edge handles** to resize in one direction
5. **Dimensions are automatically saved** to the document

### **How to Access**
- Navigate to `/admin/articles` to create/edit articles
- Use the image button in the TipTap toolbar
- The resizable functionality works automatically once images are inserted

## 🔧 **Technical Details**

### **Resize Handles**
- **Corner handles** (nw, ne, sw, se): Maintain aspect ratio
- **Edge handles** (n, s, w, e): Allow single-direction resizing
- **Visual feedback**: Blue circular handles with appropriate cursor styles

### **Event Handling**
- Mouse down on handle starts resize operation
- Mouse move updates dimensions in real-time
- Mouse up ends resize and saves to document
- Event listeners are properly cleaned up

### **Dimension Storage**
- Width and height are stored as node attributes
- Values are automatically parsed from HTML attributes
- Rendered HTML includes the dimensions for persistence

## 🚀 **Benefits Over Previous Approach**

1. **Native Integration**: No external cropper library dependencies
2. **Better Performance**: Direct ProseMirror integration without DOM manipulation
3. **Persistent Dimensions**: Image sizes are saved in the document
4. **Real-time Feedback**: Immediate visual updates during resize
5. **Accessibility**: Proper cursor indicators and keyboard support
6. **Maintainability**: Cleaner codebase with fewer external dependencies
7. **User Experience**: Integrated directly into the main editor workflow

## 🌐 **Browser Compatibility**

- Modern browsers with ES6+ support
- Uses `@juggle/resize-observer` for cross-browser compatibility
- Responsive design works on desktop and mobile devices

## 🔮 **Future Enhancements**

- Touch gesture support for mobile devices
- Keyboard shortcuts for precise resizing
- Aspect ratio lock/unlock toggle
- Batch resize operations for multiple images
- Export dimensions to CSS or other formats

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Handles not appearing**: Ensure the image has focus or hover state
2. **Resize not working**: Check browser console for JavaScript errors
3. **Dimensions not saving**: Verify the editor is properly configured with ResizableImage extension

### **Testing**
- Create a new article in the ArticleEditor
- Add an image using the toolbar button
- Hover over the image to see resize handles
- Try resizing in different directions

## 📦 **Dependencies**

- `@tiptap/react`: Core Tiptap React integration
- `@tiptap/extension-image`: Base image extension
- `@juggle/resize-observer`: Cross-browser resize observer polyfill
- React 18+ with modern hooks

## 🤝 **Contributing**

When modifying the resizable image functionality:
1. Update both the React component and the Tiptap extension
2. Test with various image sizes and aspect ratios
3. Ensure the HTML output is valid and accessible
4. Test the functionality directly in the ArticleEditor
5. Update this README with any new features or changes

---

*For more information about the TipTap editor, see [TIPTAP_EDITOR_README.md](TIPTAP_EDITOR_README.md)*
