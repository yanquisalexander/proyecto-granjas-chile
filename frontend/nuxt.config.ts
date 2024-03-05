// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { Configuration } from "./config"

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/application.scss'],
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
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
        signIn: { path: '/accounts/login?webpanel=true', method: 'post' },
        getSession: { path: '/accounts/current_user', method: 'get' }
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
        email: 'string',
        roles: 'array',
      }
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  build: {
    transpile: ['vuetify'],
  }
})
