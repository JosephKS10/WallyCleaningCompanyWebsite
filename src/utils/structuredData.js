// Base Organization Schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://fbifacilitysolutions.com.au/#organization",
  "name": "FBI Facility Solutions",
  "alternateName": "FBI Facility Solutions Pty Ltd",
  "url": "https://fbifacilitysolutions.com.au",
  "logo": "https://fbifacilitysolutions.com.au/logo.png",
  "image": [
    "https://fbifacilitysolutions.com.au/images/home-3.jpg",
    "https://fbifacilitysolutions.com.au/images/home/home-1.jpg",
    "https://fbifacilitysolutions.com.au/images/home/home-2.jpg",
    "https://fbifacilitysolutions.com.au/images/team/our-team.jpg",
  ],
  "description": "Professional commercial and industrial cleaning services in Melbourne. Family-owned business providing comprehensive facility management solutions since 2002.",
  "telephone": "1300424066",
  "email": "info@fbifacilitysolution.com.au",
  "priceRange": "$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "45 Atkinson",
    "addressLocality": "Chadstone",
    "addressRegion": "VIC",
    "postalCode": "3148",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-37.8136",
    "longitude": "145.0877"
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
      "latitude": "-37.8136",
      "longitude": "145.0877"
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
  "@id": "https://fbifacilitysolutions.com.au/#website",
  "url": "https://fbifacilitysolutions.com.au",
  "name": "FBI Facility Solutions",
  "description": "Professional Commercial Cleaning Services in Melbourne",
  "publisher": {
    "@id": "https://fbifacilitysolutions.com.au/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://fbifacilitysolutions.com.au/?s={search_term_string}"
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
    "@id": "https://fbifacilitysolutions.com.au/#organization"
  },
  "areaServed": {
    "@type": "City",
    "name": "Melbourne"
  },
  "description": service.content
});