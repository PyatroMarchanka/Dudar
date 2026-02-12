import React from 'react';
import { Link } from 'react-router-dom';
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
  Button,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../Controls/LanguageSelector';
import { ArrowBack } from '@material-ui/icons';
import { useArticlesPreviews } from '../../hooks/useArticles';
import { mainColors } from '../../utils/theme';
import { IconLanguageSelector } from '../Controls/LanguageSelector/IconLanguageSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    minHeight: '100vh',
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    color: mainColors.darkerGray,
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
    },
  },
  media: {
    height: 200,
    objectFit: 'cover',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
  cardContent: {
    flexGrow: 1,
    background: 'rgba(255, 255, 255, 0.05)',
  },
  excerpt: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(2),
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  tag: {
    margin: theme.spacing(0.5),
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  postTitle: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    fontSize: '1.25rem',
  },
}));

export const ArticlesList: React.FC = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { articlesPreviews, loading } = useArticlesPreviews(language);
  console.log('posts', articlesPreviews);
  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: 16 }}>
          {t('blog.loading')}
        </Typography>
      </Box>
    );
  }

  if (articlesPreviews.length === 0) {
    return (
      <Container className={classes.root}>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Button component={Link} to="/" startIcon={<ArrowBack />} variant="outlined" className={classes.backButton}>
            {t('blog.backToBlog')}
          </Button>
          <LanguageSelector />
        </Box>
        <Typography variant="h3" component="h3" className={classes.title}>
          {t('blog.title')}
        </Typography>
        <Typography variant="body1" align="center">
          {t('blog.noPosts')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h4" className={classes.title}>
          {t('blog.latestPosts')}
        </Typography>
        <IconLanguageSelector />
      </Box>
      <Grid container spacing={4}>
        {articlesPreviews.filter((post) => post.title).map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4}>
            <div className={classes.card}>
              <CardActionArea component={Link} to={`/article/${language}/${post.slug}`}>
                {post.featuredImage && (
                  <CardMedia className={classes.media} image={post.featuredImage} title={post.title} />
                )}
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.postTitle}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" className={classes.excerpt} component="p">
                    {post.excerpt}
                  </Typography>
                  <Box mt={2}>
                    {post.tags.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" className={classes.tag} />
                    ))}
                  </Box>
                  <Box mt={2} className={classes.meta}>
                    <Box display="flex" alignItems="center">
                      {post.author?.picture ? (
                        <Avatar
                          src={post.author.picture}
                          alt={post.author.name}
                          style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                      ) : null}
                      <Typography variant="caption">
                        {t('blog.author')}: {post.author?.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      {t('blog.published')}: {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
