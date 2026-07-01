import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().optional().default(false),
    bibliography: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    icon: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
