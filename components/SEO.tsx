
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  // Optional schema.org JSON-LD object (e.g. an Organization/NGO schema) —
  // stringified into a <script type="application/ld+json"> tag. Pass this on
  // the homepage (and any other page where a specific rich-result type makes
  // sense) to help Google understand the entity, not just the text.
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Bennu Rising International Foundation | Heal. Empower. Rise.",
  description = "Bennu Rising International Foundation is a non-profit dedicated to holistic healing, education, and social empowerment across India.",
  // Open Graph/Twitter images must be absolute URLs — a relative path like
  // "/logo1.png" won't resolve correctly when crawled by Facebook/WhatsApp/
  // Twitter bots, which don't know the page's origin the way a browser does.
  image = `${window.location.origin}/logo1.png`,
  // Canonical URL intentionally drops query strings (e.g. ?vid=8 on personalized
  // donate links) and hash fragments (e.g. #objectives anchor links) — those are
  // the same page/content as far as search engines should be concerned, and
  // letting them leak into the canonical would create near-duplicate URLs.
  url = `${window.location.origin}${window.location.pathname}`,
  structuredData
}) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
