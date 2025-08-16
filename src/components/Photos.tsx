import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // For demo purposes, we'll use placeholder images
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      alt: "Mountain landscape at sunrise",
      title: "Morning Light",
      category: "Landscape"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop",
      alt: "Urban architecture photography",
      title: "City Lines",
      category: "Architecture"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      alt: "Forest path in autumn",
      title: "Autumn Walk",
      category: "Nature"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=600&fit=crop",
      alt: "Ocean waves at beach",
      title: "Ocean Waves",
      category: "Seascape"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=400&fit=crop",
      alt: "Night city skyline",
      title: "City Lights",
      category: "Urban"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=600&h=600&fit=crop",
      alt: "Desert dunes at sunset",
      title: "Desert Dreams",
      category: "Landscape"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
      alt: "Misty lake reflection",
      title: "Reflection",
      category: "Nature"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
      alt: "Street photography scene",
      title: "Street Life",
      category: "Street"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop",
      alt: "Wildflower field",
      title: "Wild Beauty",
      category: "Nature"
    }
  ];

  return (
    <section id="photos" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6 cursor-pointer hover:text-primary transition-colors"
            onClick={() => window.location.href = '/photos'}
          >
            Photo <span className="bg-gradient-accent bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing moments and perspectives through the lens. A collection of photographs 
            from travels, adventures, and everyday beauty that inspires me.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-1">{photo.title}</h3>
                  <p className="text-sm text-primary">{photo.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <img
                src={selectedPhoto}
                alt="Full size photo"
                className="w-full h-full object-contain rounded-lg shadow-soft"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-foreground hover:text-primary bg-background/80 hover:bg-background"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Photos;