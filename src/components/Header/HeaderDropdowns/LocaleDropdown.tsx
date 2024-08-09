import styles from './HeaderDropdown.module.css';

import classNames from 'classnames';

export default function LocaleDropdown({
	localeList,
	localeSetter,
	mobile,
}: {
	localeList: Object[];
	localeSetter: Function;
	mobile?: boolean;
}) {
	return (
		<div className={classNames(styles.dropdownContent, { [styles.mobile]: mobile })}>
			{localeList.map((l: { name: string; code: string }, i: number) => {
				return (
					<button
						className={styles.localeSelector}
						onClick={() => {
							localeSetter(l.code);
						}}
						key={i}
					>
						<p>{l.name}</p>
					</button>
				);
			})}
		</div>
	);
}
