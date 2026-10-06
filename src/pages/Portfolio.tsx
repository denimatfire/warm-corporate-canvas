import Navigation from "@/components/Navigation";
import Hero, { Timeline } from "@/components/Hero";
import About from "@/components/About";
import Writing from "@/components/Writing";
import Photos from "@/components/Photos";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Portfolio = () => {
  return (
    <div className="theme-aurora min-h-screen overflow-x-clip">
      <Navigation />
      <main>
        <Hero />
        <Timeline />
        <About />
        <Writing limit={3} />
        <Photos />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
