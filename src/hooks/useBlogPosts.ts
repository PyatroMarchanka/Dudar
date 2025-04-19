import { useState, useEffect } from 'react';
import blogApi from '../api/blog';
import type { BlogPostPreview } from '../interfaces/Blog';

export const useBlogPosts = (language: string) => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAllPosts(language);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  return { posts, loading, error };
}; 