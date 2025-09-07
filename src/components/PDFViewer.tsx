import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/articles-api';

// Set up PDF.js worker - use only local worker to avoid CDN issues
const localWorkerSrc = '/pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = localWorkerSrc;

// Ensure we're using the correct version
console.log('PDF.js version:', pdfjs.version);
console.log('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);

// Test if the local worker file is accessible
fetch(localWorkerSrc, { method: 'HEAD' })
  .then(response => {
    if (response.ok) {
      console.log('PDF.js worker configured (local only):', { 
        version: pdfjs.version, 
        workerSrc: localWorkerSrc,
        workerOptions: pdfjs.GlobalWorkerOptions,
        status: 'accessible'
      });
    } else {
      console.warn('Local worker file not accessible:', response.status);
    }
  })
  .catch(error => {
    console.error('Failed to test local worker file:', error);
  });

interface PDFViewerProps {
  project: {
    id: string;
    title: string;
    description?: string;
    presentation_type: 'file' | 'external_url';
    presentation_file_path?: string;
    presentation_file_name?: string;
    presentation_file_type?: string;
  };
  onClose?: () => void;
  isModal?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  project, 
  onClose, 
  isModal = false 
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [retryCount, setRetryCount] = useState<number>(0);
  const isMobile = useIsMobile();

  // Responsive scale calculation
  useEffect(() => {
    const calculateScale = () => {
      if (isMobile) {
        setScale(0.7);
      } else if (window.innerWidth < 1024) {
        setScale(0.8);
      } else {
        setScale(0.9);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile]);

  // Fetch PDF URL
  const fetchPdfUrl = useCallback(async () => {
    if (!project.presentation_file_path) {
      setError('No PDF file path provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First try to get public URL
      const { data: urlData } = supabase.storage
        .from('Article_images')
        .getPublicUrl(project.presentation_file_path);

      // Test if public URL is accessible
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          setPdfUrl(urlData.publicUrl);
          setIsLoading(false);
          return;
        }
      } catch (fetchError) {
        console.warn('Public URL not accessible, trying signed URL...');
      }

      // Fallback to signed URL
      const { data: signedData, error: signedError } = await supabase.storage
        .from('Article_images')
        .createSignedUrl(project.presentation_file_path, 3600); // 1 hour expiry

      if (signedError) {
        throw new Error(`Failed to generate signed URL: ${signedError.message}`);
      }

      if (!signedData?.signedUrl) {
        throw new Error('No signed URL generated');
      }

      setPdfUrl(signedData.signedUrl);
    } catch (err) {
      console.error('Error fetching PDF URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    } finally {
      setIsLoading(false);
    }
  }, [project.presentation_file_path]);

  useEffect(() => {
    if (project.presentation_type === 'file' && project.presentation_file_type === 'application/pdf') {
      fetchPdfUrl();
    } else {
      setError('This is not a PDF file');
      setIsLoading(false);
    }
  }, [project.presentation_type, project.presentation_file_type, fetchPdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully:', { numPages, pageNumber: 1 });
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    
    // Provide helpful error messages based on error type
    if (error.message.includes('worker') || error.message.includes('CORS') || error.message.includes('Invalid workerSrc')) {
      setError(`PDF viewer is having trouble loading (attempt ${retryCount + 1}/3). This might be due to browser security restrictions. Please try the retry button or download the PDF instead.`);
    } else if (error.message.includes('Invalid PDF')) {
      setError('The PDF file appears to be corrupted or invalid. Please try downloading it.');
    } else if (error.message.includes('Failed to fetch')) {
      setError('Unable to load the PDF file. Please check your internet connection or try downloading the PDF instead.');
    } else {
      setError('Failed to load PDF document. Please check if the file is accessible.');
    }
    
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const goToFirstPage = () => {
    setPageNumber(1);
  };

  const goToLastPage = () => {
    setPageNumber(numPages);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = project.presentation_file_name || `${project.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Always use local worker, just retry the PDF loading
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    console.log(`Retry ${retryCount + 1}: Using local worker`, {
      version: pdfjs.version,
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc
    });
    
    fetchPdfUrl();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          e.preventDefault();
          goToFirstPage();
          break;
        case 'End':
          e.preventDefault();
          goToLastPage();
          break;
        case 'Escape':
          if (onClose) {
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (isLoading) {
    return (
      <div className={`${isModal ? 'h-96' : 'h-[500px] lg:h-[600px]'} flex items-center justify-center`}>
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <div>
              <p className="text-lg font-medium">Loading PDF...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Preparing your document for viewing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isModal ? 'h-96' : 'h-[500px] lg:h-[600px]'} flex items-center justify-center`}>
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Error Loading PDF</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                {pdfUrl && (
                  <>
                    <Button onClick={handleDownload} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={() => window.open(pdfUrl, '_blank')} 
                      variant="outline" 
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className={`${isModal ? 'h-96' : 'h-[500px] lg:h-[600px]'} flex items-center justify-center`}>
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No PDF Available</h3>
              <p className="text-sm text-muted-foreground">
                This project doesn't have a PDF file to display.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${isModal ? 'h-96' : 'min-h-[500px] lg:min-h-[600px]'} flex flex-col`}>
      {/* PDF Document */}
      <div className="flex-1 flex items-start justify-center bg-gray-50 rounded-lg overflow-auto p-4">
        <div className="relative w-full max-w-4xl">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            }
            className="flex justify-center"
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
              
              {/* Navigation Overlay - positioned relative to the PDF page */}
              {numPages > 1 && (
                <>
                  {/* Previous Button */}
                  <Button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 shadow-lg z-10 disabled:bg-gray-100 disabled:border-gray-300"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700 disabled:text-gray-400" />
                  </Button>

                  {/* Next Button */}
                  <Button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 shadow-lg z-10 disabled:bg-gray-100 disabled:border-gray-300"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700 disabled:text-gray-400" />
                  </Button>

                  {/* Page Counter */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                    {pageNumber} / {numPages}
                  </div>
                </>
              )}
            </div>
          </Document>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col items-center gap-4">
        {/* Navigation Buttons - Centered */}
        {numPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={goToFirstPage}
              disabled={pageNumber <= 1}
              variant="outline"
              size="sm"
            >
              First
            </Button>
            <Button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              onClick={goToLastPage}
              disabled={pageNumber >= numPages}
              variant="outline"
              size="sm"
            >
              Last
            </Button>
          </div>
        )}

        {/* Action Buttons - Centered */}
        <div className="flex items-center gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      {numPages > 1 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Use ← → arrow keys to navigate • Home/End for first/last page
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
