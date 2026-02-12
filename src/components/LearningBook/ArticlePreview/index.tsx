import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { mainColors } from "../../../utils/theme";
import { ArticlePreview as ArticlePreviewType } from "../../../interfaces/article";

interface ArticlePreviewProps {
    article: ArticlePreviewType;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
    return (
        <ArticleLink to={`article/be/${article.slug}`}>
            <ArticleContainer>
                {article.featuredImage && (
                    <ArticleImage src={article.featuredImage} alt={article.title} />
                )}
                <ArticleContent>
                    <ArticleTitle>{article.title}</ArticleTitle>
                </ArticleContent>
            </ArticleContainer>
        </ArticleLink>
    );
};

const ArticleLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
`;

const ArticleContainer = styled.div`
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background: rgba(223, 120, 97, 0.1);
    }
`;

const ArticleImage = styled.img`
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
    background: ${mainColors.lightestGrey};
`;

const ArticleContent = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`;

const ArticleTitle = styled.h3`
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${mainColors.darkerGray};
    font-family: "Roboto", sans-serif;
    line-height: 1.3;
`;

