import axios from "axios";
import type { Article, ArticlePreview } from "../interfaces/article";
import { links } from "./links";
import { withAuth } from "./utils";

const articlesApi = {
  // Create a new blog post
  createPost: async (post: Partial<Article>): Promise<Article> => {
    const fullPost = {
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: post.translations?.en?.title.toLowerCase().replace(/ /g, "-"),
    };
    const response = await axios.post(links.article, fullPost, withAuth());
    return response.data;
  },

  // Get all blog posts (preview)
  getAllPosts: async (language: string): Promise<ArticlePreview[]> => {
    const response = await axios.get(`${links.article}?language=${language}`);
    return response.data;
  },

  getAllPostsByUserAuthor: async (authorId: string): Promise<Article[]> => {
    const response = await axios.get(`${links.article}/author/${authorId}`, withAuth());
    return response.data;
  },

  // Get a single blog post by slug
  getPostBySlug: async (slug: string): Promise<Article> => {
    const response = await axios.get(`${links.article}/${slug}`);
    return response.data;
  },

  // Update a blog post
  updatePost: async (
    id: string,
    post: Partial<Article>
  ): Promise<Article> => {
    const response = await axios.put(`${links.article}/${id}`, post, withAuth());
    return response.data;
  },

  // Delete a blog post
  deletePost: async (id: string): Promise<void> => {
    await axios.delete(`${links.article}/${id}`, withAuth());
  },
};

export default articlesApi;
