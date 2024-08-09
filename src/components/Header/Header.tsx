'use client';

/*
 * This is a separate component because it needs to be rendered
 * clientside, while the main header needs to be rendered on
 * the server to be able to fetch the locale. Very cool.
 */

import Link from 'next/link';
import { Heart, Translate, UserCircle, List, XCircle } from '@phosphor-icons/react';
import { useState, useRef, MutableRefObject, MouseEventHandler } from 'react';

import styles from './Header.module.css';

import Section from '../Section/Section';
import Logo from '../Logo/Logo';
import Dropdown from '../Dropdown/Dropdown';

import HeaderDropdown1 from './HeaderDropdowns/HeaderDropdown1';
import HeaderDropdown2 from './HeaderDropdowns/HeaderDropdown2';
import LocaleDropdown from './HeaderDropdowns/LocaleDropdown';
import AccountWidget from './HeaderDropdowns/AccountDropdowns/AccountWidget';
import MobileDropdown from './HeaderDropdowns/MobileDropdown/MobileDropdown';

import classNames from 'classnames';

export default function Header({ locale, localeList, localeSetter }) {
	const [open, setOpen] = useState(0);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
	const [clicked, setClicked] = useState(false);

	const headerInnerSection = useRef(null);

	const trigger1 = useRef(null);
	const trigger2 = useRef(null);
	const trigger3 = useRef(null);
	const trigger4 = useRef(null);

	const DropdownTrigger = ({
		n,
		refForEl,
		className,
		onClick,
		children,
	}: {
		n: number;
		refForEl?: MutableRefObject<any>;
		onClick?: MouseEventHandler<HTMLButtonElement>;
		className?: string;
		children: any;
	}) => {
		return (
			<button
				ref={refForEl}
				onPointerEnter={() => {
					setOpen(n);
				}}
				onPointerLeave={() => {
					if (!clicked) {
						setOpen(0);
					}
				}}
				onClick={
					onClick
						? onClick
						: () => {
							setOpen(n);
							setClicked(true);
						  }
				}
				style={{
					color: open === n && 'var(--text-shade-3)',
				}}
				tabIndex={-1}
				className={className}
			>
				{children}
			</button>
		);
	};

	return (
		<>
			<Section
				compact
				className={classNames(styles.headerWrapper, { [styles.mobileOpen]: mobileOpen })}
				contentRef={headerInnerSection}
			>
				<div className={styles.header}>
					<Link href="/" aria-label="Homepage" title="Homepage">
						<Logo text size={42} className={styles.logo} />
					</Link>

					<div className={styles.navWrapper}>
						<nav className={styles.nav}>
							<ul className={`${styles.dropdownTriggers} ${styles.desktopOnly}`}>
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
							<ul className={styles.desktopOnly}>
								<li className={styles.progress}>
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
							<DropdownTrigger n={3} refForEl={trigger3} className={styles.desktopOnly}>
								<Translate size={24} />
							</DropdownTrigger>

							<DropdownTrigger n={4} refForEl={trigger4} className={styles.desktopOnly}>
								<UserCircle size={32} />
							</DropdownTrigger>

							<DropdownTrigger
								n={0}
								onClick={() => {
									setMobileLocaleOpen(!mobileLocaleOpen);
								}}
								className={styles.mobileOnly}
							>
								{mobileOpen && (
									<Translate
										style={{
											color: mobileLocaleOpen ? 'var(--text-shade-3)' : 'var(--text-shade-1)',
										}}
										size={28}
									/>
								)}
							</DropdownTrigger>

							<DropdownTrigger
								n={0}
								onClick={() => {
									setMobileOpen(!mobileOpen);
									setMobileLocaleOpen(false);
								}}
								className={styles.mobileOnly}
							>
								{mobileOpen ? <XCircle size={32} /> : <List size={32} />}
							</DropdownTrigger>
						</div>
						<Dropdown
							dropdownContents={[
								{ el: <HeaderDropdown1 key={1} locale={locale} />, tr: trigger1 },
								{ el: <HeaderDropdown2 key={2} locale={locale} />, tr: trigger2 },
								{
									el: <LocaleDropdown key={3} localeSetter={localeSetter} localeList={localeList} />,
									tr: trigger3,
								},
								{ el: <AccountWidget key={4} locale={locale} accountData={false} />, tr: trigger4 },
							]}
							openState={[open, setOpen]}
							clickedState={[clicked, setClicked]}
							boundaryRef={headerInnerSection}
							boundaryTolerance={24}
						/>
					</div>
				</div>
				{mobileOpen && (
					<MobileDropdown
						locale={locale}
						setMobileOpen={setMobileOpen}
						mobileLocaleOpen={mobileLocaleOpen}
						localeSetter={localeSetter}
						localeList={localeList}
					/>
				)}
			</Section>
		</>
	);
}
