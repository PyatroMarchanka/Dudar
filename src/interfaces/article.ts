import { MenuCategoryId } from "./category";

export interface ArticleTranslation {
  title: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  metaKeywords: string[];
  tags: string[];
}

export interface Article {
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
    [languageCode: string]: ArticleTranslation;
  };
  defaultLanguage: string;
  category: MenuCategoryId
}

export interface ArticlePreview {
  _id: string;
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
  category: MenuCategoryId
} 