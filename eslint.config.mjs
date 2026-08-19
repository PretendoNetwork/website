import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...eslintConfig,
	...pluginVue.configs['flat/recommended'],
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@eslint-community/eslint-comments/disable-enable-pair': 'off',
			'no-restricted-imports': 'off'
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
	},
	{
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: [
						'./.nuxt/tsconfig.json'
					]
				}
			}
		}
	},
	{
		ignores: ['.output', '.nuxt', '.old']
	}
]);
