import classNames from 'classnames';
import styles from './ButtonWidget.module.css';

import { ReactNode, MouseEventHandler, CSSProperties } from 'react';

import Button from '@/components/Button/Button';

/**
 * A reusable component for label/button combo widgets (see https://pretendo.network#discord-join).
 *
 * @param {string} buttonText - The text of the button.
 * @param {function} onButtonClick - Function to execute on click of the button.
 * @param {string} buttonHref - Path to navigate to on button click. Alternative to onButtonClick.
 * @param {string} buttonTarget - Acts like the target attribute of an <a> tag on the button.
 * @param {boolean} primary - Whether the button is primary. Defaults to false.
 * @param className - An optional classname.
 * @param {string} style - Custom styles to apply to the component.
 *
 * @example
 * <ButtonWidget primary buttonText={'click for :3'} onButtonClick={(e) => alert(':3')}>Click the button</ButtonWidget>
 *
 */

interface ButtonWidgetProps {
	children: ReactNode | string;
	className?: string;
	primary?: boolean;
	buttonText: string;
	onButtonClick?: MouseEventHandler<HTMLButtonElement>;
	buttonHref?: string;
	buttonTarget?: string;
	style?: CSSProperties;
}

export default function ButtonWidget(ctx: ButtonWidgetProps) {
	const { children, className, primary, buttonText, onButtonClick, buttonHref, buttonTarget, style = {} } = ctx;
	return (
		<div
			className={classNames(styles.widget, className)}
			style={{
				...style,
			}}
		>
			<p>{children}</p>
			<Button onClick={onButtonClick} href={buttonHref} target={buttonTarget} primary={primary} compact>
				{buttonText}
			</Button>
		</div>
	);
}
