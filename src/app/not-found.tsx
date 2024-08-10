import ShowcaseSection from '@/components/ShowcaseSection/ShowcaseSection';

import bandwidthlost from '@/public/assets/images/bandwidthlost.png';

import { getLocale } from '@/utils/locale';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '404',
};

export default function NotFound() {
	const { locale } = getLocale();

	return (
		<ShowcaseSection
			title={'404.'}
			caption={locale.notfound.description}
			image={bandwidthlost}
			bigText={true}
		/>
	);
}
