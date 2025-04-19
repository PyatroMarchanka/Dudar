import React, { useState } from "react";
import type { BlogPost, BlogPostTranslation } from "../../../interfaces/Blog";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
} from "@material-ui/icons";
import blogApi from "../../../api/blog";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  form: {
    marginBottom: theme.spacing(4),
  },
  formGroup: {
    marginBottom: theme.spacing(3),
  },
  languageSelector: {
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  languageSelect: {
    minWidth: 120,
  },
  translationForm: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  translationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  actions: {
    display: "flex",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

const BlogAdmin: React.FC = () => {
  const classes = useStyles();
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [post, setPost] = useState<Partial<BlogPost>>({
    translations: {
      en: {
        title: "",
        content: "",
        excerpt: "",
        metaDescription: "",
        metaKeywords: [],
      },
    },
    defaultLanguage: "en",
    tags: [],
  });

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCurrentLanguage(event.target.value as string);
  };

  const handleAddLanguage = () => {
    const newLanguage = prompt('Enter language code (e.g., "es" for Spanish):');
    if (newLanguage && !post.translations?.[newLanguage]) {
      const newTranslation: BlogPostTranslation = {
        title: "",
        content: "",
        excerpt: "",
        metaDescription: "",
        metaKeywords: [],
      };
      setPost({
        ...post,
        translations: {
          ...post.translations,
          [newLanguage]: newTranslation,
        },
      });
      setCurrentLanguage(newLanguage);
    }
  };

  const handleRemoveLanguage = (language: string) => {
    if (language === post.defaultLanguage) {
      alert("Cannot remove the default language");
      return;
    }
    const { [language]: removed, ...remaining } = post.translations || {};
    setPost({
      ...post,
      translations: remaining,
    });
    if (currentLanguage === language) {
      setCurrentLanguage(post.defaultLanguage || "en");
    }
  };

  const handleTranslationChange = (
    field: keyof BlogPostTranslation,
    value: string | string[]
  ) => {
    if (!post.translations?.[currentLanguage]) return;

    setPost({
      ...post,
      translations: {
        ...post.translations,
        [currentLanguage]: {
          ...post.translations[currentLanguage],
          [field]: value,
        },
      },
    });
  };

  const handleTagsChange = (value: string) => {
    setPost({
      ...post,
      tags: value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleSave = async () => {
    await blogApi.createPost(post);
    alert("Post saved successfully");
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Blog Post Editor
      </Typography>

      <Paper className={classes.form}>
        <Box className={classes.languageSelector}>
          <LanguageIcon color="primary" />
          <FormControl variant="outlined" className={classes.languageSelect}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={currentLanguage}
              onChange={handleLanguageChange}
              label="Language"
            >
              {Object.keys(post.translations || {}).map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Add new language">
            <IconButton onClick={handleAddLanguage} color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className={classes.translationForm}>
          <Box className={classes.translationHeader}>
            <Typography variant="h6">
              {currentLanguage.toUpperCase()} Translation
            </Typography>
            {currentLanguage !== post.defaultLanguage && (
              <Tooltip title="Remove language">
                <IconButton
                  onClick={() => handleRemoveLanguage(currentLanguage)}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={post.translations?.[currentLanguage]?.title || ""}
                onChange={(e) =>
                  handleTranslationChange("title", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Excerpt"
                value={post.translations?.[currentLanguage]?.excerpt || ""}
                onChange={(e) =>
                  handleTranslationChange("excerpt", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={10}
                label="Content"
                value={post.translations?.[currentLanguage]?.content || ""}
                onChange={(e) =>
                  handleTranslationChange("content", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                value={
                  post.translations?.[currentLanguage]?.metaDescription || ""
                }
                onChange={(e) =>
                  handleTranslationChange("metaDescription", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Keywords (comma-separated)"
                value={
                  post.translations?.[currentLanguage]?.metaKeywords?.join(
                    ", "
                  ) || ""
                }
                onChange={(e) =>
                  handleTranslationChange(
                    "metaKeywords",
                    e.target.value.split(",").map((k) => k.trim())
                  )
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={post.tags?.join(", ") || ""}
            onChange={(e) => handleTagsChange(e.target.value)}
          />
        </Box>

        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Post
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogAdmin;
