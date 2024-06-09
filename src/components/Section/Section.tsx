import classNames from 'classnames';

import { CSSProperties, ReactNode, RefObject } from 'react';

import styles from './Section.module.css';

/**
 * A reusable component for sections.
 *
 * @param {import('react').ComponentClass} className - Custom classes to apply to the section.
 * @param {import('react').ComponentClass} contentClassName - Custom styles to apply to the content.
 * @param {boolean} compact - make the padding more compact.
 * @param {string} style - Custom styles to apply to the section.
 * @param {string} id - The id of the section.
 *
 * @example
 * <Section className={styles.showcaseTail} contentClassName={styles.content}>
 *	<Title>Hello</Title>
 * </Section>
 *
 */

interface SectionProps {
	id?: string;
	style?: CSSProperties;
	children?: ReactNode;
	className?: string;
	compact?: boolean;
	contentClassName?: string;
	contentRef?: RefObject<HTMLDivElement>;
}

export default function Section(ctx: SectionProps) {
	const { id, style, children, className, compact, contentClassName, contentRef } = ctx;

	return (
		<section
			className={classNames(styles.sectionWrapper, { [styles.compact]: compact }, className)}
			id={id}
			style={style}
		>
			<div className={classNames(styles.content, contentClassName)} ref={contentRef}>
				{children}
			</div>
		</section>
	);
}
