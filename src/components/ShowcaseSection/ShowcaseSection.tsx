import styles from './ShowcaseSection.module.css';

import classNames from 'classnames';
import Image, { StaticImageData } from 'next/image';

import Section from '@/components/Section/Section';
import Title from '@/components/Title/Title';

interface ShowcaseSectionProps {
	title?: string;
	caption?: string;
	image?: StaticImageData;
	isOdd?: boolean;
	bigText?: boolean;
}

export default function ShowcaseSection(ctx: ShowcaseSectionProps) {
	const { title, caption, image, isOdd, bigText } = ctx;
	return (
		<Section
			className={classNames(styles.sectionWrapper, { [styles.odd]: isOdd, [styles.bigText]: bigText })}
			contentClassName={styles.content}
		>
			<div className={styles.text}>
				<Title>{title}</Title>
				<p className={styles.caption}>{caption}</p>
			</div>
			<Image src={image} alt="" className={styles.image} quality={100} sizes="(max-width: 840px) 100vw, 700px" />
		</Section>
	);
}
