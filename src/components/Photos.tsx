import { useState, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface PhotosProps {
  showAll?: boolean;
}

const Photos = ({ showAll = false }: PhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <section id="photos" className={`relative py-24 ${isMobile ? 'px-4' : 'px-6'}`}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Photos"
          title={
            <>
              Through the <span className="text-gradient">lens</span>
            </>
          }
          description="Capturing moments and perspectives through the lens. A collection of photographs from travels, adventures, and everyday beauty that inspires me."
          action={
            showAll ? undefined : (
              <button
                onClick={() => navigate('/photos')}
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                All {photos.length} photos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )
          }
        />

        {/* Photo Grid: on the home page the first photo gets a large tile */}
        <div
          className={`grid gap-4 ${
            showAll ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2'
          }`}
        >
          {photos.slice(0, showAll ? photos.length : 3).map((photo, index) => {
            const featured = !showAll && index === 0;
            return (
              <Reveal
                key={photo.id}
                delay={index * 0.06}
                className={featured ? 'sm:col-span-2 lg:row-span-2' : ''}
              >
                <button
                  onClick={() => setSelectedPhoto(photo)}
                  className={`group relative block w-full overflow-hidden rounded-3xl border border-foreground/10 text-left ${
                    featured ? 'aspect-square sm:aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-square'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
                      {photo.category}
                    </span>
                    <h3 className={`font-display font-semibold text-white ${featured ? 'text-2xl' : 'text-lg'}`}>
                      {photo.title}
                    </h3>
                    {featured && (
                      <p className="mt-1 line-clamp-2 max-w-lg text-sm text-white/75">{photo.caption}</p>
                    )}
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Google Photos-style Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Close Button - Top Right */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute ${isMobile ? 'top-4 right-4' : 'top-6 right-6'} z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20`}
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation Arrows - Mobile optimized positioning */}
            {currentPhotoIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className={`absolute ${isMobile ? 'left-2 top-1/2 -translate-y-1/2' : 'left-1/4 top-1/2 -translate-y-1/2'} z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20`}
                onClick={goToPreviousPhoto}
              >
                <ChevronLeft className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </Button>
            )}
            
            {currentPhotoIndex < photos.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                className={`absolute ${isMobile ? 'right-2 top-1/2 -translate-y-1/2' : 'right-1/4 top-1/2 -translate-y-1/2'} z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20`}
                onClick={goToNextPhoto}
              >
                <ChevronRight className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </Button>
            )}

            {/* Main Content - Mobile optimized */}
            <div className={`${isMobile ? 'w-full px-4' : 'max-w-4xl w-full px-6'}`}>
              {/* Photo */}
              <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className={`w-full h-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[65vh]'} object-contain rounded-lg`}
                />
              </div>

              {/* Photo Info - Mobile optimized spacing */}
              <div className="text-center text-white">
                <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>{selectedPhoto.title}</h2>
                <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-6 leading-relaxed max-w-3xl mx-auto text-gray-300`}>
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

            {/* Simple navigation hint - Mobile optimized */}
            <div className={`absolute ${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-6 left-1/2 -translate-x-1/2'} text-white/60 ${isMobile ? 'text-xs' : 'text-sm'} text-center`}>
              {isMobile ? 'Swipe or tap arrows • Tap X to close' : 'Arrow keys to navigate • ESC to close'}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Photos;