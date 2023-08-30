import styles from './TeamCard.module.css';
import ImageFix from '@/components/ImageFix/ImageFix';
import Link from 'next/link';

import { Star } from 'phosphor-react-sc';

import classNames from 'classnames';

/**
 * A reusable component to credit someone.
 *
 * @param {string} name - The name of the contributor.
 * @param {string} caption - A caption that more or less describes the user's contributions.
 * @param {string} pic - A link to the avatar image.
 * @param {string} link - A link to the user page for this user (e.g. github/gitlab/gitbucket/gitrekt profile, fedi account, personal website/blog, ...)
 * @param {boolean} compact - Whether the card should be compact (e.g. Special thanks section) or regular sized (e.g. The team section).
 * @param {boolean} special - Shows a yellow border and a star sticker at the top of the card
 *
 * @example
 * <TeamCard name="Ash (pinklimes)" caption="greatest web developer, right after Charlotte" pic="https://limes.pink/assets/images/spinmii.gif" link="https://limes.pink" />
 *
 */

export default function TeamCard(ctx) {
	const { name, caption, pic, link, compact, special, className } = ctx;

	return (
		<Link
			href={link}
			className={classNames(
				styles.card,
				{ [styles.compact]: compact, [styles.special]: Boolean(special) },
				className
			)}
		>
			<div className={styles.imageWrapper}>
				<ImageFix src={pic} width={110} height={110} alt="" className={styles.image} />
			</div>
			<div className={styles.text}>
				<h3>{name}</h3>
				<p>{caption}</p>
			</div>
			{special && <Star size={32} weight="fill" className={styles.star} />}
		</Link>
	);
}
