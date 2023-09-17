'use client';

/*
 * This is a separate component because it needs to be rendered
 * clientside, while the main header needs to be rendered on
 * the server to be able to fetch the locale. Very cool.
 */

import Link from 'next/link';
import {
	ArrowRight,
	Heart,
	Users,
	Info,
	SealQuestion,
	NewspaperClipping,
	Wrench,
	SealWarning,
} from '@phosphor-icons/react';

import styles from './Header.module.css';

import { useState, useEffect, useRef } from 'react';
import Title from '../Title/Title';

export default function Nav({ locale }) {
	const [open, setOpen] = useState(0);

	const dropdown = useRef(null);
	const dropdownWrap = useRef(null);

	useEffect(() => {
		let w = 0;
		let h = 0;

		const clR = dropdown?.current?.getBoundingClientRect();
		if (clR && open) {
			w = clR.width;
			h = clR.height;
		}
		dropdownWrap.current.style.width = `${w}px`;
		dropdownWrap.current.style.height = `${h}px`;
	}, [open]);

	const DropdownTrigger = ({ n, children }) => {
		return (
			<button
				onMouseEnter={() => setOpen(n)}
				onMouseLeave={() => setOpen(0)}
				style={{
					color: open === n && 'var(--text-shade-3)',
				}}
			>
				{children}
			</button>
		);
	};

	const Dropdown1 = () => {
		return (
			<>
				<Link className={styles.link} href="/#credits">
					<div className={styles.iconWrapper}>
						<Users weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.nav.credits}</Title>
						<p>{locale.nav.dropdown.captions.credits}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>

				<Link className={styles.link} href="/#about">
					<div className={styles.iconWrapper}>
						<Info weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.nav.about}</Title>
						<p>{locale.nav.dropdown.captions.about}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>

				<Link className={styles.link} href="/#faq">
					<div className={styles.iconWrapper}>
						<SealQuestion weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.nav.faq}</Title>
						<p>{locale.nav.dropdown.captions.faq}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>

				<Link className={styles.link} href="/blog">
					<div className={styles.iconWrapper}>
						<NewspaperClipping weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.nav.blog}</Title>
						<p>{locale.nav.dropdown.captions.blog}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>
			</>
		);
	};

	const Dropdown2 = () => {
		return (
			<>
				<Link className={styles.link} href="/docs">
					<div className={styles.iconWrapper}>
						<Wrench weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.docs.quickLinks.links[0].header}</Title>
						<p>{locale.docs.quickLinks.links[0].caption}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>
				<Link className={styles.link} href="/docs/search">
					<div className={styles.iconWrapper}>
						<SealWarning weight="fill" size={32} />
					</div>
					<div>
						<Title element="h4">{locale.docs.quickLinks.links[1].header}</Title>
						<p>{locale.docs.quickLinks.links[1].caption}</p>
					</div>
					<ArrowRight size={28} className={styles.arrow} />
				</Link>
			</>
		);
	};

	return (
		<nav className={styles.nav}>
			<ul className={styles.dropdownTriggers}>
				<li>
					<DropdownTrigger n={1}>{locale.nav.about}</DropdownTrigger>
				</li>
				<li>
					<DropdownTrigger n={2}>{locale.nav.docs}</DropdownTrigger>
				</li>
				<div
					className={styles.dropdown}
					onMouseEnter={() => setOpen(open)}
					onMouseLeave={() => setOpen(0)}
					ref={dropdownWrap}
					style={{
						border: open ? '' : 'none',
					}}
				>
					<div ref={dropdown}>{open === 1 ? <Dropdown1 /> : open === 2 ? <Dropdown2 /> : null}</div>
				</div>
			</ul>
			<ul>
				<li>
					<Link href="/progress">
						<button>{locale.nav.progress}</button>
					</Link>
				</li>
				<li className={styles.upgrade}>
					<Link href="/upgrade">
						<button>
							<Heart size={16} weight="fill" alt="" />
							<span>{locale.nav.donate}</span>
						</button>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
