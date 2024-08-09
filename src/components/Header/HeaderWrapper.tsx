import Header from './Header';

import { getLocale, getLocaleList, localeSetter } from '@/utils/locale';

export default function HeaderWrapper() {
	const { locale } = getLocale('TODO');

	const localeList = getLocaleList();

	return (
		<header id="header" style={{ position: 'relative', display: 'flex', flexFlow: 'column' }}>
			<Header locale={locale} localeList={localeList} localeSetter={localeSetter} />
		</header>
	);
}
