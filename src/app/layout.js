export const metadata = {
	title: {
		template: '%s | Pretendo Network',
		default: 'Pretendo Network', // a default is required when creating a template
	},
	manifest: '/site.webmanifest',
	applicationName: 'Pretendo Network',
	themeColor: '#1b1f3b',
	appleWebApp: {
		title: 'Pretendo Network',
	},
	openGraph: {
		description: 'The React Framework for the Web',
		url: 'https://pretendo.network',
		siteName: 'Pretendo Network',
		images: [
			{
				url: 'https://pretendo.network/assets/images/opengraph/opengraph-image.png',
				width: 727,
				height: 298,
				alt: 'Pretendo Network',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		site: '@PretendoNetwork',
		creator: '@PretendoNetwork',
		url: 'https://pretendo.network/',
		images: ['https://pretendo.network/assets/images/opengraph/opengraph-image.png'],
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
	},
	other: {
		'msapplication-config': '/assets/browserconfig.xml',
	},
};

import '../styles/globals.css';

import { Poppins } from 'next/font/google';
const poppins = Poppins({
	weight: ['400', '700'],
	variable: '--font-poppins',
	fallback: ['Arial', 'Helvetica', 'system-ui', 'sans-serif'],
	subsets: ['latin'], // this is the preloaded subset, all subsets will be available
});

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}) {
	return (
		<html className={`${poppins.variable}`}>
			<body>{children}</body>
		</html>
	);
}
