import React, { useContext } from "react";
import { Container, Typography, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import articlesApi from "../../../api/articles";
import { Link, useHistory } from "react-router-dom";
import BlogPostForm from "./BlogPostForm";
import { store } from "../../../context";
import { useGoogleProfile } from "../../../hooks/useGoogleProfile";
import { routes } from "../../../router/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

const BlogAdmin: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state: { userData } } = useContext(store)

  useGoogleProfile();

  const handleSave = async (post: any) => {
    try {
      if (!userData?._id) return;
      const fullPost = { ...post, author: userData._id }
      await articlesApi.createPost(fullPost);
      alert("Post saved successfully");
      history.push(routes.learningBook);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleCancel = () => {
    history.push(routes.learningBook);
  };


  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <Link to={routes.learningBook} style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBack />} variant="outlined" color="primary">
            Back to Blogs
          </Button>
        </Link>
      </Box>
      <Typography variant="h4" className={classes.title}>
        Blog Post Editor
      </Typography>
      <BlogPostForm
        onSubmit={handleSave}
        onCancel={handleCancel}
        submitButtonText="Create Post"
      />
    </Container>
  );
};

export default BlogAdmin;
