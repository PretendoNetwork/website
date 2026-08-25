import type { UseSeoMetaInput } from '@unhead/vue';

export type CustomSeoMetaOptions = UseSeoMetaInput & {
	subsection?: string;
};

export default function (args?: CustomSeoMetaOptions) {
	let newTitleTemplate = '';

	switch (args?.subsection) {
		case ('account'): {
			newTitleTemplate = 'Account | Pretendo Network';
			break;
		}
		case ('terms'): {
			newTitleTemplate = 'Terms | Pretendo Network';
			break;
		}
		case ('blog'): {
			newTitleTemplate = 'Blog | Pretendo Network';
			break;
		}
		case ('docs'): {
			newTitleTemplate = 'Docs | Pretendo Network';
			break;
		}
		default: {
			newTitleTemplate = 'Pretendo Network';
		}
	}

	const newTitle = args?.title ? `${args?.title} | ${newTitleTemplate}` : newTitleTemplate;

	useHead({ title: newTitle });
	useSeoMeta({ ...args, title: newTitle, ogTitle: newTitle, twitterTitle: newTitle, ogDescription: args?.description, twitterDescription: args?.description, twitterImage: args?.ogImage });
}
