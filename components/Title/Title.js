import { createElement } from 'react';
import classNames from 'classnames';
import styles from './Title.module.css';

/**
 * A reusable component for titles.
 *
 * @param {string} element - The element to render the title as (e.g. h1, h2, p, div). Defauts to h2.
 * @param {bool} center - Whether the text should be centered or not.
 *
 * @example
 * <Title element="h1">This is the title!</Title>
 *
 */

export default function Title(ctx) {
	const { children: title = '', element, style, id, center } = ctx;

	// regex to match all start/end punctuation except for parentheses and brackets. Please never make me do this again.
	const punctuationRegex = {
		prefix: /^((?![/\)\(\[\]\{\}])([\p{P}\p{S}]))+/gu,
		suffix: /((?![/\)\(\[\]\{\}])([\p{P}\p{S}]))+$/gu,
	};

	// split the title into prefix, title, and suffix
	const titleParts = {
		prefix: title.match(punctuationRegex.prefix),
		root: title.replace(punctuationRegex.prefix, '').replace(punctuationRegex.suffix, ''),
		suffix: title.match(punctuationRegex.suffix),
	};

	// create prefix/suffix elements
	const prefixElements = titleParts.prefix
		? titleParts.prefix.map((prefix, i) => {
			return (
				<span className={styles.prefix} key={i}>
					{prefix}
				</span>
			);
		  })
		: null;
	const suffixElements = titleParts.suffix
		? titleParts.suffix.map((suffix, i) => {
			return (
				<span className={styles.suffix} key={i}>
					{suffix}
				</span>
			);
		  })
		: null;

	// create the title react element
	const titleElement = createElement(
		element || 'h2',
		{
			className: classNames(styles.title, { [styles.center]: center }),
			style,
			id,
		},
		prefixElements,
		titleParts.root,
		suffixElements
	);

	return titleElement;
}
