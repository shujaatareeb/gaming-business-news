import type { Topic } from "@/lib/mock-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Gaming industry business intelligence. Coverage of acquisitions, earnings, funding, and market shifts across the gaming industry.",
    foundingDate: "2026",
    actionableFeedbackPolicy: `${SITE_URL}/about`,
    masthead: `${SITE_URL}/about`,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function NewsArticleSchema({ topic }: { topic: Topic }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: topic.title,
    description: topic.summary,
    image: topic.image,
    datePublished: topic.published,
    dateModified: topic.published,
    url: `${SITE_URL}/story/${topic.id}`,
    mainEntityOfPage: `${SITE_URL}/story/${topic.id}`,
    author: {
      "@type": "Organization",
      name: "GamePulse Editorial",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: topic.category,
    isAccessibleForFree: true,
    citation: {
      "@type": "CreativeWork",
      name: topic.source,
      url: topic.link,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({ title, description, url }: { title: string; description: string; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
