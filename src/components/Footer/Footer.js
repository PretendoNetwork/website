import Bandwidth from '@/components/Bandwidth/Bandwidth';
import Logo from '@/components/Logo/Logo';
import Section from '@/components/Section/Section';
import Title from '@/components/Title/Title';

import { ArrowRight } from 'phosphor-react-sc';

import { getLocale } from '@/utils/locale';

import Link from 'next/link';

import styles from './Footer.module.css';

export default function Footer(ctx) {
	const { locale } = getLocale('TODO');

	const year = new Date().getFullYear(); /* Can't have an outdated year this way :3 */

	return (
		<footer id="footer">
			<Section compact className={styles.footerWrapper} contentClassName={styles.footer}>
				<div>
					<Logo text size={96} className={styles.logo} />
					<div>
						<p>
							Copyright ©{' '}
							<Link href={`https://wikipedia.org/wiki/${year}`} target="_blank" className={styles.link}>
								{year}
							</Link>
						</p>
						<p>
							Site by{' '}
							<Link href="https://limes.pink" target="_blank" className={styles.link}>
								pinklimes
							</Link>
							,{' '}
							<Link href="https://mrjvs.com/" target="_blank" className={styles.link}>
								mrjvs
							</Link>{' '}
							&{' '}
							<Link href="https://jipfr.nl/" target="_blank" className={styles.link}>
								jipfr
							</Link>
						</p>
						<p>
							<Link
								href="https://github.com/PretendoNetwork/website/"
								target="_blank"
								className={styles.link}
							>
								Source code
							</Link>
						</p>
					</div>
				</div>
				<div>
					<Title element="h3">{locale.footer.socials}</Title>
					<div>
						<p>
							<Link
								href="https://mastodon.pretendo.network/@pretendo"
								target="_blank"
								className={styles.link}
							>
								Mastodon
							</Link>
						</p>
						<p>
							<Link href="https://twitter.com/@PretendoNetwork" target="_blank" className={styles.link}>
								Twitter
							</Link>
						</p>
						<p>
							<Link href="https://discord.gg/pretendo" target="_blank" className={styles.link}>
								Discord
							</Link>
						</p>
						<p>
							<Link href="https://github.com/PretendoNetwork" target="_blank" className={styles.link}>
								GitHub
							</Link>
						</p>
						<p>
							<Link href="/blog" className={styles.link}>
								Blog
							</Link>
						</p>
					</div>
				</div>
				<div>
					<Title element="h3">{locale.footer.usefulLinks}</Title>
					<div>
						<p>
							<Link href="/docs" className={styles.link}>
								{locale.nav.docs}
							</Link>
						</p>
						<p>
							<Link href="/#faq" className={styles.link}>
								{locale.nav.faq}
							</Link>
						</p>
						<p>
							<Link href="/progress" className={styles.link}>
								{locale.nav.progress}
							</Link>
						</p>
						<p>
							<Link href="/account" className={styles.link}>
								{locale.nav.account}
							</Link>
						</p>
						<p>
							<Link href="/account/upgrade" className={styles.link}>
								{locale.nav.donate}
							</Link>
						</p>
					</div>
				</div>
				<div className={styles.discordWidgetWrapper}>
					<Bandwidth
						alignBubble="right"
						size={210}
						lines={locale.footer.bandwidthRaccoonQuotes}
						className={styles.bandwidth}
					/>
					<div className={styles.discordWidget}>
						<Title element="h3">{locale.footer.widget.captions[0]}</Title>
						<Title element="h3" className={styles.sub}>
							{locale.footer.widget.captions[1]}
						</Title>
						<Link href="https://discord.gg/pretendo" target="_blank" className={styles.link}>
							<ArrowRight size={24} className={styles.arrow} />
							{locale.footer.widget.button}
						</Link>
					</div>
				</div>
			</Section>
		</footer>
	);
}
