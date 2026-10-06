import Navigation from "@/components/Navigation";
import Writing from "@/components/Writing";
import Footer from "@/components/Footer";

const WritingPage = () => {
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
