import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const InstagramPhotos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const isMobile = useIsMobile();

  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      caption: "Golden hour at the mountain peak. Sometimes you need to climb higher to see clearer. 🏔️✨",
      likes: 1247,
      comments: 23,
      timestamp: "2 hours ago",
    },
    {
      id: 2, 
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
      caption: "Lost in the forest, found myself in nature. Every path leads to a new discovery. 🌲🍃",
      likes: 892,
      comments: 15,
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop", 
      caption: "Chasing sunsets and dreams. The sky painted a masterpiece tonight. 🌅💫",
      likes: 2156,
      comments: 47,
      timestamp: "1 day ago",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=800&fit=crop",
      caption: "Morning coffee with a view. Simple moments, profound beauty. ☕️🌊",
      likes: 763,
      comments: 12,
      timestamp: "2 days ago",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=800&fit=crop",
      caption: "Adventures await beyond the horizon. Every journey begins with a single step. 🥾⛰️",
      likes: 1389,
      comments: 31,
      timestamp: "3 days ago",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop",
      caption: "Reflections in still waters. Finding peace in nature's mirror. 🏔️💧",
      likes: 1024,
      comments: 18,
      timestamp: "4 days ago",
    },
  ];

  return (
    <section id="photos" className={`py-20 ${isMobile ? 'px-4' : 'px-6'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-12' : 'mb-16'} animate-fade-in`}>
          <h2 className={`${isMobile ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-bold text-foreground mb-6`}>
            Photo <span className="bg-gradient-accent bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-muted-foreground mb-8 max-w-3xl mx-auto`}>
            A collection of moments captured through my lens. Stories told through images.
          </p>
        </div>

        {/* Instagram-style Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4 ${isMobile ? 'gap-4' : 'gap-6'}`}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border">
                <img
                  src={photo.src}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'} text-white`}>
                    <div className="flex items-center space-x-1">
                      <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                      <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>{photo.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                      <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>{photo.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for selected photo */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className={`${isMobile ? 'w-full h-full' : 'max-w-4xl w-full'} bg-card rounded-lg overflow-hidden`}>
              <div className={`flex ${isMobile ? 'flex-col h-full' : 'flex-row'}`}>
                {/* Image */}
                <div className={`${isMobile ? 'flex-1' : 'md:w-2/3'}`}>
                  <img
                    src={selectedPhoto.src}
                    alt={`Photo ${selectedPhoto.id}`}
                    className={`w-full ${isMobile ? 'h-[40vh]' : 'h-[300px] md:h-[500px]'} object-cover`}
                  />
                </div>
                
                {/* Content */}
                <div className={`${isMobile ? 'flex-1 p-4' : 'md:w-1/3 p-6'} flex flex-col`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/src/assets/profile-photo.jpg" />
                        <AvatarFallback>DD</AvatarFallback>
                      </Avatar>
                      <span className={`font-semibold text-foreground ${isMobile ? 'text-sm' : ''}`}>dhrubajyoti_das</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPhoto(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Caption */}
                  <div className="flex-1 mb-4">
                    <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                      <span className="font-semibold text-foreground">dhrubajyoti_das</span>{" "}
                      {selectedPhoto.caption}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 uppercase">
                      {selectedPhoto.timestamp}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Heart className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Send className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Bookmark className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                      </Button>
                    </div>
                    <div className={`font-semibold text-foreground ${isMobile ? 'text-sm' : ''}`}>
                      {selectedPhoto.likes.toLocaleString()} likes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramPhotos;