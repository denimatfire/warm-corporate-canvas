import Navigation from "@/components/Navigation";
import Writing from "@/components/Writing";

const WritingPage = () => {
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