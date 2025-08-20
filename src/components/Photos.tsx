import { useState, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PhotosProps {
  showAll?: boolean;
}

const Photos = ({ showAll = false }: PhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const navigate = useNavigate();

  // Enhanced photos data with simplified properties
  const photos = [
    {
      id: 1,
      src: "/Henkle.JPG",
      alt: "Henkle photo",
      title: "Henkle Hackathon Finalist Presentation",
      category: "Personal",
      caption: "Presenting our project on Use of AIML in Supplychain in Control Towerat the Henkle Hackathon Finalist Presentation"
    },
    {
      id: 2,
      src: "/MBAconvocation.JPG",
      alt: "MBA Convocation Ceremony",
      title: "MBA Convocation",
      category: "Academic",
      caption: "Celebrating the completion of my MBA journey! A milestone achievement that represents years of hard work and dedication ✨"
    },
    {
      id: 3,
      src: "/MtechConvocation.JPG",
      alt: "M.Tech Convocation Ceremony",
      title: "M.Tech Convocation",
      category: "Academic",
      caption: "Another milestone achieved! M.Tech convocation - representing the culmination of advanced studies and research in technology 🔬"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=600&fit=crop",
      alt: "Ocean waves at beach",
      title: "Ocean Waves",
      category: "Seascape",
      caption: "Morning coffee with a view. Simple moments, profound beauty. ☕️🌊"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=400&fit=crop",
      alt: "Night city skyline",
      title: "City Lights",
      category: "Urban",
      caption: "The city never sleeps, and neither do the dreams it inspires. 🌃✨"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=600&h=600&fit=crop",
      alt: "Desert dunes at sunset",
      title: "Desert Dreams",
      category: "Landscape",
      caption: "Adventures await beyond the horizon. Every journey begins with a single step. 🥾⛰️"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
      alt: "Misty lake reflection",
      title: "Reflection",
      category: "Nature",
      caption: "Reflections in still waters. Finding peace in nature's mirror. 🏔️💧"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
      alt: "Street photography scene",
      title: "Street Life",
      category: "Street",
      caption: "Capturing the pulse of the city, one moment at a time. 🚶‍♂️📸"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop",
      alt: "Wildflower field",
      title: "Wild Beauty",
      category: "Nature",
      caption: "Nature's palette at its finest. Wildflowers dancing in the breeze. 🌸💨"
    }
  ];

  const currentPhotoIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : -1;

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentPhotoIndex + 1]);
    }
  };

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setSelectedPhoto(photos[currentPhotoIndex - 1]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedPhoto) {
      if (e.key === 'ArrowRight') {
        goToNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousPhoto();
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    }
  };

  // Fix keyboard event listener with useEffect
  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto, currentPhotoIndex]);

  return (
    <section id="photos" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/photos')}
          >
            Photo <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing moments and perspectives through the lens. A collection of photographs 
            from travels, adventures, and everyday beauty that inspires me.
          </p>
        </div>

        {/* Photo Counter */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-sm text-muted-foreground">
            {photos.slice(0, showAll ? photos.length : 3).length} photos
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {photos.slice(0, showAll ? photos.length : 3).map((photo, index) => (
            <div
              key={photo.id}
              className="group cursor-pointer animate-slide-up bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Lightroom-style Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                    <p className="text-xs text-gray-200 opacity-90">{photo.category}</p>
                  </div>
                </div>
                
                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Photo Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {photo.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
                  {photo.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Photos-style Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Close Button - Top Right */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-6 right-6 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation Arrows - Closer to center */}
            {currentPhotoIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1/4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                onClick={goToPreviousPhoto}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}
            
            {currentPhotoIndex < photos.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1/4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20"
                onClick={goToNextPhoto}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}

            {/* Main Content - Centered */}
            <div className="max-w-4xl w-full px-6">
              {/* Photo */}
              <div className="mb-8">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="w-full h-auto max-h-[65vh] object-contain rounded-lg"
                />
              </div>

              {/* Photo Info - Below Photo with more spacing */}
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">{selectedPhoto.title}</h2>
                <p className="text-lg mb-6 leading-relaxed max-w-3xl mx-auto text-gray-300">
                  {selectedPhoto.caption}
                </p>
                
                {/* Category only */}
                <div className="flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm">
                    {selectedPhoto.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Simple navigation hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Arrow keys to navigate • ESC to close
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Photos;