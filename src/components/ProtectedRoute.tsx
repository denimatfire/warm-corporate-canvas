import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  User, 
  Settings,
  FileText,
  Eye
} from 'lucide-react';
import { 
  isAuthenticated, 
  canAccessArticleManagement, 
  getCurrentUser, 
  logout 
} from '../data/auth';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'writer' | 'viewer';
  showLogin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'writer',
  showLogin = true 
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      const currentUser = getCurrentUser();
      
      console.log('🔍 Auth check:', { authenticated, currentUser });
      
      // Check if user has the required role
      console.log('🔍 Role check details:', {
        currentUser: !!currentUser,
        userRole: currentUser?.role,
        requiredRole,
        adminCheck: requiredRole === 'admin' ? currentUser?.role === 'admin' : 'N/A',
        writerCheck: requiredRole === 'writer' ? ['admin', 'writer'].includes(currentUser?.role || '') : 'N/A',
        viewerCheck: requiredRole === 'viewer' ? ['admin', 'writer', 'viewer'].includes(currentUser?.role || '') : 'N/A'
      });
      
      const hasRequiredRole = currentUser && (
        requiredRole === 'admin' ? currentUser.role === 'admin' :
        requiredRole === 'writer' ? ['admin', 'writer'].includes(currentUser.role) :
        requiredRole === 'viewer' ? ['admin', 'writer', 'viewer'].includes(currentUser.role) :
        true
      );
      
      console.log('🔍 Role check result:', { hasRequiredRole });
      
      const hasAccess = authenticated && hasRequiredRole;
      
      console.log('🔍 Final access check:', { 
        authenticated,
        hasRequiredRole, 
        hasAccess, 
        requiredRole, 
        userRole: currentUser?.role
      });
      
      setIsAuth(authenticated);
      setCanAccess(hasAccess);
      setCurrentUser(currentUser);
      
      if (!authenticated && showLogin) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setIsAuth(false);
      setCanAccess(false);
      setCurrentUser(null);
      if (showLogin) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
    }
  };

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  // If user is authenticated and has access, show the protected content
  if (isAuth && canAccess) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with user info and logout */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold text-foreground">
                    Article Management
                  </span>
                </div>
                
                {currentUser && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {currentUser.username}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // If user is not authenticated and login is required, redirect to login page
  if (!isAuth && showLogin) {
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    return null;
  }

  // If no access and no login, show access denied
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-10 h-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access Article Management. 
            Please contact an administrator for access.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Try Login
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProtectedRoute;
