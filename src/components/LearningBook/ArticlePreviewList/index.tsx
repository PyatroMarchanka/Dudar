import React from "react";
import styled from "styled-components";
import { ArticlePreview } from "../ArticlePreview";
import { mainColors } from "../../../utils/theme";
import { ArticlePreview as ArticlePreviewType } from "../../../interfaces/article";

interface ArticlePreviewListProps {
    articles: ArticlePreviewType[];
    categoryTitle?: string;
}

export const ArticlePreviewList: React.FC<ArticlePreviewListProps> = ({ articles, categoryTitle }) => {
    return (
        <ArticleListContainer>
            {categoryTitle && <CategoryTitle>{categoryTitle}</CategoryTitle>}
            <ArticlesGrid>
                {articles.map((article) => (
                    <ArticlePreview key={article._id} article={article} />
                ))}
            </ArticlesGrid>
        </ArticleListContainer>
    );
};

const ArticleListContainer = styled.div`
    width: 100%;
    padding: 0.75rem;
`;

export const CategoryTitle = styled.h2`
    margin: 0 0 0.75rem 0;
    font-size: 18px;
    font-weight: 600;
    color: ${mainColors.darkerGray};
    font-family: "Roboto", sans-serif;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(223, 120, 97, 0.2);
`;

const ArticlesGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

