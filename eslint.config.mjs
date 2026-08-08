import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';

export default withNuxt([
	...eslintConfig,
	...pluginVue.configs['flat/recommended'],
	{
		rules: {
			'eslint/explicit-function-return-type': 'off'
		}
	},
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
