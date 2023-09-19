'use client';

/*
 * This is a separate component because it needs to be rendered
 * clientside, while the main header needs to be rendered on
 * the server to be able to fetch the locale. Very cool.
 */

import Link from 'next/link';
import { Heart, Translate, UserCircle } from '@phosphor-icons/react';
import { useState, useRef } from 'react';

import styles from './Header.module.css';

import Section from '../Section/Section';
import Logo from '../Logo/Logo';
import Dropdown from '../Dropdown/Dropdown';

import HeaderDropdown1 from './HeaderDropdowns/HeaderDropdown1';
import HeaderDropdown2 from './HeaderDropdowns/HeaderDropdown2';
import HeaderDropdown3 from './HeaderDropdowns/HeaderDropdown3';
import HeaderDropdown4 from './HeaderDropdowns/HeaderDropdown4';

export default function Header({ locale }) {
	const [open, setOpen] = useState(0);

	const headerInnerSection = useRef(null);

	const trigger1 = useRef(null);
	const trigger2 = useRef(null);
	const trigger3 = useRef(null);
	const trigger4 = useRef(null);

	const DropdownTrigger = ({ n, refForEl, children }) => {
		return (
			<button
				ref={refForEl}
				onMouseEnter={() => setOpen(n)}
				onPointerEnter={() => setOpen(n)}
				onMouseLeave={() => setOpen(0)}
				onPointerLeave={() => setOpen(0)}
				style={{
					color: open === n && 'var(--text-shade-3)',
				}}
			>
				{children}
			</button>
		);
	};

	return (
		<Section
			compact
			className={styles.headerWrapper}
			contentClassName={styles.header}
			contentRef={headerInnerSection}
		>
			<Link href="/" aria-label="Homepage" title="Homepage">
				<Logo text size={42} className={styles.logo} />
			</Link>

			<div className={styles.navWrapper}>
				<nav className={styles.nav}>
					<ul className={styles.dropdownTriggers}>
						<li>
							<DropdownTrigger n={1} refForEl={trigger1}>
								{locale.nav.about}
							</DropdownTrigger>
						</li>
						<li>
							<DropdownTrigger n={2} refForEl={trigger2}>
								{locale.nav.docs}
							</DropdownTrigger>
						</li>
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

				<div className={styles.rightIconsWrapper}>
					<DropdownTrigger n={3} refForEl={trigger3}>
						<Translate size={24} />
					</DropdownTrigger>

					<DropdownTrigger n={4} refForEl={trigger4}>
						<UserCircle size={32} />
					</DropdownTrigger>
				</div>
				<Dropdown
					dropdownContents={[
						{ el: <HeaderDropdown1 key={1} locale={locale} />, tr: trigger1 },
						{ el: <HeaderDropdown2 key={2} locale={locale} />, tr: trigger2 },
						{ el: <HeaderDropdown3 key={3} locale={locale} />, tr: trigger3 },
						{ el: <HeaderDropdown4 key={4} locale={locale} />, tr: trigger4 },
					]}
					openState={[open, setOpen]}
					boundaryRef={headerInnerSection}
					boundaryTolerance={24}
				/>
			</div>
		</Section>
	);
}
