import React, { useState } from "react";
import type { Article, ArticleTranslation } from "../../../interfaces/article";
import {
  Box,
  Paper,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
} from "@material-ui/icons";
import SingleLanguageForm from "./SingleLanguageForm";
import { Languages } from "../../../interfaces";
import { useTranslation } from "react-i18next";

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
  accordion: {
    marginBottom: theme.spacing(2),
    "&:before": {
      display: "none",
    },
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius * 2,
    "&.Mui-expanded": {
      marginBottom: theme.spacing(2),
    },
  },
  accordionSummary: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 2,
    "&.Mui-expanded": {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  accordionDetails: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
  languageHeader: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
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
}));

interface BlogPostFormProps {
  initialPost?: Partial<Article>;
  onSubmit: (post: Partial<Article>) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const getInitialTranslations = (): Partial<Article> => ({
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
});

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  initialPost,
  onSubmit,
  onCancel,
  submitButtonText = "Save Post",
  showDeleteButton = false,
  onDelete,
}) => {
  const { t } = useTranslation()
  const classes = useStyles();
  const defaultPost = getInitialTranslations();
  const [post, setPost] = useState<Partial<Article>>(
    initialPost
      ? {
        ...defaultPost,
        ...initialPost,
        translations: {
          ...defaultPost.translations,
          ...initialPost.translations,
        },
      }
      : defaultPost
  );

  const handleTranslationChange = (
    language: string,
    field: keyof ArticleTranslation,
    value: string | string[]
  ) => {
    setPost((prevPost) => {
      const translations = prevPost.translations || {};
      const currentTranslation = translations[language] || {
        title: "",
        content: "",
        excerpt: "",
        metaDescription: "",
        metaKeywords: [],
        tags: [],
      };

      return {
        ...prevPost,
        translations: {
          ...translations,
          [language]: {
            ...currentTranslation,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(post);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const availableLanguages = Object.values(Languages).map((lang) => ({
    label: t(`languages.${lang}`),
    value: lang,
  }));

  return (
    <Paper className={classes.form}>
      {availableLanguages.map((language) => {
        const translation =
          post.translations?.[language.value] || {
            title: "",
            content: "",
            excerpt: "",
            metaDescription: "",
            metaKeywords: [],
            tags: [],
          };

        return (
          <Accordion
            key={language.value}
            className={classes.accordion}
            defaultExpanded={language.value === Languages.Belarusian}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box className={classes.languageHeader}>
                <LanguageIcon color="primary" />
                <Typography variant="h6">
                  {language.label}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <SingleLanguageForm
                language={language.value}
                translation={translation}
                onChange={(field, value) =>
                  handleTranslationChange(language.value, field, value)
                }
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
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
