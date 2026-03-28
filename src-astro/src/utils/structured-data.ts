/**
 * Structured data (JSON-LD) helper functions for SEO.
 *
 * All functions return plain objects. The `@context` is added only by
 * `buildGraph()` or when a single schema is serialised at the page level.
 */

// ── Constants ────────────────────────────────────────────────────────────────

export const SITE_URL = 'https://fair.pm';
export const SITE_NAME = 'FAIR';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;

// ── Schema Helpers ───────────────────────────────────────────────────────────

/** WebSite schema — used on the homepage. */
export function buildWebSite(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'FAIR is a next-generation, decentralized package manager for WordPress — trusted, transparent, and community-driven.',
  };
}

/** Organization schema — used on the homepage. */
export function buildOrganization(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    name: 'FAIR Package Manager',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'The Linux Foundation',
      url: 'https://www.linuxfoundation.org/',
    },
  };
}

/** BlogPosting schema — used on individual blog post pages. */
export function buildBlogPosting({
  title,
  description,
  datePublished,
  author,
  url,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  author: string;
  url: string;
  image?: string;
}): Record<string, unknown> {
  return {
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: new Date(datePublished).toISOString(),
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FAIR Package Manager',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: image ?? DEFAULT_OG_IMAGE,
    url,
  };
}

/** BreadcrumbList schema — last item omits `item` URL per Google spec. */
export function buildBreadcrumbs(
  items: Array<{ name: string; url?: string }>,
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => {
      const element: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name,
      };
      // Last item omits `item` property per Google structured data spec
      if (index < items.length - 1 && entry.url) {
        element.item = entry.url;
      }
      return element;
    }),
  };
}

/** WebPage schema — used on static (non-blog) pages. */
export function buildWebPage({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Wrap one or more schema objects in a JSON-LD `@graph` envelope.
 * Use this when a page needs multiple schema types (e.g. WebSite + Organization).
 */
export function buildGraph(
  ...schemas: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
