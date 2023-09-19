'use client';

import { useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';

import styles from './Dropdown.module.css';

/**
 *
 *	A reusable object that renders a dropdown.
 *
 * 	@param {React.useState} openState: a state object [state, setState],
 * 	where state is an int which refers to the index of the dropdownContent to render + 1
 * 	(having it be +1 lets us use 0 as a "do not render" magic number)
 *
 * 	@param {Array} dropdownContents: an array of objects, structured as
 * 	follows:
 *		[{ el: <El1 />, tr: tr1 }]
 *	where <El1 /> is the content to be rendered when the state is set to
 *	the corresponding state, and tr1 is the reference to the element that triggered
 *	the dropdown in the first place
 *
 * @param {React.useRef} boundaryRef: a ref to the object to use as a boundary (the
 * dropdown will always be rendered to be [horizontally] inside of the element)
 *
 * @param {Number} boundaryTolerance: the amount of pixels by which the dropdown can poke out of the boundary.
 *
 * 	@example
 * 	<Dropdown
 *  	dropdownContents={[
 *	  		{ el: <El1 />, tr: tr1 },
 *			{ el: <El2 />, tr: tr2 },
 *		]}
 *		openState={[open, setOpen]}
 *		boundaryRef={navbarRef}
 *		boundaryTolerance={20}
 *	/>
 */

export default function Dropdown(ctx) {
	const [open, setOpen] = ctx.openState;
	const { boundaryRef, boundaryTolerance } = ctx;

	const dropdownElements = useMemo(() => {
		return [null];
	}, []);
	const dropdownTriggers = useMemo(() => {
		return [null];
	}, []);

	ctx.dropdownContents.forEach((c) => {
		dropdownElements.push(c.el);
		dropdownTriggers.push(c.tr);
	});

	const dropdownContent = useRef(null);
	const dropdownArrow = useRef(null);
	const dropdown = useRef(null);

	// animation business. Don't even bother.
	useEffect(() => {
		const dropdownContentRect = dropdownContent?.current?.getBoundingClientRect();
		const dropdownRect = dropdownContent?.current?.getBoundingClientRect();

		const pxToInt = (px) => parseInt(px.replace('px', ''));
		const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

		if (dropdownContentRect && open) {
			const sectionWidth = pxToInt(getComputedStyle(boundaryRef.current).width);
			const dropdownWidth = dropdownRect.width;

			function getRealCenter(trRef) {
				const style = getComputedStyle(trRef.current);
				const rightPad = pxToInt(style.paddingRight);
				const leftPad = pxToInt(style.paddingLeft);

				const elWidth = pxToInt(style.width);
				return (elWidth - rightPad - leftPad) / 2;
			}

			function getTriggerOffset(trRef) {
				const style = getComputedStyle(trRef.current);
				const leftPad = pxToInt(style.paddingLeft);
				return (
					trRef.current.getBoundingClientRect().left -
					boundaryRef.current.getBoundingClientRect().left +
					leftPad
				);
			}

			function getLeftOffset(trRef) {
				return getTriggerOffset(trRef) + getRealCenter(trRef);
			}

			const arrowOffset = getLeftOffset(dropdownTriggers[open]);
			const leftOffset = getLeftOffset(dropdownTriggers[open]) - dropdownWidth / 2;

			const leftBoundary = 0 - boundaryTolerance;
			const rightBoundary = sectionWidth - dropdownWidth + boundaryTolerance;

			const maxLeftOffset = clamp(leftOffset, leftBoundary, rightBoundary);

			dropdown.current.style.opacity = 1;
			dropdown.current.style.width = `${dropdownContentRect.width}px`;
			dropdown.current.style.height = `${dropdownContentRect.height}px`;

			dropdown.current.style.left = `${maxLeftOffset}px`;
			dropdownArrow.current.style.left = `${arrowOffset}px`;
		} else {
			dropdown.current.style.opacity = 0;
			//dropdown.current.style.width = 0;
			dropdown.current.style.height = 0;
		}
	}, [open, dropdownTriggers, boundaryTolerance, boundaryRef]);

	return (
		<>
			<div
				className={styles.dropdown}
				onMouseEnter={() => setOpen(open)}
				onPointerEnter={() => setOpen(open)}
				onMouseLeave={() => setOpen(0)}
				onPointerLeave={() => setOpen(0)}
				ref={dropdown}
				style={{
					border: open ? '' : 'none',
				}}
			>
				<div ref={dropdownContent} className={styles.dropdownContent}>
					{dropdownElements[open]}
				</div>
			</div>
			<div
				className={classNames(styles.dropdownArrow, {
					[styles.arrowAppear]: Boolean(open),
					[styles.arrowDisappear]: !Boolean(open),
				})}
				ref={dropdownArrow}
			/>
		</>
	);
}
