import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Timeline } from "@/components/Hero";
import { initializeSEO } from "@/lib/seo-utils";

const Career = () => {
  useEffect(() => {
    // Initialize SEO for career page
    initializeSEO('career');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <div className="pt-20">
        <Timeline />
      </div>
    </div>
  );
};

export default Career;
