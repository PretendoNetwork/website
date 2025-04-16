import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: 'page',
			source: 'blog/*.md',
			schema: z.object({
				author: z.string(),
				author_image: z.string(),
				date: z.string(),
				caption: z.string(),
				cover_image: z.string()
			})
		})
	}
});
