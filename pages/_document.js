import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
	return (
		<Html>
			<Head>
				<meta charSet="UTF-8" />
				<link rel="manifest" href="/assets/site.webmanifest" />
				<meta name="msapplication-config" content="/assets/browserconfig.xml" />

				{/* windows-ios-chrome */}
				<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
				<meta name="apple-mobile-web-app-title" content="Pretendo Network" />
				<meta name="application-name" content="Pretendo Network" />
				<meta name="msapplication-TileColor" content="#1b1f3b" />
				<meta name="theme-color" content="#1b1f3b" />

				{/* opengraph */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://pretendo.network/" />
				<meta
					property="og:image"
					content="https://pretendo.network/assets/images/opengraph/opengraph-image.png"
				/>
				<meta property="og:image:alt" content="Pretendo Network" />
				<meta property="og:site_name" content="Pretendo Network" />

				{/* twitter */}
				<meta name="twitter:url" content="https://pretendo.network/" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@PretendoNetwork" />
				<meta name="twitter:creator" content="@PretendoNetwork" />

				{/* seo */}
				<meta name="robots" content="index, follow" />

				{/* rss */}
				{/*<link rel="alternate" type="application/rss+xml" title="Pretendo Network Blog" href="/blog/feed.xml"/>*/}

				{/* icons */}
				<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-16x16.png" />
				<link rel="mask-icon" href="/assets/images/icons/safari-pinned-tab.svg" color="#1b1f3b" />
				<link rel="shortcut icon" href="/assets/images/icons/favicon.ico" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
			{/* Cloudflare Web Analytics */}
			<Script
				defer
				src="https://static.cloudflareinsights.com/beacon.min.js"
				data-cf-beacon='{"token": "ea6695987d664a7f90874c9c0dee9385"}'
			></Script>
		</Html>
	);
}
