import classNames from 'classnames';
import CoolHover from '@/components/CoolHover/CoolHover';
import styles from './Button.module.css';

import Link from 'next/link';

/**
 * A reusable component for buttons.
 *
 * @param {boolean} primary - Whether the button is primary or not. Defaults to false.
 * @param {boolean} icon - Whether the button only contains an icon. Defaults to false.
 * @param {boolean} compact - Make the button more compact. Defaults to false.
 * @param {string} href - Path to redirect to, instead of using onClick.
 * @param {string} target - Acts like the target attribute of an <a> tag.
 * @param className - An optional classname.
 * @param {string} style - Custom styles to apply to the button.
 *
 * @example
 * <Button primary onClick={(e) => alert(e.target.textContent)}>Pizza</Button>
 *
 */

export default function Button(ctx) {
	const { children, className, primary, icon, compact, onClick, href, target, style } = ctx;

	const BtnEl = () => {
		return (
			<CoolHover
				bgColor={primary ? 'var(--accent-shade-0)' : 'var(--bg-shade-3)'}
				hoverColor={primary ? 'var(--accent-shade-1)' : 'var(--bg-shade-3-5)'}
				style={{
					borderRadius: '6px',
					width: 'fit-content',
					height: 'fit-content',
					...style,
				}}
			>
				<button
					className={classNames(
						styles.button,
						{ [styles.primary]: primary, [styles.icon]: icon, [styles.compact]: compact },
						className
					)}
					onClick={onClick}
				>
					{children}
				</button>
			</CoolHover>
		);
	};

	return href ? (
		<Link href={href} target={target}>
			<BtnEl />
		</Link>
	) : (
		<BtnEl />
	);
}
