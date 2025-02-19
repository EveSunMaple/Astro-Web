import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    featuredImage: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    badges: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    audioUrl: z.string().optional(),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string(),
      type: z.string(),
      size: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { blog };