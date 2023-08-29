import styles from './Caption.module.css';
import classNames from 'classnames';


/**
 * A reusable component for captions.
 *
 * @param {boolean} center - Whether the text should be centered or not.
 *
 * @example
 * <Caption>I, am, a caption! I, AM, A CAPTION! I AM- I AM A CAPTION!! I! AM A CAPTION, DR. HAN! I am a caption!</Caption>
 *
 */

export default function Caption(ctx) {
	const { children: caption, center, style, id } = ctx;

	return (
		<p className={classNames(styles.caption, { [styles.center]: center })} style={style} id={id}>
			{caption}
		</p>
	);
}
