import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const blogs = await getCollection("blog");
  const sortedblogs = blogs.sort((a: any, b: any) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());
  return rss({
    title: "SaroProck",
    description: "Personal blog about technology, programming, and life.",
    site: context.site,
    items: sortedblogs.map((blog: any) => ({
      ...blog.data,
      link: `/blog/${blog.slug}/`,
    })),
  });
}
