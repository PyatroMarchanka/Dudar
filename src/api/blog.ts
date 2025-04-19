import axios from "axios";
import cookie from "react-cookies";
import type { BlogPost, BlogPostPreview } from "../interfaces/Blog";
import { links } from "./links";
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const blogApi = {
  // Create a new blog post
  createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const fullPost = {
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: post.translations?.en?.title.toLowerCase().replace(/ /g, "-"),
    };
    const response = await axios.post(links.blog, fullPost, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Get all blog posts (preview)
  getAllPosts: async (language: string): Promise<BlogPostPreview[]> => {
    const response = await axios.get(`${links.blog}?language=${language}`);
    return response.data;
  },

  getAllPostsByUserAuthor: async (authorId: string): Promise<BlogPost[]> => {
    const response = await axios.get(`${links.blog}/author/${authorId}`, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Get a single blog post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await axios.get(`${links.blog}/${slug}`);
    return response.data;
  },

  // Update a blog post
  updatePost: async (
    id: string,
    post: Partial<BlogPost>
  ): Promise<BlogPost> => {
    const response = await axios.put(`${links.blog}/${id}`, post, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Delete a blog post
  deletePost: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });
  },
};

export default blogApi;
