import { Helmet } from 'react-helmet-async';

export default function PageSEO({ title, description, canonical, schema }) {
  const baseUrl = 'https://skillcite.com';
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${baseUrl}${canonical}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${baseUrl}${canonical}`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
