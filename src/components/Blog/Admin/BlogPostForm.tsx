import React, { useState } from "react";
import type { BlogPost, BlogPostTranslation } from "../../../interfaces/Blog";
import {
  Box,
  TextField,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Delete as DeleteIcon,
  Language as LanguageIcon,
} from "@material-ui/icons";
import { Languages } from "../../../interfaces";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const availableLanguages = Object.values(Languages);

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      boxShadow: theme.shadows[8],
    },
    backgroundColor: theme.palette.background.paper,
  },
  formGroup: {
    marginBottom: theme.spacing(4),
    "& .MuiTextField-root": {
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        "& .MuiOutlinedInput-root": {
          borderColor: theme.palette.primary.main,
        },
      },
    },
  },
  languageSelector: {
    marginBottom: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    "& .MuiSelect-root": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  languageSelect: {
    minWidth: 120,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.divider,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
  },
  translationForm: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.default,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
  translationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  actions: {
    display: "flex",
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(4),
    borderTop: `1px solid ${theme.palette.divider}`,
    "& .MuiButton-root": {
      padding: theme.spacing(1.5, 4),
      borderRadius: theme.shape.borderRadius * 2,
      textTransform: "none",
      fontWeight: 600,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    },
    "& .MuiButton-contained": {
      boxShadow: theme.shadows[2],
      "&:hover": {
        boxShadow: theme.shadows[4],
      },
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.shape.borderRadius * 2,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderWidth: 2,
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
  },
  editor: {
    height: "400px",
    marginBottom: theme.spacing(4),
    "& .ql-container": {
      height: "calc(100% - 42px)",
      fontSize: "16px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      borderBottomLeftRadius: theme.shape.borderRadius * 2,
      borderBottomRightRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.paper,
    },
    "& .ql-toolbar": {
      borderTopLeftRadius: theme.shape.borderRadius * 2,
      borderTopRightRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

interface BlogPostFormProps {
  initialPost?: Partial<BlogPost>;
  onSubmit: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const initialTranslations: Partial<BlogPost> = {
  translations: {
    ...Object.fromEntries(
      availableLanguages.map((lang) => [
        lang,
        {
          title: "",
          content: "",
          excerpt: "",
          metaDescription: "",
          metaKeywords: [],
          tags: [],
        },
      ])
    ),
  },
  defaultLanguage: "en",
  tags: [],
};

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  initialPost = initialTranslations,
  onSubmit,
  onCancel,
  submitButtonText = "Save Post",
  showDeleteButton = false,
  onDelete,
}) => {
  const classes = useStyles();

  const [currentLanguage, setCurrentLanguage] = useState<string>(
    initialPost.defaultLanguage!
  );
  const [post, setPost] = useState<Partial<BlogPost>>(initialPost);

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCurrentLanguage(event.target.value as string);
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
    setPost((prevPost) => {
      if (!prevPost.translations?.[currentLanguage]) return prevPost;

      return {
        ...prevPost,
        translations: {
          ...prevPost.translations,
          [currentLanguage]: {
            ...prevPost.translations[currentLanguage],
            [field]: value,
          },
        },
      };
    });
  };

  const handleTagsChange = (value: string) => {
    setPost({
      ...post,
      tags: value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(post);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
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
            {availableLanguages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              onChange={(e) => handleTranslationChange("title", e.target.value)}
              className={classes.textField}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Excerpt"
              value={post.translations?.[currentLanguage]?.excerpt ?? ""}
              onChange={(e) =>
                handleTranslationChange("excerpt", e.target.value)
              }
              className={classes.textField}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <ReactQuill
              theme="snow"
              value={post.translations?.[currentLanguage]?.content ?? ""}
              onChange={(content) =>
                handleTranslationChange("content", content)
              }
              className={classes.editor}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
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
              className={classes.textField}
              variant="outlined"
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
              className={classes.textField}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={
                post?.translations?.[currentLanguage]?.tags?.join(", ") || ""
              }
              onChange={(e) =>
                handleTranslationChange(
                  "tags",
                  e.target.value.split(",").map((k) => k.trim())
                )
              }
              className={classes.textField}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.actions}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {submitButtonText}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {showDeleteButton && onDelete && (
          <Button variant="outlined" color="secondary" onClick={onDelete}>
            Delete Post
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default BlogPostForm;
