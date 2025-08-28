import React, { useRef, useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { ResizeObserver } from '@juggle/resize-observer';

interface ResizableImageProps extends NodeViewProps {
  node: {
    attrs: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
      title?: string;
      dataPath?: string;
    };
  };
}

const ResizableImage: React.FC<ResizableImageProps> = ({ node, updateAttributes }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);

  const { src, alt, width, height, title } = node.attrs;

  // Calculate aspect ratio when image loads
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      
      const handleLoad = () => {
        try {
          const ratio = img.naturalWidth / img.naturalHeight;
          setAspectRatio(ratio);
          
          // Set initial dimensions if not already set
          if (!width || !height) {
            const maxWidth = 600;
            const newWidth = Math.min(img.naturalWidth, maxWidth);
            const newHeight = newWidth / ratio;
            updateAttributes({ width: newWidth, height: newHeight });
          }
        } catch (error) {
          console.warn('Error handling image load:', error);
        }
      };
      
      img.onload = handleLoad;
      
      // Cleanup
      return () => {
        img.onload = null;
      };
    }
  }, [src, width, height, updateAttributes]);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: width || 0, height: height || 0 });
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle resize movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;

    try {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      switch (resizeDirection) {
        case 'nw':
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case 'ne':
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case 'sw':
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height + deltaY;
          break;
        case 'se':
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height + deltaY;
          break;
        case 'n':
          newHeight = startSize.height - deltaY;
          newWidth = newHeight * aspectRatio;
          break;
        case 's':
          newHeight = startSize.height + deltaY;
          newWidth = newHeight * aspectRatio;
          break;
        case 'w':
          newWidth = startSize.width - deltaX;
          newHeight = newWidth / aspectRatio;
          break;
        case 'e':
          newWidth = startSize.width + deltaX;
          newHeight = newWidth / aspectRatio;
          break;
      }

      // Apply minimum size constraints
      newWidth = Math.max(100, newWidth);
      newHeight = Math.max(100, newHeight);

      // Maintain aspect ratio for corner resizing
      if (['nw', 'ne', 'sw', 'se'].includes(resizeDirection)) {
        newHeight = newWidth / aspectRatio;
      }

      // Ensure dimensions are valid numbers
      if (isFinite(newWidth) && isFinite(newHeight)) {
        updateAttributes({ width: Math.round(newWidth), height: Math.round(newHeight) });
      }
    } catch (error) {
      console.warn('Error during resize:', error);
      handleResizeEnd();
    }
  };

  // Handle resize end
  const handleResizeEnd = () => {
    try {
      setIsResizing(false);
      setResizeDirection('');
      
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    } catch (error) {
      console.warn('Error ending resize:', error);
    }
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  const currentWidth = width || 400;
  const currentHeight = height || 300;

  return (
    <NodeViewWrapper>
      <div
        ref={containerRef}
        className="relative inline-block group"
        style={{ width: currentWidth, height: currentHeight }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          title={title || ''}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        
        {/* Resize handles - only show on hover/focus */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 group-focus-within:border-blue-400 transition-colors">
          {/* Corner handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize -top-1.5 -left-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize -bottom-1.5 -left-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-se-resize -bottom-1.5 -right-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-n-resize -top-1.5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-s-resize -bottom-1.5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-w-resize -left-1.5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-e-resize -right-1.5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </div>
        
        {/* Size indicator */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          {currentWidth} × {currentHeight}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImage;
