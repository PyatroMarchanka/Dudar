import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import type { BlogPost as BlogPostType } from "../../interfaces/Blog";
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Tooltip,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  CalendarToday,
  Person,
  Update,
  ArrowBack,
  Add,
} from "@material-ui/icons";
import blogApi from "../../api/blog";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { store } from "../../context";
import LanguageSelector from "../Controls/LanguageSelector";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 900,
    margin: "0 auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    marginBottom: theme.spacing(6),
    textAlign: "center",
    position: "relative",
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    letterSpacing: "-0.02em",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.5rem",
    },
  },
  meta: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(3),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    flexWrap: "wrap",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  author: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
  },
  tags: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  tag: {
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  featuredImage: {
    width: "100%",
    maxHeight: 500,
    objectFit: "cover",
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(6),
    boxShadow: theme.shadows[4],
  },
  content: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "& h2": {
      color: theme.palette.primary.main,
      margin: `${theme.spacing(6)}px 0 ${theme.spacing(2)}px`,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    "& p": {
      marginBottom: theme.spacing(3),
      lineHeight: 1.8,
      fontSize: "1.1rem",
      color: theme.palette.text.primary,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    "& ul, & ol": {
      marginBottom: theme.spacing(3),
      paddingLeft: theme.spacing(4),
      "& li": {
        marginBottom: theme.spacing(1.5),
        lineHeight: 1.8,
        fontSize: "1.1rem",
        color: theme.palette.text.primary,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },
    "& blockquote": {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      margin: theme.spacing(4, 0),
      padding: theme.spacing(2, 4),
      backgroundColor: theme.palette.background.default,
      fontStyle: "italic",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      "& p": {
        margin: 0,
        fontSize: "1.2rem",
        color: theme.palette.text.secondary,
      },
    },
    "& code": {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  notFound: {
    textAlign: "center",
    padding: theme.spacing(6),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  languageSelector: {
    marginBottom: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
  },
  languageSelect: {
    minWidth: 120,
  },
  languageIcon: {
    color: theme.palette.primary.main,
  },
}));

const BlogPost: React.FC = () => {
  const {
    state: { userData, language: currentLanguage },
  } = useContext(store);
  const history = useHistory();
  const classes = useStyles();
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const language = lang || i18n.language;

  useGoogleProfile();

  useEffect(() => {
    if (currentLanguage !== lang) {
      history.push(`/blog/${currentLanguage}/${slug}`);
    }
  }, [currentLanguage, lang, slug, history]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await blogApi.getPostBySlug(slug);
        setPost(post);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, language]);

  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!post) {
    return (
      <Paper className={classes.notFound}>
        <Typography variant="h4" gutterBottom>
          Post Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The blog post you're looking for doesn't exist or has been removed.
        </Typography>
      </Paper>
    );
  }

  const currentTranslation =
    post.translations[language] || post.translations[post.defaultLanguage];

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBack />}
          variant="outlined"
          color="primary"
        >
          Blogs
        </Button>
        <LanguageSelector />
        {userData?.email && (
          <Box>
            <Button
              component={Link}
              to="/admin-blog-list"
              startIcon={<Add />}
              variant="outlined"
              color="primary"
              style={{ marginRight: 8 }}
            >
              Manage Posts
            </Button>
            <Button
              component={Link}
              to={`/admin-blog/${post._id}`}
              startIcon={<Update />}
              variant="outlined"
              color="primary"
            >
              Edit Post
            </Button>
          </Box>
        )}
      </Box>
      <Box className={classes.header}>
        <Typography variant="h2" component="h1" className={classes.title}>
          {currentTranslation.title}
        </Typography>
        <Box className={classes.meta}>
          <Tooltip title="Author">
            <Box className={classes.metaItem}>
              {post.author?.picture ? (
                <img
                  src={post.author.picture}
                  alt={post.author.name}
                  className={classes.avatar}
                />
              ) : (
                <Person fontSize="small" />
              )}
              <Typography variant="body1">{post.author?.name}</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Published Date">
            <Box className={classes.metaItem}>
              <CalendarToday fontSize="small" />
              <Typography variant="body1">
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString()}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Box className={classes.tags}>
          {post?.tags?.map((tag) => (
            <Chip key={tag} label={tag} className={classes.tag} clickable />
          ))}
        </Box>
      </Box>

      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={currentTranslation.title}
          className={classes.featuredImage}
        />
      )}

      <Box
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: currentTranslation.content }}
      />
    </Container>
  );
};

export default BlogPost;
