// https://nuxt.com/docs/api/configuration/nuxt-config
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth'
  ],
  ui: {
    icons: ['tabler']
  },
  auth: {
    baseURL: "http://localhost:3000/",
    globalAppMiddleware: true,
    pages: {
      signIn: '/login',
    },
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/accounts/login?webpanel=true', method: 'post' },
        getSession: { path: '/accounts/current_user', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/access_token'
      },
      globalMiddlewareOptions: {
        allow404WithoutAuth: true, // Defines if the 404 page will be accessible while unauthenticated
        addDefaultCallbackUrl: '/login', // Defines the default callback URL to redirect to after a successful login
      }
    }
  }
  
})
