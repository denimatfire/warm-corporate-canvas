import { useEffect } from "react";
import Portfolio from "./Portfolio";
import { initializeSEO } from "@/lib/seo-utils";

const Index = () => {
  useEffect(() => {
    // Initialize SEO for homepage
    initializeSEO('home');
  }, []);

  return <Portfolio />;
};

export default Index;
