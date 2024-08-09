import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

export default function AccountWidget({
	locale,
	accountData,
	mobile,
	className,
}: {
	locale: any;
	accountData?: Object;
	mobile?: boolean;
	className?: string;
}) {
	return accountData ? (
		<LoggedIn locale={locale} accountData={accountData} mobile={mobile} className={className} />
	) : (
		<LoggedOut locale={locale} mobile={mobile} className={className} />
	);
}
