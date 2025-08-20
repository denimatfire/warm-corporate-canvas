import Navigation from "@/components/Navigation";
import Photos from "@/components/Photos";

const PhotosPage = () => {
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