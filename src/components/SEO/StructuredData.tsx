import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { routes } from '../../router/routes';

interface StructuredDataProps {
  articleData?: {
    title: string;
    description: string;
    image?: string;
    author: {
      name: string;
      picture?: string;
    };
    publishedDate: string;
    modifiedDate?: string;
    tags: string[];
  };
  songData?: {
    name: string;
    genre: string;
    description?: string;
    bagpipeTypes: string[];
    timeSignature: string;
    tempo?: number;
    tags: string[];
    transcribedBy?: string;
    url: string;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Duda Hero",
  "url": "https://dudahero.org",
  "logo": "https://dudahero.org/android-chrome-192x192.png",
  "description": "Interactive platform for learning to play various types of bagpipes",
  "sameAs": [
    "https://www.facebook.com/dudahero",
    "https://twitter.com/dudahero"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "url": "https://dudahero.org/contacts"
  }
});

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
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120",
      "bestRating": "5",
      "worstRating": "1"
    }
  },
  [routes.app]: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Duda Hero - Interactive Bagpipe Player",
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
    "name": "Duda Hero Bagpipe Song Collection",
    "description": "Collection of bagpipe songs across multiple languages for practice and learning",
    "numTracks": "50+",
    "genre": ["Traditional", "Folk", "Bagpipe Music"],
    "inLanguage": ["en", "be", "pl"]
  },
  [routes.eduda]: {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "EDuda - Interactive Bagpipe Learning",
    "description": "Interactive learning resource for bagpipe players with step-by-step tutorials",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tutorial",
    "inLanguage": ["en", "be", "pl"]
  },
  [routes.learningBook]: {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Bagpipe Learning Guide",
    "description": "Comprehensive learning resources for bagpipe players with guides and tutorials",
    "provider": {
      "@type": "Organization",
      "name": "Duda Hero"
    },
    "educationalLevel": "Beginner to Advanced",
    "inLanguage": ["en", "be", "pl"]
  }
};

const getArticleSchema = (articleData: StructuredDataProps['articleData']): Record<string, any> => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": articleData!.title,
  "description": articleData!.description,
  "image": articleData!.image ? `https://dudahero.org${articleData!.image}` : "https://dudahero.org/android-chrome-192x192.png",
  "datePublished": articleData!.publishedDate,
  "dateModified": articleData!.modifiedDate || articleData!.publishedDate,
  "author": {
    "@type": "Person",
    "name": articleData!.author.name,
    "image": articleData!.author.picture ? `https://dudahero.org${articleData!.author.picture}` : undefined
  },
  "publisher": {
    "@type": "Organization",
    "name": "Duda Hero",
    "logo": {
      "@type": "ImageObject",
      "url": "https://dudahero.org/android-chrome-192x192.png"
    }
  },
  "keywords": articleData!.tags?.join(", ") || "bagpipes, learning"
});

const getBreadcrumbSchema = (breadcrumbs: StructuredDataProps['breadcrumbs']) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs!.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://dudahero.org${item.url}`
  }))
});

const getSongSchema = (songData: StructuredDataProps['songData']): Record<string, any>[] => {
  const musicRecordingSchema = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": songData!.name,
    "genre": songData!.genre,
    "description": songData!.description || `Learn to play ${songData!.name} on bagpipes`,
    "url": `https://dudahero.org${songData!.url}`,
    "keywords": [
      songData!.name,
      `${songData!.name} bagpipe`,
      `${songData!.name} tutorial`,
      `how to play ${songData!.name}`,
      `${songData!.name} bagpipe tutorial`,
      `learn ${songData!.name}`,
      ...songData!.bagpipeTypes.map(type => `${songData!.name} ${type}`),
      ...songData!.tags,
      "bagpipe tutorial",
      "bagpipe lesson",
      "learn bagpipes"
    ].join(", "),
    "inLanguage": "en",
    "byArtist": songData!.transcribedBy ? {
      "@type": "Person",
      "name": songData!.transcribedBy
    } : undefined
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Play ${songData!.name} on Bagpipes`,
    "description": `Interactive tutorial for learning to play ${songData!.name} on bagpipes. Step-by-step guide with MIDI support and multiple bagpipe types.`,
    "url": `https://dudahero.org${songData!.url}`,
    "image": "https://dudahero.org/android-chrome-192x192.png",
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "tool": songData!.bagpipeTypes.map(type => ({
      "@type": "HowToTool",
      "name": type
    })),
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select your bagpipe type",
        "text": `Choose from ${songData!.bagpipeTypes.join(", ")} to play ${songData!.name}`,
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Learn the melody",
        "text": `Follow the interactive player to learn the notes and fingering for ${songData!.name}`,
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Practice with MIDI",
        "text": "Use the MIDI player to practice along with the music",
        "position": 3
      }
    ],
    "about": {
      "@type": "Thing",
      "name": "Bagpipe Playing"
    },
    "teach": true
  };

  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": `${songData!.name} - Bagpipe Tutorial`,
    "description": `Interactive tutorial for learning ${songData!.name} on bagpipes with step-by-step guidance`,
    "url": `https://dudahero.org${songData!.url}`,
    "learningResourceType": ["Interactive Tutorial", "Music Lesson"],
    "educationalLevel": "Beginner to Advanced",
    "interactivityType": "active",
    "isAccessibleForFree": true,
    "inLanguage": "en",
    "teaches": `How to play ${songData!.name} on bagpipes`,
    "about": [
      {
        "@type": "Thing",
        "name": "Bagpipe Music"
      },
      {
        "@type": "Thing",
        "name": songData!.genre
      }
    ]
  };

  return [musicRecordingSchema, howToSchema, learningResourceSchema];
};

export const StructuredData: React.FC<StructuredDataProps> = ({ 
  articleData,
  songData,
  breadcrumbs
}) => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const routeSchema = routeSchemas[currentRoute] || defaultSchema;

  const schemas: Record<string, any>[] = [getOrganizationSchema()];
  
  // Only add route schema if it's not a song page (song schema is more specific)
  if (!songData) {
    schemas.push(routeSchema);
  }
  
  if (articleData) {
    schemas.push(getArticleSchema(articleData));
  }

  if (songData) {
    schemas.push(...getSongSchema(songData));
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(getBreadcrumbSchema(breadcrumbs));
  }

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}; 