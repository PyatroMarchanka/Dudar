import React from 'react';
import { Helmet } from 'react-helmet';
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

export const StructuredData: React.FC<StructuredDataProps> = ({ 
  articleData,
  breadcrumbs
}) => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const routeSchema = routeSchemas[currentRoute] || defaultSchema;

  const schemas: Record<string, any>[] = [routeSchema, getOrganizationSchema()];
  
  if (articleData) {
    schemas.push(getArticleSchema(articleData));
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