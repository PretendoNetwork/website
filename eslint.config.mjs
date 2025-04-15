import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';
import { withNuxt } from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...eslintConfig,
	...pluginVue.configs['flat/recommended'],
	{
		files: ['*.vue', '**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			'vue/multi-word-component-names': 'off'
		}
	}
]);
