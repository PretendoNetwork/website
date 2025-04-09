import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import { withNuxt } from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...pluginVue.configs['flat/recommended'],
	...eslintConfig,
	{
		rules: {
			'vue/multi-word-component-names': 'off'
		}
	}
]);
