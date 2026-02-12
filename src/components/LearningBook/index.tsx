import React from "react";
import { LearningBookHeader } from "./Header";
import styled from "styled-components";
import { useCategoriesTree } from "./useCategoriesTree";
import { ArticlesList } from "../Articles/ArticlesList";

export const LearningBook: React.FC = () => {
    const { categories } = useCategoriesTree();

    return (
        <Container>
            <LearningBookHeader categoriesTree={categories} />
            <ArticlesList />
        </Container>
    );
};


const Container = styled.nav`
    margin-top: 70px;
`;