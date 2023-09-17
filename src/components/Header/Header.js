import Logo from '@/components/Logo/Logo';
import Section from '@/components/Section/Section';
import Nav from './Nav';

import { getLocale } from '@/utils/locale';

import Link from 'next/link';

import styles from './Header.module.css';

export default function Header(ctx) {
	const { locale } = getLocale('TODO');

	return (
		<header id="header">
			<Section compact className={styles.headerWrapper} contentClassName={styles.header}>
				<Link href="/" aria-label="Homepage" title="Homepage">
					<Logo text size={42} className={styles.logo} />
				</Link>

				<Nav locale={locale} />
			</Section>
		</header>
	);
}
