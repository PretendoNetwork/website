import {
	defineContentConfig,
	defineCollection,
	defineCollectionSource,
	z
} from '@nuxt/content';
import { getAllErrors, getErrorInfo } from '@pretendonetwork/error-codes';

const errorCodeSource = defineCollectionSource({
	getKeys: () => {
		return getAllErrors().map((key: string) => `${key}.json`);
	},
	getItem: (key: string) => {
		const errorString = key.split('.')[0];
		const sysmodule = errorString.split('-')[0];
		const code = errorString.split('-')[1];
		const errorInfo = getErrorInfo(sysmodule, code, 'en-US');
		if (errorInfo) {
			errorInfo.code = errorString;
		}

		return errorInfo;
	}
});

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
		}),
		docs: defineCollection({
			type: 'page',
			source: 'docs/**/*.md',
			schema: z.object({
				description: z.string()
			})
		}),
		terms: defineCollection({
			type: 'page',
			source: 'terms/*.md'
		}),
		errorcodes: defineCollection({
			type: 'data',
			source: errorCodeSource,
			schema: z.object({
				name: z.string(),
				message: z.string(),
				short_description: z.string(),
				long_description: z.string(),
				short_solution: z.string(),
				long_solution: z.string(),
				support_link: z.string(),
				module: z.object({
					name: z.string(),
					description: z.string(),
					system: z.string()
				}),
				code: z.string()
			})
		}),
		team: defineCollection({
			type: 'data',
			source: 'team.json',
			schema: z.object({
				people: z.array(z.object({
					name: z.string(),
					captionKey: z.string(),
					picture: z.string().url(),
					github: z.string().url()
				}))
			})
		}),
		specialThanks: defineCollection({
			type: 'data',
			source: 'specialthanks.json',
			schema: z.object({
				people: z.array(z.object({
					name: z.string(),
					captionKey: z.string(),
					picture: z.string().url(),
					github: z.string().url(),
					isSpecial: z.boolean().default(false)
				}))
			})
		})
	}
});
