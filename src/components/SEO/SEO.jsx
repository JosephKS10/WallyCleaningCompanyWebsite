import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "FBI Facility Solutions - Professional Commercial Cleaning Services Melbourne",
  description = "FBI Facility Solutions provides premium commercial cleaning, industrial cleaning, and facility management services throughout Melbourne. Family-owned since 2002. Call 1300 424 066.",
  keywords = "commercial cleaning Melbourne, industrial cleaning services, office cleaning Chadstone, facility management Melbourne, aged care cleaning, childcare cleaning, retail cleaning services",
  canonicalUrl,
  ogImage = "/images/team/our-team.jpg",
  ogType = "website",
  structuredData,
  noindex = false,
}) => {
  const siteUrl = "https://fbifacilitysolutions.com.au"; // Replace with your actual domain
  const fullCanonicalUrl = canonicalUrl || siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="FBI Facility Solutions" />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Geographic Tags */}
      <meta name="geo.region" content="AU-VIC" />
      <meta name="geo.placename" content="Melbourne" />
      <meta name="geo.position" content="-37.8136;145.0877" />
      <meta name="ICBM" content="-37.8136, 145.0877" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;