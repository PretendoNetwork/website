import classNames from 'classnames';
import styles from './ButtonWidget.module.css';

import Button from '../Button/Button';

/**
 * A reusable component for label/button combo widgets (see https://pretendo.network#discord-join).
 *
 * @param {string} buttonText - The text of the button.
 * @param {function} onButtonClick - Function to execute on click of the button.
 * @param {boolean} primary - Whether the button is primary. Defaults to false.
 * @param {boolean} center - Whether to center the widget. Defaults to false.
 * @param className - An optional classname.
 * @param {string} style - Custom styles to apply to the component.
 *
 * @example
 * <ButtonWidget primary buttonText={'click for :3'} onButtonClick={(e) => alert(':3')}>Click the button</ButtonWidget>
 *
 */

export default function ButtonWidget(ctx) {
	const { children, className, primary, buttonText, center, onButtonClick, style } = ctx;
	return (
		<div
			className={classNames(styles.widget, className)}
			style={{
				...style,
			}}
		>
			<p>{children}</p>
			<Button onClick={onButtonClick} primary={primary} compact>
				{buttonText}
			</Button>
		</div>
	);
}
