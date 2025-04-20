import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { BlogPost } from "../../../interfaces/Blog";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowBack,
} from "@material-ui/icons";
import blogApi from "../../../api/blog";
import { useTranslation } from "react-i18next";
import { store } from "../../../context";
import { useGoogleProfile } from "../../../hooks/useGoogleProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  searchField: {
    marginBottom: theme.spacing(3),
    maxWidth: 400,
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    "& th": {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  actions: {
    display: "flex",
    gap: theme.spacing(1),
  },
  status: {
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    display: "inline-block",
  },
  published: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.text.primary,
  },
  draft: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
}));

const BlogAdminList: React.FC = () => {
  const {
    state: { userData },
  } = useContext(store);
  const classes = useStyles();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const [fullPosts, setFullPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useGoogleProfile();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userData?._id) return;
      try {
        const data = await blogApi.getAllPostsByUserAuthor(userData._id);
        console.log(data);
        if (data) {
          setFullPosts(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language, userData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const posts = fullPosts.map((post) => ({
    title:
      post.translations[language]?.title ||
      post.translations[post.defaultLanguage]?.title,
    excerpt:
      post.translations[language]?.excerpt ||
      post.translations[post.defaultLanguage]?.excerpt,
    tags: post.tags,
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString()
      : null,
    slug: post.slug,
    _id: post._id,
  }));

  const filteredPosts = searchTerm
    ? posts?.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : posts;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogApi.deletePost(id);
        setFullPosts(fullPosts.filter((post) => post._id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          Blog Posts Management
        </Typography>
        <Button
          component={Link}
          to="/admin-blog"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Create New Post
        </Button>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          color="primary"
          startIcon={<ArrowBack />}
        >
          Back to Home
        </Button>
      </Box>

      <TextField
        className={classes.searchField}
        fullWidth
        variant="outlined"
        placeholder="Search posts by title, excerpt, or tags..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Excerpt</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        
            {filteredPosts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.excerpt}</TableCell>
                <TableCell>
                  {post.tags?.map((tag) => (
                    <Box
                      key={tag}
                      component="span"
                      className={`${classes.status} ${classes.published}`}
                      style={{ marginRight: 8 }}
                    >
                      {tag}
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box className={classes.actions}>
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        to={`/admin-blog/${post.slug}`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(post._id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BlogAdminList;
