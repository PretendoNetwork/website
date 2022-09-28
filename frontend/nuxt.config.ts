import eslint from 'vite-plugin-eslint';

export default defineNuxtConfig({
  srcDir: 'src',
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  imports: {
    autoImport: false,
  },
  vite: {
    plugins: [eslint()],
  },
});
