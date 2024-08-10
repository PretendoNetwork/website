import { ArrowRight, Wrench, SealWarning, Heart } from '@phosphor-icons/react';
import Link from 'next/link';

import classNames from 'classnames';

import Title from '@/components/Title/Title';

import styles from './HeaderDropdown.module.css';

export default function HeaderDropdown2({ locale, mobile }: { locale: any; mobile?: boolean }) {
	return (
		<div className={classNames(styles.dropdownContent, { [styles.mobile]: mobile })}>
			<Link className={styles.link} href="/docs">
				<div className={styles.iconWrapper}>
					<Wrench weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.docs.quickLinks.links[0].header}</Title>
					<p>{locale.docs.quickLinks.links[0].caption}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>
			<Link className={styles.link} href="/docs/search">
				<div className={styles.iconWrapper}>
					<SealWarning weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.docs.quickLinks.links[1].header}</Title>
					<p>{locale.docs.quickLinks.links[1].caption}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>
			<Link className={styles.link} href="/upgrade">
				<div className={styles.iconWrapper}>
					<Heart weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.nav.donate}</Title>
					<p>{locale.nav.dropdown.captions.donate}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>
		</div>
	);
}
