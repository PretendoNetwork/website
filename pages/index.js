import { getLocale } from '../utils/locale';

import Button from '../components/Button/Button';
import Title from '../components/Title/Title';
import Section from '../components/Section/Section';
import ShowcaseSection from '../components/ShowcaseSection/ShowcaseSection';
import Faq from '../components/Faq/Faq';

import Image from 'next/image';

import styles from './index.module.css';

import { useRouter } from 'next/router';

import juxtImage from '../public/assets/images/showcase/juxt.png';
import networkImage from '../public/assets/images/showcase/network.png';
import pcmouseImage from '../public/assets/images/showcase/pcmouse.png';
import wiiuchatImage from '../public/assets/images/showcase/wiiuchat.png';

const showcaseImages = {
	juxt: juxtImage,
	network: networkImage,
	pcmouse: pcmouseImage,
	wiiuchat: wiiuchatImage,
};

export async function getServerSideProps(ctx) {
	const locale = getLocale(ctx.locale);

	return {
		props: {
			locale,
		},
	};
}

export default function Home({ locale }) {
	const router = useRouter();
	return (
		<main>
			<div id="showcase">
				{locale.showcase.map((element, i) => {
					return (
						<ShowcaseSection
							title={element.title}
							caption={element.caption}
							image={showcaseImages[element.image]}
							isOdd={i % 2 !== 0}
							key={i}
						/>
					);
				})}
				<Section className={styles.showcaseTail} contentClassName={styles.content}>
					<Image
						src={wiiuchatImage}
						className={styles.image}
						alt=""
						quality={100}
						sizes="(max-width: 840px) 100vw, 700px"
					/>
					<div className={styles.text}>
						<Title>And much more!</Title>
						<p className={styles.caption}>
							Check out our progress page for an extensive list of our current progress and goals!
						</p>
						<Button
							isPrimary={true}
							onClick={(e) => {
								e.preventDefault();
								router.push('/progress');
							}}
						>
							Check progress
						</Button>
					</div>
				</Section>
				<Section>
					<Title id="faq">Frequently Asked Questions.</Title>
					<p className={styles.caption}>{locale.faq.text}</p>
					<Faq questionObject={locale.faq.QAs} />
				</Section>
			</div>
		</main>
	);
}
