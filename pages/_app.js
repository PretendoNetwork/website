import '../styles/globals.css';

import { Poppins } from '@next/font/google';
const poppins = Poppins({
	weight: ['400', '700'],
	fallback: ['Arial', 'Helvetica', 'system-ui', 'sans-serif'],
	subsets: ['latin'], // this is the preloaded subset, all subsets will be available
});

function Pretendo({ Component, pageProps }) {
	return (
		<main style={poppins.style}>
			<style jsx global>{`
				:root {
					--font-family: ${poppins.style.fontFamily};
				}
			`}</style>
			<Component {...pageProps} />
		</main>
	);
}

export default Pretendo;
