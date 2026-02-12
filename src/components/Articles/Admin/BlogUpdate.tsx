import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import articlesApi from "../../../api/articles";
import { Link } from "react-router-dom";
import BlogPostForm from "./BlogPostForm";
import { routes } from "../../../router/routes";
import { a } from "react-spring";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

const BlogUpdate: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await articlesApi.getPostBySlug(id);
        setPost(response);
      } catch (error) {
        console.error("Error fetching post:", error);
        history.push(routes.learningBook);
      }
    };

    fetchPost();
  }, [id, history]);

  const handleSave = async (updatedPost: any) => {
    try {
      if (!post._id) return;
      await articlesApi.updatePost(post._id, updatedPost);
      alert(t("blog.messages.postUpdated"));
      history.push(routes.learningBook);
    } catch (error) {
      console.error("Error updating post:", error);
      alert(t("blog.messages.updateFailed"));
    }
  };

  const handleCancel = () => {
    history.push(routes.learningBook);
  };

  const handleDelete = async () => {
    if (window.confirm(t("blog.form.deleteConfirm") as string)) {
      try {
        if (!post?.id) return;
        await articlesApi.deletePost(post.id);
        alert(t("blog.messages.postDeleted"));
        history.push(routes.learningBook);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert(t("blog.messages.deleteFailed"));
      }
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <Link to={routes.learningBook} style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBack />} variant="outlined" color="primary">
            {t("blog.backToBlogs")}
          </Button>
        </Link>
      </Box>
      <Typography variant="h4" className={classes.title}>
        {t("blog.admin.editTitle")}
      </Typography>
      <BlogPostForm
        initialPost={post}
        onSubmit={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        submitButtonText={t("blog.form.updatePost") as string}
        showDeleteButton={true}
      />
    </Container >
  );
};

export default BlogUpdate; 