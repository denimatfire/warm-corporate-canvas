import Navigation from "@/components/Navigation";
import InstagramPhotos from "@/components/InstagramPhotos";

const PhotosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        <InstagramPhotos />
      </div>
    </div>
  );
};

export default PhotosPage;