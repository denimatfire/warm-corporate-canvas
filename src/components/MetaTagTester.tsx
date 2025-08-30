import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ensureMetaTagsImmediate, debugMetaTags, resetMetaTags } from '../lib/meta-tags';

const MetaTagTester: React.FC = () => {
  const [currentMetaTags, setCurrentMetaTags] = useState<string>('');

  // Test meta tags for a sample article
  const testArticleMetaTags = () => {
    const sampleArticle = {
      title: 'Test Article - Meta Tag Testing',
      description: 'This is a test article to verify meta tag functionality',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
      url: window.location.href,
      type: 'article' as const,
      author: 'Test Author',
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      tags: ['test', 'meta-tags', 'verification'],
      readingTime: '5'
    };

    console.log('Testing meta tags with sample article:', sampleArticle);
    
    // Use immediate meta tag update
    ensureMetaTagsImmediate(sampleArticle);
    
    // Log current meta tags after a short delay
    setTimeout(() => {
      console.log('Meta tags after update:');
      debugMetaTags();
      
      // Display current meta tags in the UI
      const metaTags = document.querySelectorAll('meta');
      const metaTagsText = Array.from(metaTags)
        .map(meta => {
          const property = meta.getAttribute('property');
          const name = meta.getAttribute('name');
          const content = meta.getAttribute('content');
          if (property || name) {
            return `${property || name}: ${content}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
      
      setCurrentMetaTags(metaTagsText);
    }, 100);
  };

  // Reset meta tags to default
  const resetToDefault = () => {
    resetMetaTags();
    setCurrentMetaTags('');
    console.log('Meta tags reset to default');
  };

  // Test default portfolio meta tags
  const testDefaultMetaTags = () => {
    resetMetaTags();
    setTimeout(() => {
      const metaTags = document.querySelectorAll('meta');
      const metaTagsText = Array.from(metaTags)
        .map(meta => {
          const property = meta.getAttribute('property');
          const name = meta.getAttribute('name');
          const content = meta.getAttribute('content');
          if (property || name) {
            return `${property || name}: ${content}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
      
      setCurrentMetaTags(metaTagsText);
    }, 100);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tag Testing Tool</CardTitle>
          <p className="text-muted-foreground">
            Use this tool to test and verify meta tag functionality for social media sharing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testArticleMetaTags} variant="default">
              Test Article Meta Tags
            </Button>
            <Button onClick={testDefaultMetaTags} variant="outline">
              Test Default Portfolio Meta Tags
            </Button>
            <Button onClick={resetToDefault} variant="destructive">
              Reset to Default
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Current Meta Tags:</h3>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {currentMetaTags || 'No meta tags to display. Click a test button above.'}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click "Test Article Meta Tags" to simulate viewing an article</li>
              <li>Check the console for debug information</li>
              <li>Use browser dev tools to inspect the &lt;head&gt; section</li>
              <li>Test with social media debugging tools:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Sharing Debugger</a></li>
                  <li><a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Card Validator</a></li>
                  <li><a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Post Inspector</a></li>
                </ul>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaTagTester;
