import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { routes } from '../../router/routes';

const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Duda Hero",
  "description": "Interactive platform for learning to play various types of bagpipes",
  "url": "https://dudahero.org",
  "applicationCategory": "MusicEducation",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Belarusian traditional bagpipes",
    "Great Highland Bagpipes (Scotland)",
    "German Dudelsack",
    "Interactive learning",
    "MIDI support"
  ]
};

const routeSchemas = {
  [routes.main]: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Duda Hero",
    "url": "https://dudahero.org",
    "description": "Interactive platform for learning to play various types of bagpipes",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dudahero.org/app?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  [routes.app]: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Duda Hero - Interactive Player",
    "description": "Interactive bagpipe player with learning features",
    "applicationCategory": "MusicEducation",
    "operatingSystem": "Web",
    "featureList": [
      "Interactive bagpipe player",
      "MIDI support",
      "Learning tools",
      "Multiple bagpipe types"
    ]
  },
  [routes.playlists]: {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Duda Hero Song Collection",
    "description": "Collection of bagpipe songs for practice and learning",
    "numTracks": "50+",
    "genre": ["Traditional", "Folk", "Bagpipe Music"]
  },
  [routes.eduda]: {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "EDuda - Interactive Bagpipe Learning",
    "description": "Interactive learning resource for bagpipe players",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tutorial"
  }
};

export const StructuredData: React.FC = () => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const routeSchema = routeSchemas[currentRoute] || defaultSchema;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(routeSchema)}
      </script>
    </Helmet>
  );
}; 