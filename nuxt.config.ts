export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	srcDir: './src',

	nitro: {
		prerender: {
			routes: ['/blog/feed.xml']
		}
	},

	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/content',
		'@nuxtjs/i18n'
	],

	eslint: {
		config: {
			standalone: false
		}
	},

	css: ['~/assets/css/main.css'],

	fonts: {
		defaults: {
			weights: [400, 700],
			styles: ['normal', 'italic']
		}
	},

	content: {
		build: {
			markdown: {
				highlight: {
					theme: 'github-dark'
				}
			}
		}
	},

	i18n: {
		compilation: {
			strictMessage: false
		},
		restructureDir: 'src',
		strategy: 'no_prefix',
		defaultLocale: 'en-US',
		vueI18n: '../i18n.config.ts',
		locales: [
			{ code: 'ar-AR', name: 'العربية', file: 'ar_AR.json' },
			{ code: 'ast', name: 'Asturianu', file: 'ast.json' },
			{ code: 'be-BY', name: 'Беларуская', file: 'be_BY.json' },
			{ code: 'ca-ES', name: 'Català', file: 'ca_ES.json' },
			{ code: 'cs-CZ', name: 'Čeština', file: 'cs_CZ.json' },
			{ code: 'cy-GB', name: 'Cymraeg', file: 'cy_GB.json' },
			{ code: 'da-DK', name: 'Dansk', file: 'da_DK.json' },
			{ code: 'de-DE', name: 'Deutsch', file: 'de_DE.json' },
			{ code: 'el-GR', name: 'Ελληνικά', file: 'el_GR.json' },
			{ code: 'en-GB', name: 'English (United Kingdom)', file: 'en_GB.json' },
			{ code: 'en-US', name: 'English (United States)', file: 'en_US.json' },
			{ code: 'en@uwu', name: 'English (lolcat)', file: 'en@uwu.json' },
			{ code: 'eo-XX', name: 'Esperanto', file: 'eo_XX.json' },
			{ code: 'es-ES', name: 'Español', file: 'es_ES.json' },
			{ code: 'fi-FI', name: 'Suomi', file: 'fi_FI.json' },
			{ code: 'fr-CA', name: 'Français (Canada)', file: 'fr_CA.json' },
			{ code: 'fr-FR', name: 'Français', file: 'fr_FR.json' },
			{ code: 'ga-IE', name: 'Gaeilge', file: 'ga_IE.json' },
			{ code: 'gd-GB', name: 'Gàidhlig', file: 'gd_GB.json' },
			{ code: 'gl-ES', name: 'Galego', file: 'gl_ES.json' },
			{ code: 'hr-HR', name: 'Hrvatski', file: 'hr_HR.json' },
			{ code: 'hu-HU', name: 'Magyar', file: 'hu_HU.json' },
			{ code: 'id-ID', name: 'Bahasa Indonesia', file: 'id_ID.json' },
			{ code: 'it-IT', name: 'Italiano', file: 'it_IT.json' },
			{ code: 'ja-JP', name: '日本語', file: 'ja_JP.json' },
			{ code: 'kk-KZ', name: 'Қазақша', file: 'kk_KZ.json' },
			{ code: 'ko-KR', name: '한국어', file: 'ko_KR.json' },
			{ code: 'lt-LT', name: 'Lietuvių', file: 'lt_LT.json' },
			{ code: 'lv-LV', name: 'Latviešu', file: 'lv_LV.json' },
			{ code: 'nb-NO', name: 'Norsk bokmål', file: 'nb_NO.json' },
			{ code: 'nl-NL', name: 'Nederlands', file: 'nl_NL.json' },
			{ code: 'pl-PL', name: 'Polski', file: 'pl_PL.json' },
			{ code: 'pt-BR', name: 'Português (Brasil)', file: 'pt_BR.json' },
			{ code: 'pt-PT', name: 'Português (Portugal)', file: 'pt_PT.json' },
			{ code: 'ro-RO', name: 'Română', file: 'ro_RO.json' },
			{ code: 'ru-RU', name: 'Русский', file: 'ru_RU.json' },
			{ code: 'sk-SK', name: 'Slovenčina', file: 'sk_SK.json' },
			{ code: 'sr-RS', name: 'Српски', file: 'sr_RS.json' },
			{ code: 'sv-SE', name: 'Svenska', file: 'sv_SE.json' },
			{ code: 'tr-TR', name: 'Türkçe', file: 'tr_TR.json' },
			{ code: 'uk-UA', name: 'Українська', file: 'uk_UA.json' },
			{ code: 'tr-TR', name: 'Türkçe', file: 'tr_TR.json' },
			{ code: 'uk-UA', name: 'Українська', file: 'uk_UA.json' },
			{ code: 'zh-CN', name: '中文 (简体)', file: 'zh_CN.json' },
			{ code: 'zh-Hant', name: '中文 (繁體)', file: 'zh_Hant.json' }
		]
	}
});
