import React from "react";
import type { ArticleTranslation } from "../../../interfaces/article";
import {
  Box,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  translationForm: {
    padding: theme.spacing(2),
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

interface SingleLanguageFormProps {
  language: string;
  translation: ArticleTranslation;
  onChange: (field: keyof ArticleTranslation, value: string | string[]) => void;
}

const SingleLanguageForm: React.FC<SingleLanguageFormProps> = ({
  language,
  translation,
  onChange,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.translationForm}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("blog.form.title")}
            value={translation.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            className={classes.textField}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label={t("blog.form.excerpt")}
            value={translation.excerpt ?? ""}
            onChange={(e) => onChange("excerpt", e.target.value)}
            className={classes.textField}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <ReactQuill
            theme="snow"
            value={translation.content ?? ""}
            onChange={(content) => onChange("content", content)}
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
            label={t("blog.form.metaDescription")}
            value={translation.metaDescription || ""}
            onChange={(e) => onChange("metaDescription", e.target.value)}
            className={classes.textField}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("blog.form.metaKeywords")}
            value={translation.metaKeywords?.join(", ") || ""}
            onChange={(e) =>
              onChange(
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
            label={t("blog.form.tags")}
            value={translation.tags?.join(", ") || ""}
            onChange={(e) =>
              onChange(
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
  );
};

export default SingleLanguageForm;

