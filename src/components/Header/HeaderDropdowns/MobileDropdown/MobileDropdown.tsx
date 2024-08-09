import styles from './MobileDropdown.module.css';
import HeaderDropdown1 from '../HeaderDropdown1';
import HeaderDropdown2 from '../HeaderDropdown2';
import LocaleDropdown from '../LocaleDropdown';
import AccountWidget from '../AccountDropdowns/AccountWidget';

export default function MobileDropdown({ locale, setMobileOpen, mobileLocaleOpen, localeSetter, localeList }) {
	return (
		<div className={styles.mobileDropdown}>
			{mobileLocaleOpen && <LocaleDropdown mobile={true} localeSetter={localeSetter} localeList={localeList} />}
			{!mobileLocaleOpen && (
				<>
					<AccountWidget locale={locale} mobile={true} className={styles.accountWidget} />
					<HeaderDropdown1 locale={locale} mobile={true} />
					<HeaderDropdown2 locale={locale} mobile={true} />
				</>
			)}
		</div>
	);
}
