import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Users, 
  FileText, 
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
  User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ArticleEditor from '../components/ArticleEditor';
import { 
  getArticles, 
  getArticleStats, 
  deleteArticle, 
  searchArticles,
  getArticlesByStatus,
  getArticlesByTag
} from '../data/articles';
import { 
  getCurrentUser, 
  canCreateArticles, 
  canDeleteArticles, 
  canPublishArticles,
  canEditArticles,
  logout 
} from '../data/auth';
import { useToast } from '../hooks/use-toast';
import { Article } from '../data/articles';

const ArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalTags: 0 });
  
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadArticles();
    loadStats();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, statusFilter, tagFilter]);

  const loadArticles = () => {
    const allArticles = getArticles();
    setArticles(allArticles);
  };

  const loadStats = () => {
    const articleStats = getArticleStats();
    setStats(articleStats);
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchArticles(searchQuery);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    // Apply tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(article => 
        article.tags.some(tag => tag === tagFilter)
      );
    }

    setFilteredArticles(filtered);
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!canDeleteArticles()) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to delete articles.',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      const success = deleteArticle(articleId);
      if (success) {
        toast({
          title: 'Article Deleted',
          description: 'The article has been successfully deleted.',
        });
        loadArticles();
        loadStats();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the article. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSaveArticle = (article: Article) => {
    setShowEditor(false);
    setEditingArticle(null);
    loadArticles();
    loadStats();
    
    toast({
      title: 'Article Saved',
      description: `Article "${article.title}" has been ${article.status === 'published' ? 'published' : 'saved as draft'}.`,
    });
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    // Redirect to login or home page
    window.location.href = '/';
  };

  const getUniqueTags = () => {
    const allTags = articles.flatMap(article => article.tags);
    return Array.from(new Set(allTags)).sort();
  };

  if (showEditor) {
    return (
      <ArticleEditor
        article={editingArticle || undefined}
        onSave={handleSaveArticle}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Article Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage your articles and content
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-medium">{currentUser?.username}</p>
                <Badge variant={currentUser?.role === 'admin' ? 'default' : 'secondary'}>
                  {currentUser?.role}
                </Badge>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalTags}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tagFilter} onValueChange={(value: any) => setTagFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {getUniqueTags().map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {canCreateArticles() && (
            <Button onClick={handleCreateArticle} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Article
            </Button>
          )}
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || tagFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Get started by creating your first article.'
                  }
                </p>
                {canCreateArticles() && !searchQuery && statusFilter === 'all' && tagFilter === 'all' && (
                  <Button onClick={handleCreateArticle} className="mt-4">
                    Create Your First Article
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{article.title}</h3>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {article.readTime} min read
                      </div>
                    </div>
                    
                    {article.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {article.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {canEditArticles() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    
                    {canDeleteArticles() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleManagement;
