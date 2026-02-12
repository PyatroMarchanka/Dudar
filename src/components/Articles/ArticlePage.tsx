import { useParams, Link, useHistory } from 'react-router-dom';
import type { Article as BlogPostType } from '../../interfaces/article';
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { CalendarToday, Person, Update, ArrowBack, Add, Edit } from '@material-ui/icons';
import articlesApi from '../../api/articles';
import { useGoogleProfile } from '../../hooks/useGoogleProfile';
import { store } from '../../context';
import LanguageSelector from '../Controls/LanguageSelector';
import { routes } from '../../router/routes';
import { MetaTags } from '../SEO/MetaTags';
import { StructuredData } from '../SEO/StructuredData';
import { useContext, useEffect, useState } from 'react';
import { IconLanguageSelector } from '../Controls/LanguageSelector/IconLanguageSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 900,
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    marginBottom: theme.spacing(6),
    textAlign: 'center',
    position: 'relative',
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    letterSpacing: '-0.02em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  meta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(3),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  tag: {
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  featuredImage: {
    width: '100%',
    maxHeight: 500,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(6),
    boxShadow: theme.shadows[4],
  },
  content: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '& h2': {
      color: theme.palette.primary.main,
      margin: `${theme.spacing(6)}px 0 ${theme.spacing(2)}px`,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    '& p': {
      marginBottom: theme.spacing(3),
      lineHeight: 1.8,
      fontSize: '1.1rem',
      color: theme.palette.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    '& ul, & ol': {
      marginBottom: theme.spacing(3),
      paddingLeft: theme.spacing(4),
      '& li': {
        marginBottom: theme.spacing(1.5),
        lineHeight: 1.8,
        fontSize: '1.1rem',
        color: theme.palette.text.primary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      margin: theme.spacing(4, 0),
      padding: theme.spacing(2, 4),
      backgroundColor: theme.palette.background.default,
      fontStyle: 'italic',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      '& p': {
        margin: 0,
        fontSize: '1.2rem',
        color: theme.palette.text.secondary,
      },
    },
    '& code': {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  notFound: {
    textAlign: 'center',
    padding: theme.spacing(6),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  languageSelector: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  languageSelect: {
    minWidth: 120,
  },
  languageIcon: {
    color: theme.palette.primary.main,
  },
}));

const ArticlePage: React.FC = () => {
  const {
    state: { userData, language: currentLanguage },
  } = useContext(store);
  const history = useHistory();
  const classes = useStyles();
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();
  const language = lang || i18n.language;

  useGoogleProfile();

  useEffect(() => {
    if (currentLanguage !== lang) {
      history.push(`${routes.article}/${currentLanguage}/${slug}`);
    }
  }, [currentLanguage, lang, slug, history]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await articlesApi.getPostBySlug(slug);
        setPost(post);
      } catch (error) {
        console.error('Error fetching blog post:', error);
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
          {t('blog.page.notFound')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('blog.page.notFoundText')}
        </Typography>
      </Paper>
    );
  }

  const currentTranslation = post.translations[language] || post.translations[post.defaultLanguage];

  const metaDescription =
    currentTranslation.metaDescription ||
    currentTranslation.excerpt ||
    'Learn about bagpipes with Duda Hero - interactive bagpipe tutorial';
  const metaKeywords = currentTranslation.metaKeywords?.join(', ') || 'bagpipes, learn bagpipes, bagpipe tutorial';
  const canonicalPath = `/article/${language}/${slug}`;

  return (
    <>
      <MetaTags
        title={`${currentTranslation.title} | Duda Hero`}
        description={metaDescription}
        keywords={metaKeywords}
        image={post.featuredImage || '/android-chrome-192x192.png'}
        language={language}
        canonicalPath={canonicalPath}
        type="article"
      />
      <StructuredData
        articleData={{
          title: currentTranslation.title,
          description: metaDescription,
          image: post.featuredImage,
          author: post.author,
          publishedDate: post.publishedAt || post.createdAt,
          modifiedDate: post.updatedAt,
          tags: post.tags,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Learning Book', url: routes.learningBook },
          { name: currentTranslation.title, url: canonicalPath },
        ]}
      />
      <Container className={classes.root}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Link to={routes.learningBook} style={{ textDecoration: 'none' }}>
            <IconButton>
              <ArrowBack color="primary" />
            </IconButton>
          </Link>
          <IconLanguageSelector />
          {userData?.isAdmin && (
            <Link to={`${routes.articleUpdate}/${post.slug}`} style={{ textDecoration: 'none' }}>
              <IconButton>
                <Edit color="primary" />
              </IconButton>
            </Link>
          )}
        </Box>
        <Box className={classes.header}>
          <Typography variant="h2" component="h1" className={classes.title}>
            {currentTranslation.title}
          </Typography>
          <Box className={classes.meta}>
            <Tooltip title={t('blog.author') as string}>
              <Box className={classes.metaItem}>
                {post.author?.picture ? (
                  <img src={post.author.picture} alt={post.author.name} className={classes.avatar} />
                ) : (
                  <Person fontSize="small" />
                )}
                <Typography variant="body1">{post.author?.name}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title={t('blog.publishedDate') as string}>
              <Box className={classes.metaItem}>
                <CalendarToday fontSize="small" />
                <Typography variant="body1">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
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
          <img src={post.featuredImage} alt={currentTranslation.title} className={classes.featuredImage} />
        )}
        <Box className={classes.content} dangerouslySetInnerHTML={{ __html: currentTranslation.content }} />
      </Container>
    </>
  );
};

export default ArticlePage;
