import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter,
  Calendar,
  Tag,
  User,
  Shield
} from 'lucide-react';
import { Article, getArticles, deleteArticle } from '../data/articles';
import { canDeleteArticles, getCurrentUser } from '../data/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useToast } from '../hooks/use-toast';

interface ArticleListProps {
  onEditArticle: (article: Article) => void;
  onViewArticle: (article: Article) => void;
  onCreateNew: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  onEditArticle,
  onViewArticle,
  onCreateNew
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const canDelete = canDeleteArticles();

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadArticles = () => {
    const loadedArticles = getArticles();
    setArticles(loadedArticles);
  };

  const filterAndSortArticles = () => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredArticles(filtered);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (!canDelete) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can delete articles.',
        variant: 'destructive',
      });
      return;
    }

    const success = deleteArticle(articleId);
    if (success) {
      loadArticles();
      toast({
        title: 'Article deleted',
        description: 'The article has been permanently deleted.',
      });
    } else {
      toast({
        title: 'Error deleting article',
        description: 'There was an error deleting the article. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: 'draft' | 'published') => {
    return status === 'draft' ? (
      <Clock className="w-4 h-4 text-muted-foreground" />
    ) : (
      <CheckCircle2 className="w-4 h-4 text-success" />
    );
  };

  const getStatusBadge = (status: 'draft' | 'published') => {
    return status === 'draft' ? (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Draft
      </Badge>
    ) : (
      <Badge className="flex items-center gap-1 bg-success text-success-foreground">
        <CheckCircle2 className="w-3 h-3" />
        Published
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Article Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your articles, drafts, and published content
          </p>
          {currentUser && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Logged in as: <strong>{currentUser.username}</strong>
              </span>
              {!canDelete && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Limited permissions</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
        >
          <Plus className="w-4 h-4" />
          Create New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-card rounded-lg border shadow-sm"
        >
          <div className="text-2xl font-bold text-foreground">{articles.length}</div>
          <div className="text-sm text-muted-foreground">Total Articles</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-card rounded-lg border shadow-sm"
        >
          <div className="text-2xl font-bold text-foreground">
            {articles.filter(a => a.status === 'published').length}
          </div>
          <div className="text-sm text-muted-foreground">Published</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-card rounded-lg border shadow-sm"
        >
          <div className="text-2xl font-bold text-foreground">
            {articles.filter(a => a.status === 'draft').length}
          </div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-card rounded-lg border shadow-sm"
        >
          <div className="text-2xl font-bold text-foreground">
            {articles.filter(a => a.tags.length > 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Tagged</div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search articles by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'status')}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    {article.coverImage && (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    )}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {article.title}
                        </h3>
                        {getStatusBadge(article.status)}
                      </div>
                      
                      {article.excerpt && (
                        <p className="text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.updatedAt)}
                        </div>
                        
                        {article.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min read
                          </div>
                        )}
                      </div>
                      
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewArticle(article)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditArticle(article)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  
                  {canDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{article.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteArticle(article.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            {articles.length === 0 ? (
              <div className="space-y-2">
                <p className="text-lg">No articles yet</p>
                <p>Create your first article to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">No articles match your filters</p>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
