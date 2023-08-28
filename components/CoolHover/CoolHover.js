import { useState } from 'react';
import styles from './CoolHover.module.css';
import classNames from 'classnames';

/**
 * A reusable component to make a cool hover effect.
 *
 * @param {string} hoverColor - The hover color.
 * @param {string} bgColor - The background color.
 * @param {string} radius - The radius of the hover effect.
 *
 * @example
 * <a href="/pizza">
 * 	<CoolHover hoverColor="var(--accent-shade-3)" bgColor="var(--accent-shade-2)">
 * 	  Click for Pizza
 * 	</CoolHover>
 * </a>
 *
 */

export default function CoolHover(ctx) {
	const { hoverColor, bgColor, children, className, radius, style } = ctx;

	const [ pos, setPos ] = useState({ x: 0, y: 0 });
	const [ active, setActive ] = useState( false );

	return (
		<div
			style={{
				width : '100%',
				height: '100%',
				cursor: 'pointer',
				backgroundColor: bgColor,
				backgroundImage: active ? `radial-gradient(circle ${radius || '256px'} at ${pos.x}px ${pos.y}px, ${hoverColor}, ${bgColor})` :  bgColor,
				//transform: active ? 'scale(1.03)' : 'scale(1)',
				//transition: 'transform 200ms'
				...style
			}}
			className={classNames(className, styles.coolHover)}
			onMouseMove={(e) => {
				setActive(true);
				setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
			}}
			onMouseLeave={() => setActive(false)}
		>
			{ children }
		</div>
	);
}
