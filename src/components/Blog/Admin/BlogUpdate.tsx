import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import blogApi from "../../../api/blog";
import { Link } from "react-router-dom";
import BlogPostForm from "./BlogPostForm";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

const BlogUpdate: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogApi.getPostBySlug(id);
        setPost(response);
      } catch (error) {
        console.error("Error fetching post:", error);
        history.push("/blog");
      }
    };

    fetchPost();
  }, [id, history]);

  const handleSave = async (updatedPost: any) => {
    try {
      if (!post._id) return;
      await blogApi.updatePost(post._id, updatedPost);
      alert("Post updated successfully");
      history.push("/blog");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleCancel = () => {
    history.push("/blog");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        if (!post?.id) return;
        await blogApi.deletePost(post.id);
        alert("Post deleted successfully");
        history.push("/blog");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <Link to="/blog" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBack />} variant="outlined" color="primary">
            Back to Blogs
          </Button>
        </Link>
      </Box>
      <Typography variant="h4" className={classes.title}>
        Edit Blog Post
      </Typography>
      <BlogPostForm
        initialPost={post}
        onSubmit={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        submitButtonText="Update Post"
        showDeleteButton={true}
      />
    </Container>
  );
};

export default BlogUpdate; 