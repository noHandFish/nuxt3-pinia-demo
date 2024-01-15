// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',
  modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
      'tdesign-vue-next/es/nuxt',
  ],
    build: {
        transpile: ['tdesign-vue-next'],
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: true,
    }
})
