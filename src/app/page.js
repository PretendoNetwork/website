import Button from '@/components/Button/Button';
import ButtonWidget from '@/components/ButtonWidget/ButtonWidget';
import Caption from '@/components/Caption/Caption';
import Faq from '@/components/Faq/Faq';
import Hero from '@/components/Hero/Hero';
import Logo from '@/components/Logo/Logo';
import TeamCard from '@/components/TeamCard/TeamCard';
import Title from '@/components/Title/Title';
import Section from '@/components/Section/Section';
import ShowcaseSection from '@/components/ShowcaseSection/ShowcaseSection';

import { getLocale } from '@/utils/locale';

import ImageFix from '@/components/ImageFix/ImageFix';

import styles from './page.module.css';

import juxtImage from '@/public/assets/images/showcase/juxt.png';
import networkImage from '@/public/assets/images/showcase/network.png';
import pcmouseImage from '@/public/assets/images/showcase/pcmouse.png';
import wiiuchatImage from '@/public/assets/images/showcase/wiiuchat.png';

const showcaseImages = {
	juxt: juxtImage,
	network: networkImage,
	pcmouse: pcmouseImage,
	wiiuchat: wiiuchatImage,
};

export default function Home(ctx) {
	const { locale } = getLocale('TODO');

	return (
		<main>
			<Section>
				<Hero />
			</Section>

			<div id="showcase">
				<Section className={styles.showcaseSection}>
					<Title>What we make.</Title>
					<Caption>Our project has many components. Here are some of them.</Caption>
				</Section>

				{locale.showcase.map((el, i) => {
					return (
						<ShowcaseSection
							title={el.title}
							caption={el.caption}
							image={showcaseImages[el.image]}
							isOdd={i % 2 !== 0}
							key={i}
						/>
					);
				})}

				<Section className={styles.showcaseTail} contentClassName={styles.content}>
					<ImageFix
						src={wiiuchatImage}
						className={styles.image}
						alt=""
						quality={100}
						sizes="(max-width: 840px) 100vw, 700px"
					/>

					<div className={styles.text}>
						<Title>And much more!</Title>
						<Caption center>
							Check out our progress page for an extensive list of our current progress and goals!
						</Caption>

						<Button primary href="/progress" style={{ margin: '2.5rem auto 0' }}>
							Check progress
						</Button>
					</div>
				</Section>
			</div>

			<Section style={{ paddingBottom: '72px' }}>
				<Title id="faq">{locale.faq.title}</Title>
				<Caption>{locale.faq.text}</Caption>
				<Faq questionObject={locale.faq.QAs} />
			</Section>

			<Section>
				<Title center id="credits">
					{locale.credits.title}
				</Title>
				<Caption center>{locale.credits.text}</Caption>

				<div className={styles.teamWrapper}>
					{locale.credits.people.map((el, i) => {
						return (
							<TeamCard name={el.name} caption={el.caption} pic={el.picture} link={el.github} key={i} />
						);
					})}
				</div>
			</Section>

			<Section>
				<Title id="special-thanks">{locale.specialThanks.title}</Title>
				<Caption>{locale.specialThanks.text}</Caption>

				<div className={styles.thanksAniWrap}>
					<div className={styles.inner}>
						<div className={styles.rowOne}>
							{(() => {
								let ar = locale.specialThanks.people;
								ar = ar.slice(0, Math.round(ar.length / 2));
								ar = ar.concat(ar).concat(ar);
								return ar.map((el, i) => {
									return (
										<TeamCard
											compact
											special={el.special}
											name={el.name}
											caption={el.caption}
											pic={el.picture}
											link={el.github}
											key={i}
										/>
									);
								});
							})()}
						</div>

						<div className={styles.rowTwo}>
							{(() => {
								let ar = locale.specialThanks.people;
								ar = ar.slice(Math.round(ar.length / 2));
								ar = ar.concat(ar).concat(ar);
								return ar.map((el, i) => {
									return (
										<TeamCard
											compact
											special={el.special}
											name={el.name}
											caption={el.caption}
											pic={el.picture}
											link={el.github}
											key={i}
										/>
									);
								});
							})()}
						</div>
					</div>
				</div>
			</Section>

			<Section className={styles.discordJoin}>
				<Section compact>
					<Logo center size={96} className={styles.logo} style={{ marginBottom: '4rem' }} />
					<Title center id="discord-join">
						{locale.discordJoin.title}
					</Title>
					<Caption center>{locale.discordJoin.text}</Caption>
				</Section>

				<ButtonWidget
					primary
					buttonText={locale.discordJoin.widget.button}
					buttonHref="https://discord.gg/pretendo"
					buttonTarget="_blank"
					style={{ margin: '0 auto 4rem' }}
				>
					{locale.discordJoin.widget.text}
				</ButtonWidget>
			</Section>
		</main>
	);
}
