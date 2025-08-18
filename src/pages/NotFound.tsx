import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SnakeGame from "@/components/SnakeGame";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* 404 Header */}
        <div className="space-y-4">
          <h1 className="text-8xl lg:text-9xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Oops! Page not found
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The page you're looking for doesn't exist. But hey, while you're here, 
            why not play a quick game of Snake?
          </p>
        </div>

        {/* Snake Game */}
        <SnakeGame />

        {/* Navigation */}
        <div className="space-y-4">
          <Button 
            asChild
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary-hover transition-all hover-glow"
          >
            <a href="/">
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
