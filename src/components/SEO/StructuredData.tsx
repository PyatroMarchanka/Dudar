import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { routes } from '../../router/routes';
import { currentBrand } from '../../brand';

const { name: brandName, siteUrl, description: brandDescription, instrumentNoun } = currentBrand;

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
    lyrics?: string;
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
  "name": brandName,
  "url": siteUrl,
  "logo": `${siteUrl}/android-chrome-192x192.png`,
  "description": brandDescription,
  "sameAs": [
    "https://www.facebook.com/dudahero",
    "https://twitter.com/dudahero"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "url": `${siteUrl}/contacts`
  }
});

const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": brandName,
  "description": brandDescription,
  "url": siteUrl,
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
    "name": brandName,
    "url": siteUrl,
    "description": brandDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/app?search={search_term_string}`,
      "query-input": "required name=search_term_string"
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
  "image": articleData!.image ? `${siteUrl}${articleData!.image}` : `${siteUrl}/android-chrome-192x192.png`,
  "datePublished": articleData!.publishedDate,
  "dateModified": articleData!.modifiedDate || articleData!.publishedDate,
  "author": {
    "@type": "Person",
    "name": articleData!.author.name,
    "image": articleData!.author.picture ? `${siteUrl}${articleData!.author.picture}` : undefined
  },
  "publisher": {
    "@type": "Organization",
    "name": brandName,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/android-chrome-192x192.png`
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
    "item": `${siteUrl}${item.url}`
  }))
});

const getSongSchema = (songData: StructuredDataProps['songData']): Record<string, any>[] => {
  const song = songData!;
  const composition: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "name": song.name,
    "genre": song.genre,
    "description": song.description || `Learn to play ${song.name} on ${instrumentNoun}`,
    "url": `${siteUrl}${song.url}`,
    "isAccessibleForFree": true,
  };
  if (song.lyrics) {
    composition.lyrics = { "@type": "CreativeWork", "text": song.lyrics };
  }
  return [composition];
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