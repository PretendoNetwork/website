import { ArrowRight, Wrench, SealWarning } from '@phosphor-icons/react';
import Link from 'next/link';

import Title from '@/components/Title/Title';

import styles from './HeaderDropdown.module.css';

export default function HeaderDropdown3({ locale }) {
	return (
		<div className={styles.dropdownContent}>
			<Link className={styles.link} href="/docs">
				<div className={styles.iconWrapper}>
					<Wrench weight="fill" size={32} />
				</div>
				<div>
					<Title element="h4">TESTTTTT</Title>
					<p>{locale.docs.quickLinks.links[0].caption}</p>
				</div>
				<ArrowRight size={28} className={styles.arrow} />
			</Link>
		</div>
	);
}
