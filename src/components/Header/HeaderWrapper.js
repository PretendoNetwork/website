import Header from './Header';

import { getLocale } from '@/utils/locale';

export default function HeaderWrapper() {
	const { locale } = getLocale('TODO');

	return (
		<header id="header">
			<Header locale={locale} />
		</header>
	);
}
