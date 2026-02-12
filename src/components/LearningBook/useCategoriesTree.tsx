import { useEffect, useState } from "react";
import categoriesApi from "../../api/categories";
import { CategoriesTree, MenuCategoryId, TranslatedCategoryTree } from "../../interfaces/category";

export const getTitleByCategoryId = (categoryId: MenuCategoryId) => {
    switch (categoryId) {
        case MenuCategoryId.Beginners:
            return "Для Пачаткоўцаў"
        case MenuCategoryId.History:
            return "Гісторыя"
        case MenuCategoryId.MusicQuestions:
            return "Ігра на дудзе"
        case MenuCategoryId.Operation:
            return "Эксплуатацыя"
        case MenuCategoryId.Repertoire:
            return "Рэпертуар"
        case MenuCategoryId.Theory:
            return "Тэорыя для дудароў"
    }
}

const useTanslateCategoriesTree = (categories: CategoriesTree): TranslatedCategoryTree => {
    return categories.map(category => ({ category: getTitleByCategoryId(category.category), articles: category.articles }))
}

export const useCategoriesTree = () => {
    const [categories, setCategories] = useState<CategoriesTree>([]);

    const getCategories = async () => {
        const result = await categoriesApi.getAllCategories();
        setCategories(result);
    }

    useEffect(() => {
        getCategories()
    }, [])

    const translatedCategories = useTanslateCategoriesTree(categories);

    return { categories: translatedCategories, setCategories };
};

