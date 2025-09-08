import { useState, useEffect } from "react";
import { ChevronDown, User, FileText, Camera, Calendar, Settings, UserCircle, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();


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

  // Function to get greeting
  const getTimeBasedGreeting = () => {
    return "Good Day";
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


          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/projects')}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Presentation className="w-4 h-4" />
              Projects
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/writing')}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Writing
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/photos')}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Photos
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Contact
            </Button>
            
            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Explore <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border min-w-48">
                <DropdownMenuItem 
                  onClick={() => navigate('/cv')}
                  className="cursor-pointer hover:bg-secondary"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Interactive CV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/career')}
                  className="cursor-pointer hover:bg-secondary"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Journey
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Page Manager Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer hover:bg-secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Page Manager
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card border-border">
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin/articles')}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Article Management
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin/photos')}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Photo Management
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin/projects')}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      <Presentation className="w-4 h-4 mr-2" />
                      Project Management
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
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
            
            <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/projects'))} className="justify-start">
              <Presentation className="w-4 h-4 mr-2" />
              Projects
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/writing'))} className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Writing
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/photos'))} className="justify-start">
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation(() => scrollToSection('contact'))} className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Contact
            </Button>
            
            {/* Mobile Explore Section */}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">Explore</div>
              <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/cv'))} className="justify-start">
                <UserCircle className="w-4 h-4 mr-2" />
                Interactive CV
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation(() => navigate('/career'))} className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                My Journey
              </Button>
            </div>
            
            {/* Mobile Page Manager Section */}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">Page Manager</div>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation(() => navigate('/admin/articles'))} 
                className="justify-start text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Article Management
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation(() => navigate('/admin/photos'))} 
                className="justify-start text-sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo Management
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation(() => navigate('/admin/projects'))} 
                className="justify-start text-sm"
              >
                <Presentation className="w-4 h-4 mr-2" />
                Project Management
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;