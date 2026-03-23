// Base Organization Schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://superproservices.com.au/#organization",
  "name": "SuperPro Services",
  "alternateName": "SuperPro Services Pty Ltd",
  "url": "https://superproservices.com.au",
  "logo": "https://superproservices.com.au/logo.png",
  "image": [
    "https://superproservices.com.au/images/home-3.jpg",
    "https://superproservices.com.au/images/home/home-1.jpg",
    "https://superproservices.com.au/images/home/home-2.jpg",
    "https://superproservices.com.au/images/team/our-team.jpg",
  ],
  "description": "Professional commercial and industrial cleaning services in Melbourne. Providing comprehensive facility management solutions.",
  "telephone": "1300424066",
  "email": "info@superproservices.com.au",
  "priceRange": "$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "",
    "addressLocality": "",
    "addressRegion": "VIC",
    "postalCode": "",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "",
    "longitude": ""
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    // Add your social media URLs here when available
    // "https://www.facebook.com/fbifacilitysolutions",
    // "https://www.linkedin.com/company/fbifacilitysolutions"
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "",
      "longitude": ""
    },
    "geoRadius": "50000"
  },
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial Cleaning Services",
        "description": "Professional commercial cleaning for offices, showrooms, and business facilities"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Industrial Cleaning Services",
        "description": "Industrial cleaning for factories, warehouses, and production facilities"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Aged Care Cleaning",
        "description": "Specialized cleaning services for aged care facilities with focus on infection control"
      }
    }
  ]
});

// Website Schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://superproservices.com.au/#website",
  "url": "https://superproservices.com.au",
  "name": "SuperPro Services",
  "description": "Professional Commercial Cleaning Services in Melbourne",
  "publisher": {
    "@id": "https://superproservices.com.au/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://superproservices.com.au/?s={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

// Breadcrumb Schema
export const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Service Schema
export const getServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": service.title,
  "provider": {
    "@id": "https://superproservices.com.au/#organization"
  },
  "areaServed": {
    "@type": "City",
    "name": "Melbourne"
  },
  "description": service.content
});