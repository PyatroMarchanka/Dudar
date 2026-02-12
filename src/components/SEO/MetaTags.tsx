import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { routes } from '../../router/routes';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  type?: string;
  language?: string;
  canonicalPath?: string;
}

const defaultMeta = {
  title: 'Duda Hero - Learn to Play Bagpipes | Interactive Music Education',
  description: 'Master bagpipes with Duda Hero - the ultimate interactive learning platform. Features Belarusian traditional bagpipes, Great Highland Bagpipes (Scotland), and German Dudelsack.',
  keywords: 'bagpipes, learn bagpipes, Highland bagpipes, Belarusian bagpipes, German dudelsack, bagpipe tutorial, interactive music',
  image: '/android-chrome-192x192.png'
};

const routeMeta = {
  [routes.main]: {
    title: 'Duda Hero - Learn Bagpipes Online | Interactive Bagpipe Player',
    description: 'Master bagpipes with Duda Hero\'s interactive learning platform. Play Belarusian traditional bagpipes, Great Highland Bagpipes, and German Dudelsack with MIDI support.',
    keywords: 'learn bagpipes, bagpipe lessons, Highland bagpipes, Belarusian dudka, interactive music learning'
  },
  [routes.app]: {
    title: 'Play Bagpipes Online - Interactive Bagpipe Player | Duda Hero',
    description: 'Play and learn bagpipes with our interactive player. Practice Belarusian traditional, Great Highland, and German bagpipes with real MIDI support.',
    keywords: 'play bagpipes online, bagpipe player, interactive bagpipes, learn bagpipe fingering, bagpipe practice'
  },
  [routes.about]: {
    title: 'About Duda Hero - Bagpipe Learning Platform',
    description: 'Learn about Duda Hero\'s innovative platform for learning to play bagpipes. Discover our interactive tutorials, types of bagpipes, and music education approach.',
    keywords: 'about bagpipes, bagpipe learning, music education, interactive learning, bagpipe types'
  },
  [routes.playlists]: {
    title: 'Bagpipe Songs & Playlists - Traditional Music Collection',
    description: 'Browse our collection of bagpipe songs across multiple languages. Practice with Belarusian, Scottish, and German bagpipe music.',
    keywords: 'bagpipe songs, bagpipe music, traditional bagpipes, bagpipe playlists, Belarusian music, Scottish music'
  },
  [routes.eduda]: {
    title: 'EDuda - Learn Bagpipe Fingering & Techniques',
    description: 'Interactive bagpipe tutorial featuring step-by-step lessons and practice exercises for all bagpipe types.',
    keywords: 'bagpipe tutorial, learn bagpipe fingering, bagpipe techniques, bagpipe lessons, how to play bagpipes'
  },
  [routes.learningBook]: {
    title: 'Bagpipe Learning Guide - Complete Tutorial & Resources',
    description: 'Comprehensive learning resources for bagpipe players. Study guides, fingering charts, and traditional bagpipe techniques.',
    keywords: 'bagpipe guide, bagpipe learning, bagpipe fingering charts, traditional bagpipes, bagpipe education'
  }
};

export const MetaTags: React.FC<MetaTagsProps> = ({ 
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  type = 'website',
  language = 'en',
  canonicalPath
}) => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const routeSpecificMeta = routeMeta[currentRoute] || {};

  const finalTitle = routeSpecificMeta.title || title;
  const finalDescription = routeSpecificMeta.description || description;
  const finalKeywords = routeSpecificMeta.keywords || keywords;
  const finalImage = image;
  const canonicalUrl = canonicalPath || currentRoute;

  // Generate hreflang links for multi-language support
  const languages = ['en', 'be', 'pl'];
  const hreflangLinks = languages.map(lang => {
    let href = `https://dudahero.org${canonicalUrl}`;
    // For blog/article routes with language parameter
    if (canonicalUrl.includes(':lang')) {
      href = `https://dudahero.org${canonicalUrl}`.replace(':lang', lang);
    }
    return { rel: 'alternate', hrefLang: lang, href };
  });

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="language" content={language} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`https://dudahero.org${canonicalUrl}`} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`https://dudahero.org${finalImage}`} />
      <meta property="og:locale" content={language === 'be' ? 'be_BY' : language === 'pl' ? 'pl_PL' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://dudahero.org${canonicalUrl}`} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={`https://dudahero.org${finalImage}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://dudahero.org${canonicalUrl}`} />
      
      {/* hreflang for multi-language support */}
      {hreflangLinks.map((link, index) => (
        <link key={index} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href="https://dudahero.org/" />
    </Helmet>
  );
}; 