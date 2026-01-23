import { ArticlePreview } from "./article";

export enum MenuCategoryId {
    Beginners = "beginners",
    History = "history",
    MusicQuestions = "music-questions",
    Operation = "operation",
    Theory = "theory",
    Repertoire = "repertoire",
}

export interface Category {
    category: MenuCategoryId;
    articles: ArticlePreview[];
}

export interface TranslatedCategory {
    category: string;
    articles: ArticlePreview[];
}

export interface MenuCategory {
    id: string;
    title: string;
    articles: ArticlePreview[];
}

export type CategoriesTree = Category[];
export type TranslatedCategoryTree = TranslatedCategory[]
