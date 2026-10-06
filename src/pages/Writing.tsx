import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Writing from "@/components/Writing";
import Footer from "@/components/Footer";
import { initializeSEO } from "@/lib/seo-utils";

const WritingPage = () => {
  useEffect(() => {
    // Initialize SEO for writing page
    initializeSEO('writing');
  }, []);

  return (
    <div className="theme-aurora relative min-h-screen overflow-x-clip">
      <div className="aurora opacity-50" />
      <Navigation />
      <main className="relative pt-20">
        <Writing />
      </main>
      <Footer />
    </div>
  );
};

export default WritingPage;
