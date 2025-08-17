import { useState } from "react";
import { X, ZoomIn, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const navigate = useNavigate();

  // Enhanced photos data with Instagram-like properties
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      alt: "Mountain landscape at sunrise",
      title: "Morning Light",
      category: "Landscape",
      caption: "Golden hour at the mountain peak. Sometimes you need to climb higher to see clearer. 🏔️✨",
      likes: 1247,
      comments: 23,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop",
      alt: "Urban architecture photography",
      title: "City Lines",
      category: "Architecture",
      caption: "Urban geometry and modern architecture. The city has its own rhythm and flow. 🏙️📐",
      likes: 892,
      comments: 15,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      alt: "Forest path in autumn",
      title: "Autumn Walk",
      category: "Nature",
      caption: "Lost in the forest, found myself in nature. Every path leads to a new discovery. 🌲🍃",
      likes: 2156,
      comments: 47,
      timestamp: "1 day ago"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=600&fit=crop",
      alt: "Ocean waves at beach",
      title: "Ocean Waves",
      category: "Seascape",
      caption: "Morning coffee with a view. Simple moments, profound beauty. ☕️🌊",
      likes: 763,
      comments: 12,
      timestamp: "2 days ago"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=400&fit=crop",
      alt: "Night city skyline",
      title: "City Lights",
      category: "Urban",
      caption: "The city never sleeps, and neither do the dreams it inspires. 🌃✨",
      likes: 1389,
      comments: 31,
      timestamp: "3 days ago"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=600&h=600&fit=crop",
      alt: "Desert dunes at sunset",
      title: "Desert Dreams",
      category: "Landscape",
      caption: "Adventures await beyond the horizon. Every journey begins with a single step. 🥾⛰️",
      likes: 1024,
      comments: 18,
      timestamp: "4 days ago"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
      alt: "Misty lake reflection",
      title: "Reflection",
      category: "Nature",
      caption: "Reflections in still waters. Finding peace in nature's mirror. 🏔️💧",
      likes: 1567,
      comments: 28,
      timestamp: "5 days ago"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
      alt: "Street photography scene",
      title: "Street Life",
      category: "Street",
      caption: "Capturing the pulse of the city, one moment at a time. 🚶‍♂️📸",
      likes: 743,
      comments: 19,
      timestamp: "6 days ago"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop",
      alt: "Wildflower field",
      title: "Wild Beauty",
      category: "Nature",
      caption: "Nature's palette at its finest. Wildflowers dancing in the breeze. 🌸💨",
      likes: 1892,
      comments: 34,
      timestamp: "1 week ago"
    }
  ];

  return (
    <section id="photos" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/photos')}
          >
            Photo <span className="bg-gradient-accent bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing moments and perspectives through the lens. A collection of photographs 
            from travels, adventures, and everyday beauty that inspires me.
          </p>
        </div>

        {/* Instagram-style Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
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
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Instagram-style Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-6 h-6" />
                      <span className="font-semibold">{photo.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">{photo.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram-style Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-card rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-2/3">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="w-full h-[300px] md:h-[500px] object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="md:w-1/3 p-6 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/src/assets/profile-photo.jpg" />
                        <AvatarFallback>DD</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground">dhrubajyoti_das</span>
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
                    <p className="text-muted-foreground">
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
                          <Heart className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <MessageCircle className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Send className="w-6 h-6" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Bookmark className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
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

export default Photos;