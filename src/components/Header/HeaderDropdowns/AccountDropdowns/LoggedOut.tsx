import Button from '@/components/Button/Button';
import styles from './AccountDropdowns.module.css';

import classNames from 'classnames';

export default function LoggedOut({
	locale,
	mobile,
	className,
}: {
	locale: any;
	mobile?: boolean;
	className?: string;
}) {
	return (
		<div className={classNames(styles.accountDropdown, className, { [styles.mobile]: mobile })}>
			<Button primary={true} compact={true} href={'/account/login'} className={styles.button}>
				{locale.account.loginForm.login}
			</Button>
			<Button compact={true} href={'/account/register'} className={styles.button}>
				{locale.account.loginForm.register}
			</Button>
		</div>
	);
}
