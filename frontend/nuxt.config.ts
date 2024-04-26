// https://nuxt.com/docs/api/configuration/nuxt-config
import { Configuration } from "./config"

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/application.scss'],
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    '@nuxt/eslint',
  ],
  experimental: {
    viewTransition: false,
  },
  ui: {
    icons: ['tabler', 'fluent']
  },
  auth: {
    baseURL: `${Configuration.BACKEND_URL}/`,
    globalAppMiddleware: true,
    pages: {
      signIn: '/login',
    },
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/accounts/admin-login', method: 'post' },
        getSession: { path: '/accounts/current_user', method: 'get' },
        signOut: { path: '/accounts/logout', method: 'post' },
      },
      token: {
        signInResponseTokenPointer: '/access_token'
      },
      globalMiddlewareOptions: {
        allow404WithoutAuth: true, // Defines if the 404 page will be accessible while unauthenticated
        addDefaultCallbackUrl: '/login', // Defines the default callback URL to redirect to after a successful login
      },
      sessionDataType: {
        id: 'string',
        username: 'string',
        full_name: 'string',
        email: 'string',
        roles: 'array',
      }
    }
  },
})
