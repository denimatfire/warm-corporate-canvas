import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Photos from "@/components/Photos";
import { initializeSEO } from "@/lib/seo-utils";

const PhotosPage = () => {
  useEffect(() => {
    // Initialize SEO for photos page
    initializeSEO('photos');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        <Photos showAll={true} />
      </div>
    </div>
  );
};

export default PhotosPage;