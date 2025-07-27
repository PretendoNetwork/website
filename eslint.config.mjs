import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';

export default [
	...eslintConfig,
	{
		files: ['public/**'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['src/**'],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		ignores: ['**/*.bundled.js']
	}
];
