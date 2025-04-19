export interface BlogPostTranslation {
  title: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface BlogPost {
  _id: string;
  slug: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  createdAt: string;
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
  author: {
    _id: string;
    name: string;
    picture?: string;
  };
  publishedAt: string;
  createdAt: string;
  tags: string[];
  featuredImage?: string;
  availableLanguages: string[];
} 