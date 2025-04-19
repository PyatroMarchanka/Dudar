import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPostPreview } from "../../interfaces/Blog";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Box,
  CircularProgress,
  Snackbar,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import blogApi from "../../api/blog";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Controls/LanguageSelector";
import { ArrowBack } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
    fontFamily: "sans-serif",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  media: {
    height: 200,
    objectFit: "cover",
  },
  cardContent: {
    flexGrow: 1,
  },
  excerpt: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    marginBottom: theme.spacing(2),
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  tag: {
    margin: theme.spacing(0.5),
  },
}));

const BlogList: React.FC = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogApi.getAllPosts(language);
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          variant="outlined"
          color="primary"
        >
          Back to Home
        </Button>
        <LanguageSelector />
      </Box>
      <Typography variant="h3" component="h1" className={classes.title}>
        Blog
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardActionArea component={Link} to={`/blog/${post.slug}`}>
                {post.featuredImage && (
                  <CardMedia
                    className={classes.media}
                    image={post.featuredImage}
                    title={post.title}
                  />
                )}
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {post.excerpt}
                  </Typography>
                  <Box mt={2}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        className={classes.tag}
                      />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
};

export default BlogList;
