import Image from 'next/image';

// stolen from https://github.com/prismicio/prismic-next/pull/79

// TODO: Remove once https://github.com/vercel/next.js/issues/52216 is resolved.
// `next/image` seems to be affected by a default + named export bundling bug.
let ImageFix = Image;
if ('default' in ImageFix) {
	ImageFix = ImageFix.default;
}

export default ImageFix;
