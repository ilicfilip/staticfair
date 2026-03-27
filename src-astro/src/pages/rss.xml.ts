import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  return rss({
    title: 'FAIR — Federated and Independent Repositories',
    description:
      'News, release notes, and updates from the FAIR project — building an open ecosystem of federated package repositories for WordPress and beyond.',
    site: context.site!,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
