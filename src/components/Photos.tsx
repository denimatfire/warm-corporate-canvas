import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ZoomIn, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <section id="photos" className={`py-20 ${isMobile ? 'px-4' : 'px-6'} bg-gradient-section`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-12' : 'mb-16'} animate-fade-in`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 
              className={`${isMobile ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-bold text-foreground cursor-pointer hover:text-primary transition-colors`}
              onClick={() => navigate('/photos')}
            >
              Photo <span className="text-primary">Gallery</span>
            </h2>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/photos')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage
              </Button>
            )}
          </div>
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            Capturing moments and perspectives through the lens. A collection of photographs 
            from travels, adventures, and everyday beauty that inspires me.
          </p>
        </div>

        {/* Photo Counter */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-sm text-muted-foreground">
            {displayPhotos.length} photos
            {!showAll && photos.length > 3 && (
              <span className="ml-2 text-primary">
                • <button 
                  onClick={() => navigate('/photos')}
                  className="underline hover:no-underline"
                >
                  View all {photos.length}
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading photos...</p>
          </div>
        ) : displayPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No photos available yet</p>
            {isAuthenticated && (
              <Button
                onClick={() => navigate('/admin/photos')}
                className="mt-4"
              >
                Upload Your First Photo
              </Button>
            )}
          </div>
        ) : (
          /* Photo Grid */
          <div className={`grid ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4 ${isMobile ? 'gap-4' : 'gap-6'} animate-slide-up`}>
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group cursor-pointer animate-slide-up bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Lightroom-style Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>{photo.title}</h3>
                      {photo.category && (
                        <p className="text-xs text-gray-200 opacity-90">{photo.category}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Photo Info */}
                <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
                  {photo.category && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {photo.category}
                      </span>
                    </div>
                  )}
                  <h3 className={`font-semibold text-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-1 line-clamp-1`}>
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {photo.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{photo.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
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