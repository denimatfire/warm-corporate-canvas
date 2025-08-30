import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { updateMetaTags, resetMetaTags, debugMetaTags } from '../lib/meta-tags';

const MetaTagTester: React.FC = () => {
  const [currentMetaTags, setCurrentMetaTags] = useState<string>('');

  const testArticleMetaTags = () => {
    console.log('Testing article meta tags...');
    
    updateMetaTags({
      title: "Test Article - Dhrubajyoti Das Portfolio",
      description: "This is a test article to verify meta tag updates are working correctly.",
      image: "https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png",
      url: window.location.href,
      type: "article",
      author: "Dhrubajyoti Das",
      publishedTime: "2024-01-01T00:00:00Z",
      modifiedTime: "2024-01-01T00:00:00Z",
      tags: ["test", "meta-tags", "debugging"],
      readingTime: "3"
    });
    
    // Log the updated meta tags
    setTimeout(() => {
      debugMetaTags();
      captureMetaTags();
    }, 100);
  };

  const testPortfolioMetaTags = () => {
    console.log('Testing portfolio meta tags...');
    
    updateMetaTags({
      title: "Dhrubajyoti Das - Personal Portfolio",
      description: "Professional portfolio showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography.",
      image: "https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png",
      type: "website"
    });
    
    // Log the updated meta tags
    setTimeout(() => {
      debugMetaTags();
      captureMetaTags();
    }, 100);
  };

  const resetToDefault = () => {
    console.log('Resetting to default meta tags...');
    resetMetaTags();
    
    setTimeout(() => {
      debugMetaTags();
      captureMetaTags();
    }, 100);
  };

  const captureMetaTags = () => {
    const metaTags = document.querySelectorAll('meta');
    let metaTagText = '';
    
    metaTags.forEach(meta => {
      const property = meta.getAttribute('property');
      const name = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      if (property || name) {
        metaTagText += `${property || name}: ${content}\n`;
      }
    });
    
    setCurrentMetaTags(metaTagText);
  };

  const viewCurrentMetaTags = () => {
    captureMetaTags();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tag Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={testArticleMetaTags} variant="default">
              Test Article Meta Tags
            </Button>
            <Button onClick={testPortfolioMetaTags} variant="outline">
              Test Portfolio Meta Tags
            </Button>
            <Button onClick={resetToDefault} variant="outline">
              Reset to Default
            </Button>
            <Button onClick={viewCurrentMetaTags} variant="outline">
              View Current Meta Tags
            </Button>
          </div>
          
          {currentMetaTags && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Current Meta Tags:</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                {currentMetaTags}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
              <li>Click "Test Article Meta Tags" to simulate viewing an article</li>
              <li>Click "Test Portfolio Meta Tags" to simulate viewing the portfolio</li>
              <li>Click "Reset to Default" to restore original meta tags</li>
              <li>Use "View Current Meta Tags" to see what's currently set</li>
              <li>Check the browser console for detailed logging</li>
              <li>Use browser dev tools to inspect the actual meta tags in the DOM</li>
            </ol>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Debugging Tips:</h3>
            <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
              <li>Open browser dev tools (F12)</li>
              <li>Go to Console tab to see debug logs</li>
              <li>Go to Elements tab and search for "meta" tags</li>
              <li>Use Facebook Debugger or LinkedIn Post Inspector to test social sharing</li>
              <li>Check if meta tags are being created/updated in the DOM</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaTagTester;
