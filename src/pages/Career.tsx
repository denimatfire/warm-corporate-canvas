import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Timeline } from "@/components/Hero";
import Footer from "@/components/Footer";
import { initializeSEO } from "@/lib/seo-utils";

const Career = () => {
  useEffect(() => {
    // Initialize SEO for career page
    initializeSEO('career');
  }, []);

  return (
    <div className="theme-aurora relative min-h-screen overflow-x-clip">
      <div className="aurora opacity-50" />
      <Navigation />
      <main className="relative pt-20">
        <Timeline />
      </main>
      <Footer />
    </div>
  );
};

export default Career;
