import { ArrowRight, Users, Info, SealQuestion, NewspaperClipping } from '@phosphor-icons/react';
import Link from 'next/link';

import Title from '@/components/Title/Title';

import styles from './HeaderDropdown.module.css';

export default function HeaderDropdown1({ locale }) {
	return (
		<div className={styles.dropdownContent}>
			<Link className={styles.link} href="/#credits">
				<div className={styles.iconWrapper}>
					<Users weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.nav.credits}</Title>
					<p>{locale.nav.dropdown.captions.credits}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>

			<Link className={styles.link} href="/#about">
				<div className={styles.iconWrapper}>
					<Info weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.nav.about}</Title>
					<p>{locale.nav.dropdown.captions.about}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>

			<Link className={styles.link} href="/#faq">
				<div className={styles.iconWrapper}>
					<SealQuestion weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.nav.faq}</Title>
					<p>{locale.nav.dropdown.captions.faq}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>

			<Link className={styles.link} href="/blog">
				<div className={styles.iconWrapper}>
					<NewspaperClipping weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">{locale.nav.blog}</Title>
					<p>{locale.nav.dropdown.captions.blog}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>
		</div>
	);
}
