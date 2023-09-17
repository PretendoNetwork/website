/**
 * The Pretendo P, with or without text.
 *
 * @param {boolean} text - Renders the text. Defaults to false.
 * @param {number} size - Sets the height of the logo. Defaults to 48.
 * @param {boolean} center - Centers the element. Defaults to false.
 * @param {string} className - Classname to apply to the logo.
 * @param {string} style - Custom styles to apply to the logo.
 *
 * @example
 * <Logo />
 *
 */

export default function Logo(ctx) {
	const { text, size = 48, center, className, style } = ctx;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={text ? '0 0 120 39.88' : '0 0 39.88 39.88'}
			aria-label="Pretendo"
			title="Pretendo"
			height={size}
			width={text ? size * 3 : size}
			className={className}
			style={{
				display: 'block',
				margin: center ? '0 auto' : '',
				...style,
			}}
		>
			<g fill="#9d6ff3">
				<path d="M13.13 6.34c-1.06.55-.13 2.14.92 1.59a12.37 12.37 0 0 1 8.8-.57 10.83 10.83 0 0 1 6.33 4.16c.65 1 2.23.08 1.59-.92-3.49-5.4-12.1-7.13-17.64-4.26Z" />
				<path d="M33.39 8.33a15.56 15.56 0 0 0-9.14-6.16 17.54 17.54 0 0 0-12.65.9c-1.05.56-.13 2.14.92 1.59 3.41-1.79 7.6-1.71 11.21-.72 3.1.85 6.27 2.55 8.04 5.31.66 1.02 2.24.1 1.62-.92ZM19.3 8.81a10.72 10.72 0 0 0-6.7 2.3h-3a1.34 1.34 0 0 0-1.38 1.28v24.46a1.43 1.43 0 0 0 1.39 1.39h3.02a1.37 1.37 0 0 0 1.3-1.39V29.4A11 11 0 1 0 19.3 8.81Zm0 17.18a6.21 6.21 0 1 1 6.21-6.2 6.22 6.22 0 0 1-6.2 6.2Z" />
			</g>
			{text && (
				<text
					fill="#fff"
					fontFamily="var(--font-poppins), Poppins-Bold, Poppins, Inter, Arial, sans-serif"
					fontSize="17"
					fontWeight="700"
					x="100%"
					y="50%"
					textAnchor="end"
					alignmentBaseline="central"
					dominantBaseline="central"
				>
					Pretendo
				</text>
			)}
		</svg>
	);
}
