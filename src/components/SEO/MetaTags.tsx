import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { routes } from '../../router/routes';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
}

const defaultMeta = {
  title: 'Duda Hero - Learn to Play Bagpipes | Interactive Music Education',
  description: 'Master bagpipes with Duda Hero - the ultimate interactive learning platform. Features Belarusian traditional bagpipes, Great Highland Bagpipes (Scotland), and German Dudelsack.',
  image: '/android-chrome-192x192.png'
};

const routeMeta = {
  [routes.main]: {
    title: 'Duda Hero - Home | Interactive Bagpipe Learning Platform',
    description: 'Welcome to Duda Hero - your interactive platform for learning to play various types of bagpipes. Start your musical journey today!'
  },
  [routes.app]: {
    title: 'Duda Hero - Interactive Bagpipe Player',
    description: 'Play and learn bagpipes with our interactive player. Practice Belarusian traditional, Great Highland, and German Dudelsack bagpipes.'
  },
  [routes.about]: {
    title: 'About Duda Hero - Bagpipe Learning Platform',
    description: 'Learn about Duda Hero - the innovative platform for learning to play bagpipes. Discover our features, mission, and the types of bagpipes we support.'
  },
  [routes.playlists]: {
    title: 'Bagpipe Song Playlists - Duda Hero',
    description: 'Browse and play our collection of bagpipe songs. Practice with different types of bagpipes and improve your skills.'
  },
  [routes.eduda]: {
    title: 'EDuda - Interactive Bagpipe Learning',
    description: 'Learn to play bagpipes with our interactive EDuda feature. Step-by-step tutorials and practice exercises.'
  }
};

export const MetaTags: React.FC<MetaTagsProps> = ({ 
  title = defaultMeta.title,
  description = defaultMeta.description,
  image = defaultMeta.image
}) => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const routeSpecificMeta = routeMeta[currentRoute] || {};

  const finalTitle = routeSpecificMeta.title || title;
  const finalDescription = routeSpecificMeta.description || description;
  const finalImage = image;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://dudahero.org${currentRoute}`} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://dudahero.org${currentRoute}`} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://dudahero.org${currentRoute}`} />
    </Helmet>
  );
}; 