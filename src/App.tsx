import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WritingPage from "./pages/Writing";
import PhotosPage from "./pages/Photos";
import Article from "./components/Article";
import Article_medium from "./components/Article_medium";
import ArticleManagement from "./pages/ArticleManagement";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/article-medium/:id" element={<Article_medium />} />
          <Route path="/admin/articles" element={
            <ProtectedRoute requiredRole="admin" showLogin={true}>
              <ArticleManagement />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
