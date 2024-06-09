'use client';

import { useEffect, useRef, useMemo, ReactNode, RefObject, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';

import styles from './Dropdown.module.css';

/**
 *
 *	A reusable object that renders a dropdown.
 *
 * 	@param {React.useState} openState: a state object [state, setState] storing an
 *  int, which refers to the index of the dropdownContent to render + 1
 * 	(having it be +1 lets us use 0 as a "do not render" magic number)
 *
 *
 *  @param {React.useState} clickedState: a state object [state, setState] storing a
 *  boolean indicating whether the element was clicked on (true) or hovered on (false)
 *
 * 	@param {Array} dropdownContents: an array of objects, structured as
 * 	follows:
 *		[{ el: <El1 />, tr: tr1 }]
 *	where <El1 /> is the content to be rendered when the state is set to
 *	the corresponding state, and tr1 is the reference to the element that triggered
 *	the dropdown in the first place
 *
 * 	@param {React.useRef} boundaryRef: a ref to the object to use as a boundary (the
 * 	dropdown will always be rendered to be [horizontally] inside of the element)
 *
 * 	@param {Number} boundaryTolerance: the amount of pixels by which the dropdown can poke out of the boundary.
 *
 *	@example
 * 	<Dropdown
 *  	dropdownContents={[
 *	  		{ el: <El1 />, tr: tr1 },
 *			{ el: <El2 />, tr: tr2 },
 *		]}
 *		openState={[open, setOpen]}
 *      clickedState={[clicked, setClicked]}
 *		boundaryRef={navbarRef}
 *		boundaryTolerance={20}
 *	/>
 */

interface DropdownContentObject {
	el: ReactNode;
	tr: RefObject<ReactNode>;
}

interface DropdownProps {
	dropdownContents: Array<DropdownContentObject>;
	openState: [number, Dispatch<SetStateAction<number>>];
	clickedState: [boolean, Dispatch<SetStateAction<boolean>>];
	boundaryRef: RefObject<HTMLDivElement>;
	boundaryTolerance: number;
}

export default function Dropdown(ctx: DropdownProps) {
	const [open, setOpen] = ctx.openState;
	const [clicked, setClicked] = ctx.clickedState;
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

		const pxToInt = (px: string) => parseInt(px.replace('px', ''));
		const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

		function getRealCenter(trRef: RefObject<HTMLDivElement>) {
			const style = getComputedStyle(trRef.current);
			const rightPad = pxToInt(style.paddingRight);
			const leftPad = pxToInt(style.paddingLeft);

			const elWidth = pxToInt(style.width);
			return (elWidth - rightPad - leftPad) / 2;
		}

		function getTriggerOffset(trRef: RefObject<HTMLDivElement>) {
			const style = getComputedStyle(trRef.current);
			const leftPad = pxToInt(style.paddingLeft);
			return (
				trRef.current.getBoundingClientRect().left - boundaryRef.current.getBoundingClientRect().left + leftPad
			);
		}

		function getLeftOffset(trRef: RefObject<HTMLDivElement>) {
			return getTriggerOffset(trRef) + getRealCenter(trRef);
		}

		if (dropdownContentRect && open) {
			const sectionWidth = pxToInt(getComputedStyle(boundaryRef.current).width);
			const dropdownWidth = dropdownRect.width;

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

		const closeOnClickOutside = (e: MouseEvent) => {
			if (dropdown.current && !dropdown.current.contains(e.target as Node)) {
				setOpen(0);
				setClicked(false);
			}
		};

		document.addEventListener('mousedown', closeOnClickOutside);
		return () => {
			document.removeEventListener('mousedown', closeOnClickOutside);
		};
	}, [open, setOpen, clicked, setClicked, dropdownTriggers, boundaryTolerance, boundaryRef]);

	return (
		<>
			<div
				className={styles.dropdown}
				onPointerEnter={() => {
					setOpen(open);
				}}
				onPointerLeave={() => {
					!clicked && setOpen(0);
				}}
				onPointerDown={() => {
					setTimeout(() => {
						setOpen(0);
						setClicked(false);
					}, 200);
				}}
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
