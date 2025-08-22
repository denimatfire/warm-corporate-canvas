import { useState, useEffect } from "react";
import { ChevronDown, User, FileText, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Update date every day
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 24 * 60 * 60 * 1000); // Update every 24 hours

    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on scroll with animation
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (isOpen && !isAnimating) {
        closeMenuGracefully();
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add touch move event listener for mobile devices
    const handleTouchMove = () => {
      if (isOpen && !isAnimating) {
        closeMenuGracefully();
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, isAnimating, isMobile]);

  // Graceful menu close function
  const closeMenuGracefully = () => {
    setIsAnimating(true);
    // Add a small delay to allow the animation to complete
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 200); // Match the CSS transition duration
  };

  // Toggle menu with animation
  const toggleMenu = () => {
    if (isOpen) {
      closeMenuGracefully();
    } else {
      setIsOpen(true);
      setIsAnimating(false);
    }
  };

  // Close mobile menu when navigating
  const handleNavigation = (action: () => void) => {
    if (isMobile) {
      closeMenuGracefully();
    }
    action();
  };

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  // Format date as Day, Month Date, Year
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Greeting */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground font-pacifico tracking-wide">
              {getTimeBasedGreeting()}
            </span>
          </div>

          {/* Date Display - Left side */}
          <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium font-serif">
              {formatDate(currentDate)}
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('hero')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              About Me
            </Button>
            
            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Explore <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                <DropdownMenuItem 
                  onClick={() => navigate('/writing')}
                  className="cursor-pointer hover:bg-secondary"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Writing
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/photos')}
                  className="cursor-pointer hover:bg-secondary"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Photos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleMenu}
              className="text-foreground"
            >
              ☰
            </Button>
          </div>
        </div>

        {/* Mobile Menu with smooth animations */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen 
              ? 'max-h-96 opacity-100 mt-4 pb-4 border-t border-border' 
              : 'max-h-0 opacity-0 mt-0 pb-0 border-t-0'
          }`}
        >
          <div className={`flex flex-col space-y-2 pt-4 transform transition-all duration-200 ease-in-out ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
            {/* Mobile Date */}
            <div className="flex items-center space-x-2 text-muted-foreground mb-3 px-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-serif">{formatDate(currentDate)}</span>
            </div>
            
            <Button variant="ghost" onClick={() => handleNavigation(() => scrollToSection('hero'))} className="justify-start">
              Home
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => scrollToSection('about'))} className="justify-start">
              About Me
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/writing'))} className="justify-start">
              Writing
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/photos'))} className="justify-start">
              Photos
            </Button>
            <Button variant="outline" onClick={() => handleNavigation(() => scrollToSection('contact'))} className="justify-start mt-2">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;