import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Writing from "@/components/Writing";
import { initializeSEO } from "@/lib/seo-utils";

const WritingPage = () => {
  useEffect(() => {
    // Initialize SEO for writing page
    initializeSEO('writing');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        <Writing />
      </div>
    </div>
  );
};

export default WritingPage;