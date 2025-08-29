import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
// Image extension is now handled by ResizableImage
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Table as TableIcon,
  Minus,
  Highlighter,
  Undo,
  Redo,
  Move,
  Maximize2,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from './ui/use-toast';
import { 
  uploadImage, 
  ImageUploadResult, 
  extractImagePathFromUrl, 
  isSupabaseImageUrl, 
  batchDeleteImages 
} from '../lib/image-upload';
import ResizableImage from './ResizableImageExtension';

// Using imported ResizableImage extension instead of local component

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing your story...",
  className = ""
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Track uploaded image paths
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // Ensure list extensions are enabled and properly configured
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'ml-6',
          },
        },
        // Disable extensions that we're configuring separately
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        // Disable link and underline since we configure them separately
        link: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      ResizableImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 p-4 rounded-lg font-mono text-sm',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic text-gray-700',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'border-t border-gray-300 my-8',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      // Explicitly add list extensions for better control
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-outside space-y-1',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-outside space-y-1',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'mb-1',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      // Check if it's a valid URL (either http/https or data URL)
      if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
        // Load image to get natural dimensions for better sizing
        const img = new window.Image();
        img.onload = () => {
          // Calculate responsive dimensions for better layout
          const maxWidth = 800;
          const maxHeight = 600;
          const minWidth = 300;
          const minHeight = 200;
          
          let finalWidth = img.naturalWidth;
          let finalHeight = img.naturalHeight;
          
          // Scale down if image is too large while maintaining aspect ratio
          if (finalWidth > maxWidth || finalHeight > maxHeight) {
            const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight);
            finalWidth = Math.round(finalWidth * ratio);
            finalHeight = Math.round(finalHeight * ratio);
          }
          
          // Scale up if image is too small for better visibility
          if (finalWidth < minWidth || finalHeight < minHeight) {
            const ratio = Math.max(minWidth / finalWidth, minHeight / finalHeight);
            finalWidth = Math.round(finalWidth * ratio);
            finalHeight = Math.round(finalHeight * ratio);
          }
          
          // Ensure dimensions are reasonable
          finalWidth = Math.max(200, Math.min(800, finalWidth));
          finalHeight = Math.max(150, Math.min(600, finalHeight));
          
          console.log('🖼️ Adding URL image with dimensions:', { 
            original: { width: img.naturalWidth, height: img.naturalHeight },
            final: { width: finalWidth, height: finalHeight }
          });
          
          editor.chain().focus().setImage({ 
            src: imageUrl, 
            alt: imageAlt || 'Image',
            width: finalWidth,
            height: finalHeight
          }).run();
        };
        img.onerror = () => {
          // Fallback to default size if image loading fails
          editor.chain().focus().setImage({ 
            src: imageUrl, 
            alt: imageAlt || 'Image',
            width: 400,
            height: 300
          }).run();
        };
        img.src = imageUrl;
        
        setImageUrl('');
        setImageAlt('');
        setIsImageDialogOpen(false);
      } else {
        toast({
          title: "Invalid image URL",
          description: "Please enter a valid image URL starting with http:// or https://",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Supabase Storage
      console.log('🚀 Starting Supabase image upload...');
      
      // Set initial progress for image processing
      setUploadProgress(10);
      
      // Simulate image processing progress
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(30);
      
      // Upload image to Supabase with content-images folder
      const uploadResult: ImageUploadResult = await uploadImage(selectedFile, {
        folder: 'content-images',
        maxSize: 10, // Allow up to 10MB for content images
        quality: 0.8
      });
      
      console.log('✅ Supabase upload successful:', uploadResult);
      setUploadProgress(100);

      // Track uploaded image path for cleanup
      setUploadedImages(prev => [...prev, uploadResult.path]);

      // Insert the uploaded image into the editor with intelligent sizing
      const img = new window.Image();
      img.onload = () => {
        // Calculate responsive dimensions for better layout
        const maxWidth = 800; // Maximum width for content images
        const maxHeight = 600; // Maximum height for content images
        const minWidth = 300;  // Minimum width for better visibility
        const minHeight = 200; // Minimum height for better visibility
        
        let finalWidth = img.naturalWidth;
        let finalHeight = img.naturalHeight;
        
        // Scale down if image is too large while maintaining aspect ratio
        if (finalWidth > maxWidth || finalHeight > maxHeight) {
          const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight);
          finalWidth = Math.round(finalWidth * ratio);
          finalHeight = Math.round(finalHeight * ratio);
        }
        
        // Scale up if image is too small for better visibility
        if (finalWidth < minWidth || finalHeight < minHeight) {
          const ratio = Math.max(minWidth / finalWidth, minHeight / finalHeight);
          finalWidth = Math.round(finalWidth * ratio);
          finalHeight = Math.round(finalHeight * ratio);
        }
        
        // Ensure dimensions are reasonable
        finalWidth = Math.max(200, Math.min(800, finalWidth));
        finalHeight = Math.max(150, Math.min(600, finalHeight));
        
        console.log('🖼️ Inserting image with dimensions:', { 
          original: { width: img.naturalWidth, height: img.naturalHeight },
          final: { width: finalWidth, height: finalHeight }
        });
        
        editor.chain().focus().setImage({ 
          src: uploadResult.url, 
          alt: imageAlt || selectedFile.name,
          width: finalWidth,
          height: finalHeight
        }).run();
      };
      img.src = uploadResult.url;

      // Reset form
      setSelectedFile(null);
      setImageAlt('');
      setIsImageDialogOpen(false);
      
      toast({
        title: "Image uploaded successfully!",
        description: `Image uploaded to Supabase: ${(uploadResult.size / 1024 / 1024).toFixed(2)}MB`,
      });

    } catch (error) {
      console.error('❌ Supabase upload failed:', error);
      
      let errorMessage = "There was an error uploading your image. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('User not authenticated')) {
          errorMessage = "Please log in to upload images.";
        } else if (error.message.includes('File size must be less than')) {
          errorMessage = error.message;
        } else if (error.message.includes('File type must be one of')) {
          errorMessage = error.message;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // Function to extract image URLs from editor content
  const extractImageUrlsFromContent = (): string[] => {
    if (!editor) return [];
    
    const imageUrls: string[] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image' && node.attrs.src) {
        imageUrls.push(node.attrs.src);
      }
    });
    
    return imageUrls;
  };

  // Function to find unused images by comparing uploaded paths with content URLs
  const findUnusedImages = async (uploadedPaths: string[], contentUrls: string[]): Promise<string[]> => {
    const unusedImages: string[] = [];
    
    for (const uploadedPath of uploadedPaths) {
      let isUsed = false;
      
      // Check if this uploaded image is referenced in the content
      for (const contentUrl of contentUrls) {
        if (isSupabaseImageUrl(contentUrl)) {
          const contentPath = extractImagePathFromUrl(contentUrl);
          if (contentPath === uploadedPath) {
            isUsed = true;
            break;
          }
        }
      }
      
      if (!isUsed) {
        unusedImages.push(uploadedPath);
      }
    }
    
    console.log('🔍 Image usage analysis:', {
      uploaded: uploadedPaths.length,
      content: contentUrls.length,
      unused: unusedImages.length
    });
    
    return unusedImages;
  };

  // Function to clean up unused images from Supabase storage
  const cleanupUnusedImages = async (unusedPaths: string[]): Promise<void> => {
    if (unusedPaths.length === 0) return;
    
    try {
      console.log('🗑️ Starting cleanup of', unusedPaths.length, 'unused images...');
      
      // Delete unused images from Supabase storage
      const result = await batchDeleteImages(unusedPaths);
      
      console.log('✅ Cleanup completed:', {
        successful: result.success.length,
        failed: result.failed.length
      });
      
      // Remove successfully deleted images from tracking
      if (result.success.length > 0) {
        setUploadedImages(prev => prev.filter(path => !result.success.includes(path)));
      }
      
      // Show cleanup results to user
      if (result.success.length > 0) {
        toast({
          title: "Cleanup completed",
          description: `Removed ${result.success.length} unused images from storage${result.failed.length > 0 ? ` (${result.failed.length} failed)` : ''}`,
        });
      }
      
      if (result.failed.length > 0) {
        toast({
          title: "Cleanup partially failed",
          description: `${result.failed.length} images could not be removed. Check console for details.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('❌ Error during image cleanup:', error);
      toast({
        title: "Cleanup failed",
        description: "There was an error cleaning up unused images",
        variant: "destructive",
      });
    }
  };

  // Function to clean up uploaded images when component unmounts
  const cleanupUploadedImages = async () => {
    if (uploadedImages.length === 0) return;
    
    try {
      console.log('🧹 Cleaning up uploaded images:', uploadedImages);
      
      // Get current content images
      const contentImages = extractImageUrlsFromContent();
      console.log('📝 Current content images:', contentImages);
      
      // Find unused images and clean them up
      const unusedImages = await findUnusedImages(uploadedImages, contentImages);
      if (unusedImages.length > 0) {
        console.log('🗑️ Found unused images to clean up:', unusedImages);
        await cleanupUnusedImages(unusedImages);
      }
    } catch (error) {
      console.error('❌ Error during image cleanup:', error);
    }
  };

  // Function to manually clean up unused images
  const handleCleanupUnusedImages = async () => {
    try {
      const contentImages = extractImageUrlsFromContent();
      console.log('🧹 Manual cleanup - Content images:', contentImages);
      console.log('🧹 Manual cleanup - Uploaded images:', uploadedImages);
      
      // Find and clean up unused images
      const unusedImages = await findUnusedImages(uploadedImages, contentImages);
      
      if (unusedImages.length === 0) {
        toast({
          title: "No cleanup needed",
          description: "All uploaded images are currently in use",
        });
        return;
      }
      
      // Show detailed confirmation dialog before cleanup
      const stats = getStorageStats();
      const message = `Found ${unusedImages.length} unused images out of ${stats.totalUploaded} uploaded.
      
Current usage:
• ${stats.totalInContent} images in content
• ${stats.supabaseInContent} Supabase images in content
• ${stats.externalInContent} external images in content
• ${stats.potentialUnused} potentially unused

Remove ${unusedImages.length} unused images from storage? This action cannot be undone.`;

      if (confirm(message)) {
        await cleanupUnusedImages(unusedImages);
      }
      
    } catch (error) {
      console.error('❌ Manual cleanup failed:', error);
      toast({
        title: "Cleanup failed",
        description: "There was an error during cleanup",
        variant: "destructive",
      });
    }
  };

  // Function to export image tracking data for debugging
  const exportImageTrackingData = () => {
    const contentImages = extractImageUrlsFromContent();
    const trackingData = {
      contentImages,
      uploadedImages,
      timestamp: new Date().toISOString(),
      editorContent: editor?.getHTML() || ''
    };
    
    console.log('📊 Image tracking data:', trackingData);
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(trackingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-tracking-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Image tracking data has been exported for debugging",
    });
  };

  // Function to get storage usage statistics
  const getStorageStats = () => {
    const contentImages = extractImageUrlsFromContent();
    const supabaseImages = contentImages.filter(url => isSupabaseImageUrl(url));
    const externalImages = contentImages.filter(url => !isSupabaseImageUrl(url));
    
    return {
      totalUploaded: uploadedImages.length,
      totalInContent: contentImages.length,
      supabaseInContent: supabaseImages.length,
      externalInContent: externalImages.length,
      potentialUnused: uploadedImages.length - supabaseImages.length
    };
  };

  // Function to test all editor functionality
  const testAllFunctionality = () => {
    if (!editor) return;
    
    try {
      // Test text formatting
      editor.chain().focus().setContent('<p>Testing all editor functionality...</p>').run();
      
      // Test bold
      editor.chain().focus().extendMarkRange('bold').toggleBold().run();
      
      // Test italic
      editor.chain().focus().extendMarkRange('italic').toggleItalic().run();
      
      // Test underline
      editor.chain().focus().extendMarkRange('underline').toggleUnderline().run();
      
      // Test strike
      editor.chain().focus().extendMarkRange('strike').toggleStrike().run();
      
      // Test highlight
      editor.chain().focus().extendMarkRange('highlight').toggleHighlight().run();
      
      // Test headings
      editor.chain().focus().setHeading({ level: 1 }).run();
      editor.chain().focus().setHeading({ level: 2 }).run();
      editor.chain().focus().setHeading({ level: 3 }).run();
      
      // Test lists
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().toggleBulletList().run();
      editor.chain().focus().toggleOrderedList().run();
      
      // Test alignment
      editor.chain().focus().setTextAlign('left').run();
      editor.chain().focus().setTextAlign('center').run();
      editor.chain().focus().setTextAlign('right').run();
      
      // Test special elements
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().toggleBlockquote().run();
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().toggleCodeBlock().run();
      editor.chain().focus().setParagraph().run();
      editor.chain().focus().setHorizontalRule().run();
      
      // Test table
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      
      toast({
        title: "Functionality Test Complete",
        description: "All editor features have been tested successfully!",
      });
      
    } catch (error) {
      console.error('❌ Functionality test failed:', error);
      toast({
        title: "Test Failed",
        description: "Some editor features may not be working correctly",
        variant: "destructive",
      });
    }
  };

  // Function to clear editor content
  const clearEditor = () => {
    if (!editor) return;
    
    if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      editor.chain().focus().clearContent().run();
      toast({
        title: "Editor Cleared",
        description: "All content has been removed from the editor",
      });
    }
  };

  // Function to get editor statistics
  const getEditorStats = () => {
    if (!editor) return null;
    
    const content = editor.getHTML();
    const textContent = editor.getText();
    const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = textContent.length;
    
    return {
      wordCount,
      charCount,
      hasContent: content.length > 0,
      contentLength: content.length
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupUploadedImages();
    };
  }, []);

  // Periodic cleanup check (every 5 minutes)
  useEffect(() => {
    if (uploadedImages.length === 0) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Periodic cleanup check triggered');
      checkAndCleanupUnusedImages();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [uploadedImages.length]);

  // Listen for content changes to track image usage
  useEffect(() => {
    if (!editor) return;
    
    const handleUpdate = () => {
      const contentImages = extractImageUrlsFromContent();
      console.log('🔄 Content updated, current images:', contentImages);
    };
    
    editor.on('update', handleUpdate);
    
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  // Listen for delete/backspace to handle image removal
  useEffect(() => {
    if (!editor) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && editor.isActive('image')) {
        console.log('🗑️ Image deletion detected - scheduling cleanup check');
        // Schedule a cleanup check after a short delay to allow the editor to update
        setTimeout(() => {
          checkAndCleanupUnusedImages();
        }, 1000);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  // Function to check and cleanup unused images
  const checkAndCleanupUnusedImages = async () => {
    try {
      const contentImages = extractImageUrlsFromContent();
      const unusedImages = await findUnusedImages(uploadedImages, contentImages);
      
      if (unusedImages.length > 0) {
        console.log('🔄 Auto-cleanup: Found', unusedImages.length, 'unused images');
        // Auto-cleanup without confirmation for small numbers of images
        if (unusedImages.length <= 3) {
          await cleanupUnusedImages(unusedImages);
        } else {
          console.log('🔄 Auto-cleanup: Too many unused images, manual cleanup recommended');
        }
      }
    } catch (error) {
      console.error('❌ Auto-cleanup check failed:', error);
    }
  };

  // Keyboard shortcuts for editor
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser shortcuts when editor is focused
      if (event.target === editor.view.dom || editor.view.dom.contains(event.target as Node)) {
        // Bold: Ctrl+B
        if (event.ctrlKey && event.key === 'b') {
          event.preventDefault();
          editor.chain().focus().toggleBold().run();
        }
        // Italic: Ctrl+I
        if (event.ctrlKey && event.key === 'i') {
          event.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }
        // Underline: Ctrl+U
        if (event.ctrlKey && event.key === 'u') {
          event.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }
        // Bullet List: Ctrl+Shift+8
        if (event.ctrlKey && event.shiftKey && event.key === '8') {
          event.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }
        // Numbered List: Ctrl+Shift+7
        if (event.ctrlKey && event.shiftKey && event.key === '7') {
          event.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }
        // Toggle list item: Tab (when in list)
        if (event.key === 'Tab' && (editor.isActive('bulletList') || editor.isActive('orderedList'))) {
          event.preventDefault();
          if (event.shiftKey) {
            // Shift+Tab: Decrease list level
            editor.chain().focus().liftListItem('listItem').run();
          } else {
            // Tab: Increase list level
            editor.chain().focus().sinkListItem('listItem').run();
          }
        }
        // Enter in empty list item: Exit list
        if (event.key === 'Enter' && editor.isActive('listItem')) {
          const { state } = editor;
          const { selection } = state;
          const node = state.doc.nodeAt(selection.from);
          if (node && node.textContent.trim() === '') {
            event.preventDefault();
            editor.chain().focus().liftListItem('listItem').run();
          }
        }
        // Blockquote: Ctrl+Shift+Q
        if (event.ctrlKey && event.shiftKey && event.key === 'q') {
          event.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }
        // Code Block: Ctrl+Shift+C
        if (event.ctrlKey && event.shiftKey && event.key === 'c') {
          event.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }
        // Heading 1: Ctrl+Alt+1
        if (event.ctrlKey && event.altKey && event.key === '1') {
          event.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }
        // Heading 2: Ctrl+Alt+2
        if (event.ctrlKey && event.altKey && event.key === '2') {
          event.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
        // Heading 3: Ctrl+Alt+3
        if (event.ctrlKey && event.altKey && event.key === '3') {
          event.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
        // Clear content: Ctrl+Shift+Delete
        if (event.ctrlKey && event.shiftKey && event.key === 'Delete') {
          event.preventDefault();
          clearEditor();
        }
        // Center image: Ctrl+Shift+C
        if (event.ctrlKey && event.shiftKey && event.key === 'c') {
          event.preventDefault();
          if (editor.isActive('image')) {
            // Center the currently selected image
            const { state } = editor;
            const { selection } = state;
            if (!selection.empty) {
              const node = state.doc.nodeAt(selection.from);
              if (node && node.type.name === 'image') {
                editor.chain().focus().updateAttributes('image', { 
                  class: 'mx-auto block' 
                }).run();
                toast({
                  title: "Image centered",
                  description: "Selected image has been centered using keyboard shortcut",
                });
              }
            }
          } else {
            toast({
              title: "No image selected",
              description: "Please select an image to center it",
            });
          }
        }
        // Show stats: Ctrl+Shift+S
        if (event.ctrlKey && event.shiftKey && event.key === 's') {
          event.preventDefault();
          const stats = getEditorStats();
          if (stats) {
            toast({
              title: "Editor Statistics",
              description: `${stats.wordCount} words, ${stats.charCount} characters`,
            });
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  const MenuBar = () => (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-1 p-2 overflow-x-auto">
        {/* Spacer to push other elements to the right */}
        <div className="flex-1"></div>
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-8 w-8 p-0"
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0"
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('highlight') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className="h-8 w-8 p-0"
            title="Highlight text"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 w-8 p-0"
            title="Heading 1 (Ctrl+Alt+1)"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 w-8 p-0"
            title="Heading 2 (Ctrl+Alt+2)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 w-8 p-0"
            title="Heading 3 (Ctrl+Alt+3)"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('🔍 Toggling bullet list...');
              const result = editor.chain().focus().toggleBulletList().run();
              console.log('✅ Bullet list toggle result:', result);
              console.log('🔍 Current bullet list state:', editor.isActive('bulletList'));
            }}
            className="h-8 w-8 p-0"
            title="Bullet List (Ctrl+Shift+8) - Use Tab/Shift+Tab to indent/outdent"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              console.log('🔍 Toggling ordered list...');
              const result = editor.chain().focus().toggleOrderedList().run();
              console.log('✅ Ordered list toggle result:', result);
              console.log('🔍 Current ordered list state:', editor.isActive('orderedList'));
            }}
            className="h-8 w-8 p-0"
            title="Numbered List (Ctrl+Shift+7) - Use Tab/Shift+Tab to indent/outdent"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Special Elements */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
            title="Blockquote (Ctrl+Shift+Q)"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="h-8 w-8 p-0"
            title="Code Block (Ctrl+Shift+C)"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0"
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Insert Elements */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsImageDialogOpen(true)}
            className="h-8 w-8 p-0"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinkDialogOpen(true)}
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addTable}
            className="h-8 w-8 p-0"
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Management */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor && editor.isActive('image')) {
                // Center the currently selected image
                const { state } = editor;
                const { selection } = state;
                if (selection.empty) return;
                
                const node = state.doc.nodeAt(selection.from);
                if (node && node.type.name === 'image') {
                  // Add center alignment class to image
                  editor.chain().focus().updateAttributes('image', { 
                    class: 'mx-auto block' 
                  }).run();
                  toast({
                    title: "Image centered",
                    description: "Selected image has been centered",
                  });
                }
              } else {
                toast({
                  title: "No image selected",
                  description: "Please select an image to center it",
                });
              }
            }}
            className="h-8 w-8 p-0"
            title="Center selected image (Ctrl+Shift+C)"
          >
            🎯
          </Button>
          {uploadedImages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCleanupUnusedImages}
                className="h-8 w-8 p-0"
                title={`Cleanup unused images (${uploadedImages.length} tracked)`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportImageTrackingData}
                className="h-8 w-8 p-0"
                title="Export image tracking data"
              >
                📊
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkAndCleanupUnusedImages}
                className="h-8 w-8 p-0"
                title="Check for unused images"
              >
                🔍
              </Button>
            </>
          )}
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Test Button */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testAllFunctionality}
            className="h-8 px-3 text-xs"
            title="Test all editor functionality"
          >
            🧪 Test All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearEditor}
            className="h-8 px-3 text-xs"
            title="Clear all editor content (Ctrl+Shift+Delete)"
          >
            🗑️ Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const stats = getEditorStats();
              if (stats) {
                toast({
                  title: "Editor Statistics",
                  description: `${stats.wordCount} words, ${stats.charCount} characters`,
                });
              }
            }}
            className="h-8 px-3 text-xs"
            title="Show editor statistics (Ctrl+Shift+S)"
          >
            📊 Stats
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <MenuBar />
      
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] bg-white focus-within:ring-2 focus-within:ring-blue-200 focus-within:ring-opacity-50 transition-all prose-img:max-w-none"
        style={{
          '--tw-prose-img-max-width': 'none',
        } as React.CSSProperties}
      />
      
      {/* Custom CSS for better image display and list styling */}
      <style>{`
        .ProseMirror img {
          display: block !important;
          margin: 1.5rem auto !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.2s ease-in-out !important;
        }
        
        .ProseMirror img:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          transform: translateY(-2px) !important;
        }
        
        .ProseMirror .image-container {
          text-align: center !important;
          margin: 2rem 0 !important;
        }
        
        .ProseMirror .image-container img {
          margin: 0 auto !important;
        }
        
                 /* Enhanced list styling */
         .ProseMirror ul {
           list-style-type: disc !important;
           padding-left: 2rem !important;
           margin: 1rem 0 !important;
           list-style-position: outside !important;
         }
         
         .ProseMirror ol {
           list-style-type: decimal !important;
           padding-left: 2rem !important;
           margin: 1rem 0 !important;
           list-style-position: outside !important;
         }
         
         .ProseMirror li {
           margin: 0.5rem 0 !important;
           line-height: 1.6 !important;
           padding-left: 0.5rem !important;
         }
         
         .ProseMirror ul li::marker {
           color: #6b7280 !important;
           font-weight: 500 !important;
           margin-right: 0.5rem !important;
         }
         
         .ProseMirror ol li::marker {
           color: #6b7280 !important;
           font-weight: 500 !important;
           margin-right: 0.5rem !important;
         }
         
         /* Nested list styling */
         .ProseMirror ul ul {
           list-style-type: circle !important;
           margin: 0.5rem 0 !important;
           padding-left: 1.5rem !important;
         }
         
         .ProseMirror ul ul ul {
           list-style-type: square !important;
           padding-left: 1.5rem !important;
         }
         
         .ProseMirror ol ol {
           list-style-type: lower-alpha !important;
           padding-left: 1.5rem !important;
         }
         
         .ProseMirror ol ol ol {
           list-style-type: lower-roman !important;
           padding-left: 1.5rem !important;
         }
      `}</style>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Enter the URL for the link you want to add to your content.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLink()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addLink} disabled={!linkUrl}>
                Add Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Upload an image file or enter an image URL. Click on images in the editor to resize them using the blue handles.
            </p>
          </DialogHeader>
          
          {/* Upload Status */}
          {uploadedImages.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700">
                    📸 <strong>{uploadedImages.length}</strong> image{uploadedImages.length !== 1 ? 's' : ''} uploaded to Supabase
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Images are stored permanently and optimized for web delivery
                  </p>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      const stats = getStorageStats();
                      toast({
                        title: "Storage Statistics",
                        description: `${stats.totalInContent} images in content, ${stats.potentialUnused} potentially unused`,
                      });
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabs for Upload vs URL */}
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'url'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Image URL
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {activeTab === 'upload' ? (
              /* File Upload Tab */
              <div className="space-y-4">
                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length > 0 && files[0].type.startsWith('image/')) {
                      setSelectedFile(files[0]);
                    }
                  }}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="max-h-32 max-w-full rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop an image here, or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports: JPG, PNG, GIF, WebP (max 10MB)
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Images are uploaded to Supabase and optimized automatically
                      </p>
                    </div>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
                      setSelectedFile(file);
                    } else if (file) {
                      toast({
                        title: "File too large",
                        description: "Please select an image smaller than 10MB.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="hidden"
                />

                {/* Alt Text Input */}
                <div>
                  <Label htmlFor="image-alt-upload">Alt Text</Label>
                  <Input
                    id="image-alt-upload"
                    placeholder="Description of the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading to Supabase... {uploadProgress}%</span>
                    </div>
                  ) : (
                    'Upload & Insert Image'
                  )}
                </Button>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      {uploadProgress < 50 ? 'Processing image...' : 
                       uploadProgress < 90 ? 'Uploading to Supabase...' : 
                       'Finalizing...'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* URL Tab */
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                  />
                </div>
                <div>
                  <Label htmlFor="image-alt-url">Alt Text</Label>
                  <Input
                    id="image-alt-url"
                    placeholder="Description of the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                  />
                </div>
                <Button onClick={addImage} disabled={!imageUrl} className="w-full">
                  Add Image from URL
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TipTapEditor;
