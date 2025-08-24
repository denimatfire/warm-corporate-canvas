import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  BookOpen, 
  User, 
  LogOut, 
  ChevronDown,
  Shield,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  isAuthenticated, 
  getCurrentUser, 
  logout, 
  canAccessArticleManagement 
} from '../data/auth';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ArticleWriterMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const currentUser = getCurrentUser();
  const isAuth = isAuthenticated();
  const canAccess = canAccessArticleManagement();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // Redirect to home or login page
    window.location.href = '/';
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-500 text-white',
      writer: 'bg-blue-500 text-white',
      viewer: 'bg-gray-500 text-white'
    };
    
    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-500'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const menuItems = [
    {
      label: 'Home',
      href: '/',
      icon: BookOpen
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: BookOpen
    },
    ...(canAccess ? [{
      label: 'Article Writer',
      href: '/admin/articles',
      icon: FileText,
      highlight: true
    }] : [{
      label: 'Article Writer',
      href: '/login',
      icon: FileText,
      highlight: true
    }])
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Portfolio</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${item.highlight ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {item.highlight && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      New
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuth ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser?.username}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-card rounded-lg border shadow-lg z-50"
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {currentUser?.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {currentUser?.email}
                            </p>
                            {currentUser && getRoleBadge(currentUser.role)}
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {canAccess ? (
                          <Link
                            to="/admin/articles"
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FileText className="w-4 h-4" />
                            Article Management
                          </Link>
                        ) : (
                          <Link
                            to="/login"
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FileText className="w-4 h-4" />
                            Article Management
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-destructive hover:text-destructive"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              <span className="sr-only">Open menu</span>
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span className={`block w-4 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block w-4 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-4 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      } ${item.highlight ? 'ring-2 ring-primary/20' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {item.highlight && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          New
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ArticleWriterMenu;
