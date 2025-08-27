import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Type,
  List,
  Image,
  Link,
  Crop,
  RotateCcw,
  X
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Image Editor Modal Component
const ImageEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
}> = ({ isOpen, onClose, imageUrl, onSave }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current && imageRef.current) {
          imageRef.current = img;
          drawImage();
        }
      };
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl]);

  const drawImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply transformations
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(position.x, position.y);
    
    // Draw image
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      drawImage();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const editedImageUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onSave(editedImageUrl);
      onClose();
    }
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    drawImage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Image</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Crop className="w-4 h-4" />
              <Label>Scale:</Label>
              <Input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => {
                  setScale(parseFloat(e.target.value));
                  drawImage();
                }}
                className="w-20"
              />
              <span className="text-sm w-12">{scale.toFixed(1)}x</span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <Label>Rotation:</Label>
              <Input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => {
                  setRotation(parseInt(e.target.value));
                  drawImage();
                }}
                className="w-20"
              />
              <span className="text-sm w-12">{rotation}°</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Canvas */}
          <div 
            className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="cursor-move"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </div>

          <div className="text-sm text-gray-600 text-center">
            Drag the image to move it • Use sliders to scale and rotate
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuillDemo: React.FC = () => {
  const [content, setContent] = useState('');
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  // Custom image handler for Quill
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          // Open image editor
          setEditingImageUrl(imageUrl);
          setImageEditorOpen(true);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const handleImageEditSave = (editedImageUrl: string) => {
    // Insert the edited image into Quill
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', editedImageUrl);
        quill.setSelection(range.index + 1);
      }
    }
  };

  // Enhanced Quill configuration with custom image handler
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleImageInsert
      }
    }
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image'
  ];

  const insertSampleContent = () => {
    const sampleContent = `
      <h1>Welcome to Simple Quill Editor</h1>

      <p>This is a <strong>clean</strong> and <em>simple</em> text editor built with Quill.js.</p>

      <h2>Key Features</h2>
      <ul>
        <li>Basic text formatting</li>
        <li>Simple lists</li>
        <li>Image and link support</li>
        <li>Clean, minimal interface</li>
      </ul>

      <h2>Getting Started</h2>
      <p>Use the toolbar above to format your text. The editor supports:</p>
      <ul>
        <li>Headers (H1, H2, H3)</li>
        <li>Bold, italic, and underline</li>
        <li>Ordered and unordered lists</li>
        <li>Links and images</li>
      </ul>
    `;

    setContent(sampleContent);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            Simple Quill Editor Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A clean, minimal text editor with essential features for writing content.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
          >
            <Type className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Text Formatting</h3>
            <p className="text-blue-700 text-sm">Bold, italic, underline, and headers for clear content structure.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
          >
            <List className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Lists</h3>
            <p className="text-green-700 text-sm">Create organized ordered and unordered lists with ease.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
          >
            <Image className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-purple-900 mb-2">Image Editing</h3>
            <p className="text-purple-700 text-sm">Crop, resize, rotate, and move images with the built-in editor.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
          >
            <Link className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Links</h3>
            <p className="text-orange-700 text-sm">Insert and manage links to external resources.</p>
          </motion.div>
        </div>

        {/* Editor Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Try the Editor</h2>
            <button
              onClick={insertSampleContent}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Insert Sample Content
            </button>
          </div>

          {/* Quill Editor */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Start writing your content here... Use the toolbar above to format your text!"
              style={{ minHeight: '400px' }}
            />
          </div>

          <div className="text-sm text-muted-foreground text-center">
            💡 Tip: Click the image button in the toolbar to insert and edit images with cropping and moving capabilities
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Keyboard Shortcuts</h4>
              <ul className="space-y-1">
                <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+B</kbd> Bold</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+I</kbd> Italic</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+K</kbd> Insert Link</li>
                <li><kbd className="bg-white px-2 py-1 rounded border">Ctrl+Z</kbd> Undo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Image Features</h4>
              <ul className="space-y-1">
                <li>• Drag to move images</li>
                <li>• Scale from 0.1x to 3x</li>
                <li>• Rotate from -180° to 180°</li>
                <li>• Reset to original settings</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Editor Modal */}
      <ImageEditorModal
        isOpen={imageEditorOpen}
        onClose={() => setImageEditorOpen(false)}
        imageUrl={editingImageUrl}
        onSave={handleImageEditSave}
      />
    </>
  );
};

export default QuillDemo;
