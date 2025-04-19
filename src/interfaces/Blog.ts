export interface BlogPostTranslation {
  title: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  featuredImage?: string;
  translations: {
    [languageCode: string]: BlogPostTranslation;
  };
  defaultLanguage: string;
}

export interface BlogPostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
  availableLanguages: string[];
} 