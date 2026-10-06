import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Loaded on demand so the editors and admin tools don't slow down the home page
const WritingPage = lazy(() => import("./pages/Writing"));
const PhotosPage = lazy(() => import("./pages/Photos"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const PresentationViewerPage = lazy(() => import("./pages/PresentationViewerPage"));
const PDFPresentationPage = lazy(() => import("./pages/PDFPresentationPage"));
const InteractiveCV = lazy(() => import("./pages/InteractiveCV"));
const Career = lazy(() => import("./pages/Career"));
const Article_medium = lazy(() => import("./components/Article_medium"));
const ArticleManagement = lazy(() => import("./pages/ArticleManagement"));
const PhotoManagement = lazy(() => import("./pages/PhotoManagement"));
const ProjectManagement = lazy(() => import("./pages/ProjectManagement"));
const ContactViewer = lazy(() => import("./pages/ContactViewer"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/presentation/:slug" element={<PresentationViewerPage />} />
            <Route path="/pdf/:slug" element={<PDFPresentationPage />} />
            <Route path="/cv" element={<InteractiveCV />} />
            <Route path="/career" element={<Career />} />
            <Route path="/article/:slug" element={<Article_medium />} />

            <Route path="/admin/articles" element={
              <ProtectedRoute requiredRole="writer" showLogin={true}>
                <ArticleManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/photos" element={
              <ProtectedRoute requiredRole="writer" showLogin={true}>
                <PhotoManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute requiredRole="writer" showLogin={true}>
                <ProjectManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/contacts" element={
              <ProtectedRoute requiredRole="writer" showLogin={true}>
                <ContactViewer />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
