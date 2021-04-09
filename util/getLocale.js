module.exports = (variant, language) => {
	try {
		return require(`../locales/${variant}_${language}.json`);
	} catch(e) {
		// Use US_en as a fallback
		return require('../locales/US_en.json');
	}
};