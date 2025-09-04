import Navigation from "@/components/Navigation";
import Hero, { Timeline } from "@/components/Hero";
import About from "@/components/About";
import Writing from "@/components/Writing";
import Photos from "@/components/Photos";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navigation />
      <Hero />
      <Timeline />
      <About />
      <Writing />
      <Photos />
      <Projects />
      <Contact />
    </div>
  );
};

export default Portfolio;