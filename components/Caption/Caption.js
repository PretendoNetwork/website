import styles from './Caption.module.css';

/**
 * A reusable component for captions.
 */

export default function Caption(ctx) {
	const { children: caption, style, id } = ctx;

	return (
		<p className={`${styles.caption} ${style}`} id={id}>{caption}</p>
	);
}
