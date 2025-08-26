import React from 'react';
import ArticleListExample from '../components/ArticleListExample';
import { Article } from '../lib/articles-api-new';

const ArticleTest: React.FC = () => {
  const handleEditArticle = (article: Article) => {
    console.log('Edit article:', article);
    alert(`Edit article: ${article.title}`);
  };

  const handleViewArticle = (article: Article) => {
    console.log('View article:', article);
    alert(`View article: ${article.title}`);
  };

  const handleCreateNew = () => {
    console.log('Create new article');
    alert('Create new article clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <ArticleListExample
        onEditArticle={handleEditArticle}
        onViewArticle={handleViewArticle}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};

export default ArticleTest;
