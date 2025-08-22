import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoViewerProps {
  photos: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoViewer = ({ photos, initialIndex = 0, isOpen, onClose }: PhotoViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
          break;
        case 'ArrowRight':
          setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, photos.length]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white hover:text-black transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Photo Display */}
      <div className="relative max-w-full max-h-full p-4">
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1} of ${photos.length}`}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
          }}
        />
      </div>

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
};

export default PhotoViewer;
