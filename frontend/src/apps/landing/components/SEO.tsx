import React from 'react';


interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}


const SEO: React.FC<SEOProps> = ({ title, description, url, image }) => {
  React.useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
    if (url) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', url);
    }
    // Open Graph tags
    const setMeta = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property='${property}']`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    setMeta('og:title', title);
    setMeta('og:description', description);
    if (image) setMeta('og:image', image);
    if (url) setMeta('og:url', url);
    setMeta('og:type', 'website');
    // Twitter tags
    const setTwitter = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name='${name}']`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', title);
    setTwitter('twitter:description', description);
    if (image) setTwitter('twitter:image', image);
  }, [title, description, url, image]);
  return null;
};

export default SEO;



