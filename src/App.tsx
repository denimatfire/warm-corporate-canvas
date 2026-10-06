import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Loaded on demand so the editors and admin tools don't slow down the home page
const WritingPage = lazy(() => import("./pages/Writing"));
const PhotosPage = lazy(() => import("./pages/Photos"));
const Article_medium = lazy(() => import("./components/Article_medium"));
const ArticleManagement = lazy(() => import("./pages/ArticleManagement"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const TipTapDemo = lazy(() => import("./pages/TipTapDemo"));
const SimpleTipTapDemo = lazy(() => import("./pages/SimpleTipTapDemo"));

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
            <Route path="/article/:id" element={<Article_medium />} />
            <Route path="/tiptap-demo" element={<TipTapDemo />} />
            <Route path="/simple-tiptap" element={<SimpleTipTapDemo />} />
            <Route path="/admin/articles" element={
              <ProtectedRoute requiredRole="writer" showLogin={true}>
                <ArticleManagement />
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
