import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Home, 
  Menu, 
  X,
  User,
  Mail,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PresentationNavigationProps {
  projectTitle?: string;
  onBack?: () => void;
}

const PresentationNavigation = ({ projectTitle, onBack }: PresentationNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/projects');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and project title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            
            {projectTitle && (
              <div className="hidden md:block">
                <Badge variant="secondary" className="text-xs">
                  {projectTitle}
                </Badge>
              </div>
            )}
          </div>

          {/* Center - Empty space for balance */}
          <div className="flex items-center">
            {/* Empty space for visual balance */}
          </div>

          {/* Right side - Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-gray-600 hover:text-gray-900"
              >
                Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/writing')}
                className="text-gray-600 hover:text-gray-900"
              >
                Writing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/photos')}
                className="text-gray-600 hover:text-gray-900"
              >
                Photos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/#contact')}
                className="text-gray-600 hover:text-gray-900"
              >
                Contact
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/projects');
                  setIsMenuOpen(false);
                }}
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/writing');
                  setIsMenuOpen(false);
                }}
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Writing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/photos');
                  setIsMenuOpen(false);
                }}
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Photos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/#contact');
                  setIsMenuOpen(false);
                }}
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Contact
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default PresentationNavigation;
