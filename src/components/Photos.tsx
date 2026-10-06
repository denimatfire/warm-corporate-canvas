import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ZoomIn, ChevronLeft, ChevronRight, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPublishedPhotos, Photo } from "@/lib/photos-api";
import { supabase } from "@/lib/articles-api";

interface PhotosProps {
  showAll?: boolean;
}

const Photos = ({ showAll = false }: PhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // Fetch published photos from database
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["published-photos"],
    queryFn: getPublishedPhotos
  });

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

  // Display photos (limit to 3 if not showAll)
  const displayPhotos = showAll ? photos : photos.slice(0, 3);
  // On the home page, three photos get a large lead tile plus two small ones
  const featuredLayout = !showAll && displayPhotos.length === 3;

  const pillButton =
    "group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary";

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
            <div className="flex flex-wrap gap-2">
              {isAuthenticated && (
                <button onClick={() => navigate('/admin/photos')} className={pillButton}>
                  <Settings className="h-4 w-4" />
                  Manage
                </button>
              )}
              {!showAll && photos.length > 0 && (
                <button onClick={() => navigate('/photos')} className={pillButton}>
                  All {photos.length} photos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass aspect-square animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : displayPhotos.length === 0 ? (
          <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
            <p className="text-lg text-foreground">No photos available yet</p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/admin/photos')}
                className="mt-4 rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-[hsl(240_24%_6%)]"
              >
                Upload your first photo
              </button>
            )}
          </div>
        ) : (
          /* Photo Grid: on the home page the first photo gets a large tile */
          <div
            className={`grid gap-4 ${
              featuredLayout ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {displayPhotos.map((photo, index) => {
              const featured = featuredLayout && index === 0;
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
                      src={photo.image_url}
                      alt={photo.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      {photo.category && (
                        <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
                          {photo.category}
                        </span>
                      )}
                      <h3 className={`font-display font-semibold text-white ${featured ? 'text-2xl' : 'text-lg'}`}>
                        {photo.title}
                      </h3>
                      {featured && photo.caption && (
                        <p className="mt-1 line-clamp-2 max-w-lg text-sm text-white/75">{photo.caption}</p>
                      )}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}

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
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  className={`w-full h-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[65vh]'} object-contain rounded-lg`}
                />
              </div>

              {/* Photo Info - Mobile optimized spacing */}
              <div className="text-center text-white">
                <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>{selectedPhoto.title}</h2>
                {selectedPhoto.caption && (
                  <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-6 leading-relaxed max-w-3xl mx-auto text-gray-300`}>
                    {selectedPhoto.caption}
                  </p>
                )}
                
                {/* Category and Tags */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {selectedPhoto.category && (
                    <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm">
                      {selectedPhoto.category}
                    </span>
                  )}
                  {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap justify-center">
                      {selectedPhoto.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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