import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_TAB, SITE_LANG } from "../consts";
import { marked } from 'marked';

export async function GET(context: any) {
  const posts = await getCollection("blog");
  const sortedPosts = posts.sort((a: any, b: any) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post: any) => ({
      title: `<![CDATA[${post.data.title}]]>`,
      description: `<![CDATA[${post.data.description}]]>`,
      link: `/blog/${post.slug}/`,
      guid: `${context.site}/blog/${post.slug}/`,
      content: `<blockquote>该渲染由 Frosti Feed 自动生成，可能存在排版问题，最佳体验请前往：<a href="${context.site}/blog/${post.slug}/">${context.site}/blog/${post.slug}/</a></blockquote> <![CDATA[${marked(post.body)}]]>`,
      customData: `
        <dc:creator><![CDATA[${SITE_TAB}]]></dc:creator>
        <pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
      `,
    })),
    customData: `
      <language>${SITE_LANG}</language>
    `,
    xmlns: {
      'dc': "http://purl.org/dc/elements/1.1/",
      'content': "http://purl.org/rss/1.0/modules/content/",
      'atom': "http://www.w3.org/2005/Atom",
      version: "2.0",
    },
  });
}
