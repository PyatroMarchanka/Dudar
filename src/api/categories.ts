import axios from "axios";
import { links } from "./links";
import { Languages } from "../interfaces";
import { CategoriesTree } from "../interfaces/category";

const categoriesApi = {
    getAllCategories: async (language = Languages.Belarusian): Promise<CategoriesTree> => {
        const response = await axios.get(`${links.categories}?language=${language}`);

        return response.data;
    }
};

export default categoriesApi;
