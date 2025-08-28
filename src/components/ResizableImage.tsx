import React, { useRef, useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';

const ResizableImage: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [showControls, setShowControls] = useState(false);

  // Extract attributes from the node
  const src = node.attrs.src || '';
  const alt = node.attrs.alt || '';
  const width = node.attrs.width || 400;
  const height = node.attrs.height || 300;
  const title = node.attrs.title || '';

  // Initialize current size from node attributes
  useEffect(() => {
    setCurrentSize({ width, height });
  }, [width, height]);

  // Handle width change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 100;
    const newHeight = Math.round((newWidth / currentSize.width) * currentSize.height);
    
    setCurrentSize({ width: newWidth, height: newHeight });
  };

  // Handle height change
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 100;
    const newWidth = Math.round((newHeight / currentSize.height) * currentSize.width);
    
    setCurrentSize({ width: newWidth, height: newHeight });
  };

  // Apply size changes
  const applySizeChanges = () => {
    console.log('🖼️ Applying new size:', currentSize);
    updateAttributes({ 
      width: currentSize.width, 
      height: currentSize.height 
    });
    setShowControls(false);
  };

  // Reset to original size
  const resetSize = () => {
    if (imageRef.current) {
      const img = new window.Image();
      img.onload = () => {
        const newWidth = Math.min(img.naturalWidth, 600);
        const newHeight = (newWidth / img.naturalWidth) * img.naturalHeight;
        setCurrentSize({ width: newWidth, height: newHeight });
        updateAttributes({ width: newWidth, height: newHeight });
      };
      img.src = src;
    }
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <NodeViewWrapper>
      <div className="relative inline-block group my-4">
        <div
          className="relative inline-block"
          style={{ 
            width: currentSize.width, 
            height: currentSize.height
          }}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            title={title}
            className="w-full h-full object-contain select-none rounded border-2 border-transparent hover:border-blue-300 transition-colors"
            draggable={false}
            style={{ 
              width: currentSize.width, 
              height: currentSize.height 
            }}
            onClick={toggleControls}
          />
          
          {/* Click indicator */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Click to resize
          </div>
          
          {/* Size controls */}
          {showControls && (
            <div className="absolute top-0 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-20 min-w-[200px]">
              <div className="text-sm font-medium mb-2 text-gray-700">Resize Image</div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={currentSize.width}
                    onChange={handleWidthChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="2000"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={currentSize.height}
                    onChange={handleHeightChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="2000"
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Current: {currentSize.width} × {currentSize.height}
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={applySizeChanges}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={resetSize}
                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                  title="Reset to original size"
                >
                  Reset
                </button>
                <button
                  onClick={toggleControls}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImage;
