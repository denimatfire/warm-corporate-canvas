import { useState } from "react";
import { X, Download, ExternalLink, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface PresentationViewerProps {
  project: {
    id: string;
    title: string;
    presentation_type: 'file' | 'external_url';
    presentation_url?: string;
    presentation_file_path?: string;
    presentation_file_name?: string;
    presentation_file_type?: string;
  };
  onClose: () => void;
}

const PresentationViewer = ({ project, onClose }: PresentationViewerProps) => {
  const [viewerType, setViewerType] = useState<'google' | 'office' | 'download'>('google');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const getViewerUrl = () => {
    if (project.presentation_type === 'external_url' && project.presentation_url) {
      return project.presentation_url;
    }

    if (project.presentation_type === 'file' && project.presentation_file_path) {
      const fileUrl = project.presentation_file_path;
      
      if (viewerType === 'google') {
        // Google Slides viewer
        return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      } else if (viewerType === 'office') {
        // Microsoft Office Online viewer
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      }
    }

    return null;
  };

  const handleDownload = () => {
    if (project.presentation_type === 'file' && project.presentation_file_path) {
      const link = document.createElement('a');
      link.href = project.presentation_file_path;
      link.download = project.presentation_file_name || `${project.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isPowerPointFile = () => {
    if (project.presentation_type === 'file' && project.presentation_file_type) {
      return project.presentation_file_type.includes('powerpoint') || 
             project.presentation_file_type.includes('presentation');
    }
    return false;
  };

  const isPdfFile = () => {
    if (project.presentation_type === 'file' && project.presentation_file_type) {
      return project.presentation_file_type === 'application/pdf';
    }
    return false;
  };

  const viewerUrl = getViewerUrl();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className={`bg-background rounded-lg shadow-2xl w-full max-w-6xl ${isMobile ? 'h-[95vh]' : 'h-[90vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={project.presentation_type === 'file' ? 'default' : 'secondary'}>
                  {project.presentation_type === 'file' ? 'File Upload' : 'External URL'}
                </Badge>
                {project.presentation_file_type && (
                  <Badge variant="outline" className="text-xs">
                    {project.presentation_file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {project.presentation_type === 'file' && (
              <>
                {isPowerPointFile() && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewerType === 'google' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewerType('google')}
                    >
                      Google Viewer
                    </Button>
                    <Button
                      variant={viewerType === 'office' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewerType('office')}
                    >
                      Office Viewer
                    </Button>
                    <Button
                      variant={viewerType === 'download' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewerType('download')}
                    >
                      Download
                    </Button>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {project.presentation_type === 'external_url' && project.presentation_url ? (
            <div className={`h-full ${isMobile ? 'mobile-pdf-container' : ''}`}>
              <iframe
                src={project.presentation_url}
                className={`w-full h-full border-0 rounded-lg ${isMobile ? 'mobile-pdf-iframe' : ''}`}
                title={project.title}
                style={isMobile ? {
                  minHeight: '100vh',
                  touchAction: 'pan-x pan-y'
                } : {}}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : project.presentation_type === 'file' && viewerUrl ? (
            <div className={`h-full ${isMobile ? 'mobile-pdf-container' : ''}`}>
              {viewerType === 'download' ? (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Download Required</h3>
                      <p className="text-muted-foreground mb-4">
                        This file type cannot be viewed directly in the browser. 
                        Please download it to view with the appropriate application.
                      </p>
                      <Button onClick={handleDownload} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download {project.presentation_file_name || 'File'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Loading presentation...</p>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    src={viewerUrl}
                    className={`w-full h-full border-0 rounded-lg ${isMobile ? 'mobile-pdf-iframe' : ''}`}
                    title={project.title}
                    style={isMobile ? {
                      minHeight: '100vh',
                      touchAction: 'pan-x pan-y'
                    } : {}}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />
                  
                  {/* Fallback message if viewer fails */}
                  <div className="mt-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        If the presentation doesn't load, try downloading the file or using a different viewer.
                        Some file types may not be supported by the online viewers.
                      </AlertDescription>
                    </Alert>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center space-y-4">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Presentation Available</h3>
                  <p className="text-muted-foreground">
                    This project doesn't have a presentation file or URL configured.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;

