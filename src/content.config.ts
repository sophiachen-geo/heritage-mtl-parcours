import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const parcours = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/parcours',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      series: z.string(),
      circuit: z.string(),
      date: z.coerce.date(),
      duration: z.string(),
      distance: z.string(),
      stopsCount: z.number(),
      cover: image().optional(),
      summary: z.string(),
      organizer: z.string().default('Héritage Montréal'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { parcours };
