import Navigation from "@/components/Navigation";
import Photos from "@/components/Photos";
import Footer from "@/components/Footer";

const PhotosPage = () => {
  return (
    <div className="theme-aurora relative min-h-screen overflow-x-clip">
      <div className="aurora opacity-50" />
      <Navigation />
      <main className="relative pt-20">
        <Photos showAll={true} />
      </main>
      <Footer />
    </div>
  );
};

export default PhotosPage;
