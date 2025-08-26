import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, XCircle, Database, Shield } from 'lucide-react';
import { articlesApi } from '../lib/articles-api-new';

const GoogleSheetsTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    auth: boolean;
    connection: boolean;
    read: boolean;
    write: boolean;
    error?: string;
  } | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      console.log('🧪 Starting Google Sheets integration tests...');

      // Test 1: Authentication
      console.log('🔐 Testing authentication...');
      const authStatus = articlesApi.getAuthStatus();
      console.log('📊 Auth status:', authStatus);

      // Test 2: Connection and verification
      console.log('🔍 Testing connection...');
      await articlesApi.verifyState();

      // Test 3: Read articles
      console.log('📖 Testing read operations...');
      const articles = await articlesApi.getAll();
      console.log('📊 Articles read:', articles.length);

      // Test 4: Write article (test)
      console.log('✍️ Testing write operations...');
      const testArticle = {
        title: 'Test Article - ' + new Date().toISOString(),
        content: 'This is a test article to verify Google Sheets integration.',
        excerpt: 'Test article for integration verification',
        coverImage: 'https://via.placeholder.com/400x200?text=Test',
        tags: ['Test', 'Integration'],
        status: 'draft' as const,
        author: 'Test User',
        readTime: 2
      };

      const createdArticle = await articlesApi.create(testArticle);
      console.log('✅ Test article created:', createdArticle);

      // Test 5: Delete test article
      console.log('🗑️ Cleaning up test article...');
      await articlesApi.delete(createdArticle.id);

      setTestResults({
        auth: authStatus.isAuthenticated,
        connection: true,
        read: articles.length >= 0,
        write: true
      });

      console.log('🎉 All tests passed successfully!');

    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResults({
        auth: false,
        connection: false,
        read: false,
        write: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? 'default' : 'destructive'} className="flex items-center gap-2">
        {getStatusIcon(status)}
        {label}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Google Sheets Integration Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the Google Sheets backend integration with service account authentication
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Integration Test Suite
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to verify Google Sheets connectivity, authentication, and CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Integration Tests'
            )}
          </Button>

          {testResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Authentication</span>
                  {getStatusBadge(testResults.auth, testResults.auth ? 'Success' : 'Failed')}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Connection</span>
                  {getStatusBadge(testResults.connection, testResults.connection ? 'Success' : 'Failed')}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Read Operations</span>
                  {getStatusBadge(testResults.read, testResults.read ? 'Success' : 'Failed')}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Write Operations</span>
                  {getStatusBadge(testResults.write, testResults.write ? 'Success' : 'Failed')}
                </div>
              </div>

              {testResults.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Error Details:</span>
                  </div>
                  <p className="text-red-700 mt-2">{testResults.error}</p>
                </div>
              )}

              {!testResults.error && testResults.auth && testResults.connection && testResults.read && testResults.write && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">All Tests Passed!</span>
                  </div>
                  <p className="text-green-700 mt-2">
                    Google Sheets integration is working correctly. Your articles backend is ready to use.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Information
          </CardTitle>
          <CardDescription>
            This integration uses Google Service Account authentication for secure access to your Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Service account credentials are embedded in the code (not recommended for production)</p>
            <p>• Access is limited to the specific Google Sheet you've configured</p>
            <p>• No user authentication required - the service account handles all operations</p>
            <p>• Consider moving credentials to environment variables for production use</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSheetsTest;
