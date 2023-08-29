import styles from './ShowcaseSection.module.css';

import classNames from 'classnames';
import ImageFix from '../ImageFix/ImageFix';

import Section from '../Section/Section';
import Title from '../Title/Title';

export default function ShowcaseSection(ctx) {
	const { title, caption, image, isOdd } = ctx;
	return (
		<Section
			className={classNames(styles.sectionWrapper, { [styles.odd]: isOdd })}
			contentClassName={styles.content}
		>
			<div className={styles.text}>
				<Title>{title}</Title>
				<p className={styles.caption}>{caption}</p>
			</div>
			<ImageFix src={image} alt="" className={styles.image} quality={100} sizes="(max-width: 840px) 100vw, 700px" />
		</Section>
	);
}
