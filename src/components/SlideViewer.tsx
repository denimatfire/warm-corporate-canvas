import { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Download, 
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { Project } from "@/lib/projects-api";
import { supabase } from "@/lib/articles-api";
import PDFViewer from "@/components/PDFViewer";

interface SlideViewerProps {
  project: Project;
  isFullscreen?: boolean;
}

interface SlideData {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
}

const SlideViewer = ({ project, isFullscreen = false }: SlideViewerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewerLoading, setIsViewerLoading] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const [useSandbox, setUseSandbox] = useState(true);
  const [viewerAttempt, setViewerAttempt] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  // Initialize slides based on presentation type
  useEffect(() => {
    const initializeSlides = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (project.presentation_type === 'external_url' && project.presentation_url) {
          // For external URLs, we'll use iframe embedding
          setSlides([]);
          setIsLoading(false);
        } else if (project.presentation_type === 'file' && project.presentation_file_path) {
          // For file uploads, we need to handle different file types
          const fileType = project.presentation_file_type || '';
          
          if (fileType === 'application/pdf') {
            // For PDFs, we'll use PDF.js or iframe embedding
            await handlePdfFile();
          } else if (fileType.includes('image')) {
            // For image files, treat as single slide
            try {
              const accessibleUrl = await getAccessibleUrl(project.presentation_file_path);
              
              if (!accessibleUrl) {
                setError('Image file is not accessible. Please check if the file exists and is properly uploaded.');
                return;
              }
              
              setSlides([{
                id: 0,
                imageUrl: accessibleUrl,
                thumbnailUrl: accessibleUrl
              }]);
            } catch (error) {
              console.error('Error handling image file:', error);
              setError('Failed to load image file');
            }
          } else {
            // For other file types (PPT, etc.), try to use online viewers
            await handleOtherFileTypes();
          }
        } else {
          setError('No presentation content available');
        }
      } catch (err) {
        console.error('Error initializing slides:', err);
        setError('Failed to load presentation');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSlides();
  }, [project]);

  // Set up loading timeout for iframe
  useEffect(() => {
    if (isViewerLoading) {
      const timeout = setTimeout(() => {
        setIsViewerLoading(false);
        setError('Loading timeout. The presentation may be taking too long to load or is inaccessible.');
      }, 15000); // 15 second timeout
      
      setLoadTimeout(timeout);
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [isViewerLoading]);

  const handlePdfFile = async () => {
    // For PDFs, we'll use direct URL access since we have PDFViewer component
    // The PDFViewer component will handle the actual PDF rendering
    try {
      const accessibleUrl = await getAccessibleUrl(project.presentation_file_path!);
      
      if (!accessibleUrl) {
        setError('PDF file is not accessible. Please check if the file exists and is properly uploaded.');
        return;
      }
      
      // For PDFs, we'll let the PDFViewer component handle the rendering
      // This is just a placeholder - the actual PDF viewing happens in PDFViewer
      setSlides([{
        id: 0,
        imageUrl: accessibleUrl,
        thumbnailUrl: accessibleUrl
      }]);
    } catch (error) {
      console.error('Error handling PDF file:', error);
      setError('Failed to load PDF file');
    }
  };

  const handleOtherFileTypes = async () => {
    // For PowerPoint and other files, we'll use online viewers
    setSlides([]);
  };

  const goToSlide = (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToFirstSlide = () => {
    setCurrentSlide(0);
  };

  const goToLastSlide = () => {
    setCurrentSlide(slides.length - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't handle keyboard events when typing in inputs
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToFirstSlide();
          break;
        case 'End':
          e.preventDefault();
          goToLastSlide();
          break;
        case 'Escape':
          // No fullscreen functionality
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, isFullscreen]);

  const getViewerUrl = () => {
    if (project.presentation_type === 'external_url' && project.presentation_url) {
      console.log('Using external URL:', project.presentation_url);
      return project.presentation_url;
    }

    if (project.presentation_type === 'file' && project.presentation_file_path) {
      // Convert file path to full Supabase storage URL
      const filePath = project.presentation_file_path;
      const fileType = project.presentation_file_type || '';
      
      // Generate the full public URL from the file path
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);
      
      const fileUrl = urlData.publicUrl;
      
      console.log('File details:', {
        filePath,
        fileUrl,
        fileType,
        viewerAttempt,
        projectTitle: project.title,
        presentationType: project.presentation_type
      });
      
      // Check if the file URL is accessible
      if (!fileUrl || fileUrl.trim() === '') {
        console.error('No file URL provided');
        return null;
      }

      // Test if the file URL is accessible
      fetch(fileUrl, { method: 'HEAD' })
        .then(response => {
          console.log('File accessibility test:', {
            url: fileUrl,
            status: response.status,
            accessible: response.ok,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          // If public URL is not accessible, try signed URL
          if (!response.ok && viewerAttempt === 0) {
            console.log('Public URL not accessible, trying signed URL...');
            generateSignedUrl(filePath).then(signedUrl => {
              if (signedUrl) {
                console.log('Using signed URL instead:', signedUrl);
                // This will trigger a re-render with the signed URL
                setViewerAttempt(1);
              }
            });
          }
        })
        .catch(error => {
          console.error('File accessibility test failed:', error);
        });

      // Also test with a direct fetch to see the response
      fetch(fileUrl)
        .then(response => {
          console.log('Direct file fetch test:', {
            url: fileUrl,
            status: response.status,
            ok: response.ok,
            contentType: response.headers.get('content-type')
          });
        })
        .catch(error => {
          console.error('Direct file fetch failed:', error);
        });
      
      if (fileType === 'application/pdf') {
        // For PDFs, use direct file access - the PDFViewer component will handle rendering
        console.log('PDF direct access URL:', fileUrl);
        return fileUrl;
      } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
        // PowerPoint files need special handling - browsers can't render them directly
        console.warn('PowerPoint file detected - browsers cannot render PPT files directly');
        
        // Try Microsoft Office Online viewer as the primary option
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
        console.log('PowerPoint Office Online viewer URL:', viewerUrl);
        return viewerUrl;
      } else if (fileType.includes('image')) {
        // For images, return the direct URL
        console.log('Image URL:', fileUrl);
        return fileUrl;
      } else {
        // For unknown file types, try direct access
        console.log('Unknown file type, trying direct access:', fileUrl);
        return fileUrl;
      }
    }

    console.error('No valid presentation content found');
    return null;
  };

  // Function to generate signed URL as fallback
  const generateSignedUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('Article_images')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error generating signed URL:', error);
        return null;
      }
      
      console.log('Generated signed URL:', data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      return null;
    }
  };

  // Function to validate and get accessible URL
  const getAccessibleUrl = async (filePath: string): Promise<string | null> => {
    try {
      // First try public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        console.error('No public URL generated');
        return null;
      }

      // Test if public URL is accessible
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log('Public URL is accessible:', urlData.publicUrl);
          return urlData.publicUrl;
        }
      } catch (fetchError) {
        console.warn('Public URL not accessible, trying signed URL...');
      }

      // Fallback to signed URL
      const signedUrl = await generateSignedUrl(filePath);
      if (signedUrl) {
        // Test signed URL
        try {
          const response = await fetch(signedUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log('Signed URL is accessible:', signedUrl);
            return signedUrl;
          }
        } catch (fetchError) {
          console.error('Signed URL also not accessible:', fetchError);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting accessible URL:', error);
      return null;
    }
  };

  const handleDownload = () => {
    if (project.presentation_type === 'file' && project.presentation_file_path) {
      // Generate the full public URL from the file path
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(project.presentation_file_path);
      
      const link = document.createElement('a');
      link.href = urlData.publicUrl;
      link.download = project.presentation_file_name || `${project.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderExternalViewer = () => {
    const viewerUrl = getViewerUrl();
    
    console.log('renderExternalViewer called:', {
      viewerUrl,
      projectTitle: project.title,
      presentationType: project.presentation_type,
      filePath: project.presentation_file_path
    });
    
    if (!viewerUrl) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center space-y-4">
            <FileText className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Unable to Load Presentation</h3>
              <p className="text-gray-600 mb-4">
                {project.presentation_file_type?.includes('powerpoint') || project.presentation_file_type?.includes('presentation') 
                  ? 'PowerPoint files cannot be viewed directly in browsers. Please download the file to view it with Microsoft PowerPoint or convert it to PDF for web viewing.'
                  : 'This presentation type cannot be viewed directly in the browser.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download File
                </Button>
                {project.presentation_type === 'file' && project.presentation_file_path && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const { data: urlData } = supabase.storage
                        .from('Article_images')
                        .getPublicUrl(project.presentation_file_path);
                      window.open(urlData.publicUrl, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setViewerAttempt(viewerAttempt + 1);
                    setError(null);
                  }}
                  className="flex items-center gap-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="relative h-full overflow-hidden">
        {isViewerLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading presentation...</p>
              <p className="text-xs text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        )}
        
        {/* Mobile-friendly PDF container with proper touch handling */}
        <div 
          className={`w-full h-full ${isMobile ? 'overflow-auto touch-pan-y' : 'overflow-hidden'}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <iframe
            ref={iframeRef}
            src={viewerUrl}
            className={`w-full h-full border-0 rounded-lg ${isMobile ? 'pointer-events-auto' : ''}`}
            title={project.title}
            style={{
              minHeight: isMobile ? '100vh' : '100%',
              touchAction: isMobile ? 'pan-x pan-y' : 'auto'
            }}
            onLoad={() => {
              setIsViewerLoading(false);
              if (loadTimeout) {
                clearTimeout(loadTimeout);
                setLoadTimeout(null);
              }
            }}
            onError={() => {
              setIsViewerLoading(false);
              if (loadTimeout) {
                clearTimeout(loadTimeout);
                setLoadTimeout(null);
              }
              // Try different approaches
              if (useSandbox) {
                setUseSandbox(false);
                setIsViewerLoading(true);
              } else if (viewerAttempt < 2) {
                setViewerAttempt(viewerAttempt + 1);
                setIsViewerLoading(true);
              } else {
                setError('Unable to load presentation. The file may be inaccessible or the viewer service is unavailable.');
              }
            }}
            {...(useSandbox ? {
              sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-top-navigation-by-user-activation allow-downloads"
            } : {})}
          />
        </div>
      </div>
    );
  };

  const renderImageSlides = () => {
    if (slides.length === 0) return null;

    // Check if the current slide is a PDF
    const isPdf = project.presentation_file_type === 'application/pdf' || 
                  slides[currentSlide].imageUrl.includes('.pdf');

    return (
      <div className="relative h-full">
        {/* Main slide display */}
        <div className={`h-full flex items-center justify-center bg-gray-50 rounded-lg ${isPdf ? 'overflow-hidden' : 'overflow-hidden'}`}>
          {isPdf ? (
            // For PDFs, use iframe with mobile-friendly scrolling
            <div 
              className={`w-full h-full ${isMobile ? 'overflow-auto touch-pan-y' : 'overflow-hidden'}`}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              <iframe
                src={slides[currentSlide].imageUrl}
                className={`w-full h-full border-0 ${isMobile ? 'pointer-events-auto' : ''}`}
                title={`PDF Slide ${currentSlide + 1}`}
                style={{
                  minHeight: isMobile ? '100vh' : '100%',
                  touchAction: isMobile ? 'pan-x pan-y' : 'auto'
                }}
                onLoad={() => {
                  setIsViewerLoading(false);
                  setError(null);
                }}
                onError={(e) => {
                  console.error('PDF load error:', e);
                  console.error('Failed PDF URL:', slides[currentSlide].imageUrl);
                  setError('Failed to load PDF. The file may be corrupted or inaccessible.');
                  setIsViewerLoading(false);
                }}
              />
            </div>
          ) : (
            // For images, use img tag
            <img
              src={slides[currentSlide].imageUrl}
              alt={`Slide ${currentSlide + 1}`}
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                setIsViewerLoading(false);
                setError(null);
              }}
              onError={(e) => {
                console.error('Image load error:', e);
                console.error('Failed URL:', slides[currentSlide].imageUrl);
                setError('Failed to load slide image. The file may be corrupted or inaccessible.');
                setIsViewerLoading(false);
              }}
            />
          )}
        </div>

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <Button
              onClick={goToPreviousSlide}
              disabled={currentSlide === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              size="lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={goToNextSlide}
              disabled={currentSlide === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              size="lg"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Slide counter */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        )}
      </div>
    );
  };

  const renderThumbnailNavigation = () => {
    if (slides.length <= 1) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Slides</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Use arrow keys to navigate</span>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentSlide
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {project.presentation_file_type === 'application/pdf' || slide.imageUrl.includes('.pdf') ? (
                // For PDFs, show a PDF icon instead of trying to load as image
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-500" />
                </div>
              ) : (
                <img
                  src={slide.thumbnailUrl || slide.imageUrl}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Thumbnail load error:', e);
                    console.error('Failed thumbnail URL:', slide.thumbnailUrl || slide.imageUrl);
                    // You could set a placeholder image here if needed
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-gray-600 font-medium">Loading presentation...</p>
            <p className="text-sm text-gray-500 mt-1">
              {project.presentation_type === 'file' 
                ? 'Preparing your file for viewing' 
                : 'Connecting to external presentation'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Presentation</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
              {project.presentation_type === 'file' && project.presentation_file_path && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const { data: urlData } = supabase.storage
                      .from('Article_images')
                      .getPublicUrl(project.presentation_file_path);
                    window.open(urlData.publicUrl, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              )}
              <Button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Re-initialize slides
                  const initializeSlides = async () => {
                    try {
                      if (project.presentation_type === 'file' && project.presentation_file_path) {
                        const fileType = project.presentation_file_type || '';
                        
                        if (fileType === 'application/pdf') {
                          await handlePdfFile();
                        } else if (fileType.includes('image')) {
                          // Retry image loading with better error handling
                          const accessibleUrl = await getAccessibleUrl(project.presentation_file_path);
                          
                          if (!accessibleUrl) {
                            setError('Image file is not accessible. Please check if the file exists and is properly uploaded.');
                            return;
                          }
                          
                          setSlides([{
                            id: 0,
                            imageUrl: accessibleUrl,
                            thumbnailUrl: accessibleUrl
                          }]);
                        }
                      }
                    } catch (err) {
                      console.error('Retry failed:', err);
                      setError('Retry failed. Please try downloading the file.');
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  initializeSlides();
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              If the problem persists, the file may be corrupted or the external viewer service may be temporarily unavailable.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if this is a PDF file and use PDFViewer
  if (project.presentation_type === 'file' && project.presentation_file_type === 'application/pdf') {
    return <PDFViewer project={project} />;
  }

  return (
    <div className={`${isMobile ? 'h-[70vh] min-h-[400px]' : 'h-[500px] lg:h-[600px]'}`}>
      {/* Main viewer */}
      <div className="h-full">
        {project.presentation_type === 'external_url' || 
         (project.presentation_type === 'file' && slides.length === 0) ? (
          renderExternalViewer()
        ) : (
          renderImageSlides()
        )}
      </div>

      {/* Thumbnail navigation for image slides */}
      {renderThumbnailNavigation()}

      {/* Keyboard shortcuts help */}
      {slides.length > 1 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Use ← → arrow keys to navigate • Home/End for first/last slide
          </p>
        </div>
      )}
    </div>
  );
};

export default SlideViewer;
