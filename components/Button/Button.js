import classNames from 'classnames';

import styles from './Button.module.css';

/**
 * A reusable component for buttons.
 *
 * @param {boolean} isPrimary - Whether the button is primary or not. Defaults to false.
 * @param className - An optional classname.
 * @param {string} style - Custom styles to apply to the title.
 *
 * @example
 * <Button isPrimary={true} onClick={(e) => alert(e.target.textContent)}>Pizza</Title>
 *
 */

export default function Button(ctx) {
	const { children, className, isPrimary, onClick } = ctx;
	return (
		<button className={classNames(styles.button, { [styles.primary]: isPrimary }, className)} onClick={onClick}>
			{children}
		</button>
	);
}
