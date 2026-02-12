import { useState, useEffect } from 'react';
import articlesApi from '../api/articles';
import type { ArticlePreview } from '../interfaces/article';

export const useArticlesPreviews = (language: string) => {
  const [articlesPreviews, setArticles] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await articlesApi.getAllPosts(language);
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch articles'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  return { articlesPreviews, loading, error };
}; 