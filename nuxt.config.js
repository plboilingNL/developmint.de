import { colors } from './tailwind.js'
import i18n from './i18n'

const titleTemplate = c => c ? `${c} - Developmint` : 'Developmint'
const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd
export default {
  modern: 'client',
  generate: {
    fallback: true
  },
  /*
   * Environment
   */
  env: {
    baseUrl: process.env.BASE_URL || 'https://developmint.de/'
  },

  /*
   * Head of the page
   */
  head: {
    titleTemplate,
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          {
            '@context': 'http://schema.org',
            '@type': 'Corporation',
            'name': 'Developmint',
            'legalName': 'Developmint GbR - Alexander Lichter, Max Langer',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'DE',
              'addressLocality': 'Leipzig',
              'addressRegion': 'Sachsen',
              'postalCode': '04289',
              'streetAddress': 'Corotweg 15'
            },
            'logo': 'https://developmint.de/logo.png',
            'email': 'mailto:support@developmint.de',
            'telephone': '+49 17670625208',
            'url': 'https://developmint.de',
            'sameAs': [
              'https://github.com/Developmint'
            ],
            'foundingDate': '2015-08-10',
            'founders': [
              {
                '@context': 'http://schema.org',
                '@type': 'Person',
                'address': {
                  '@type': 'PostalAddress',
                  'addressCountry': 'DE',
                  'addressLocality': 'Leipzig',
                  'addressRegion': 'Sachsen',
                  'postalCode': '04289',
                  'streetAddress': 'Corotweg 15'
                },
                'name': 'Alexander Lichter',
                'image': 'https://developmint.de/alex@2x.jpg',
                'email': 'mailto:alichter@developmint.de',
                'telephone': '+49 17670625208',
                'jobTitle': 'Founder of Developmint',
                'sameAs': [
                  'https://twitter.com/TheAlexLichter',
                  'https://github.com/manniL',
                  'https://lichter.io',
                  'https://linkedin.com/in/alexanderlichter'
                ]
              },
              {
                '@context': 'http://schema.org',
                '@type': 'Person',
                'name': 'Max Langer',
                'image': 'https://developmint.de/max@2x.jpg',
                'email': 'mailto:mlanger@developmint.de',
                'jobTitle': 'Founder of Developmint',
                'sameAs': [
                  'https://twitter.com/mangerlahn',
                  'https://github.com/mangerlahn',
                  'https://max.codes/',
                  'https://www.linkedin.com/in/max-langer-17b133136/'
                ]
              }
            ],
            'numberOfEmployees': 2,
            'vatID': 'DE301268038',
            'taxID': '231/158/16101'
          })
      }
    ]
  },

  /*
   * Meta information
   */
  meta: {
    name: 'Developmint',
    description: 'Developmint is an experienced Software agency based in Dresden (Germany). Let your visions become' +
      ' reality with us!',
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    author: 'Developmint',
    ogHost: process.env.BASE_URL || 'https://developmint.de/',
    ogSiteName: 'Developmint',
    ogImage: {
      path: 'logo.png'
    },
    twitterCard: 'summary'
  },

  /*
  ** CSS Load
   */
  css: [
    // SCSS file in the project
    '@/assets/styles/app.scss'
  ],

  /*
   * Nuxt plugins
   */
  plugins: [
    '~/plugins/vue-prototype-extensions',
    '~/plugins/vue-scroll-directive.client',
    '~/plugins/vue-observe-visibility-directive.client'
  ],

  /*
   * Modules
   */
  modules: [
    // Simple usage
    ['@nuxtjs/google-analytics', {
      id: 'UA-62902757-7',
      disabled: () => document.cookie.indexOf('ga_optout=true') !== -1,
      debug: {
        sendHitTask: isProd
      },
      set: [
        { field: 'anonymizeIp', value: true }
      ]
    }],
    '@nuxtjs/pwa',
    ['@nuxtjs/axios', { baseURL: '/.netlify/functions/' }],
    ['nuxt-i18n', i18n],
    'nuxt-svg-loader',
    'nuxt-webfontloader'
  ].concat(isDev ? '@nuxtjs/proxy' : []),

  proxy: {
    '/.netlify/functions/': {
      target: 'http://localhost:9000'
    }
  },

  webfontloader: {
    google: {
      families: ['Lato:400,700']
    }
  },

  /*
   * Workbox
   */
  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.(?:googleapis|gstatic).com/(.*)',
        strategyOptions: {
          cacheName: 'google-fonts',
          cacheExpiration: {
            maxEntries: 30,
            maxAgeSeconds: 300
          }
        }
      }
    ]
  },
  /*
   * Customize the progress bar color
   */
  loading: { color: colors.developmint },
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: 'white',
    background: colors.developmint
  },

  /*
   * Manifest
   */
  manifest: {
    name: 'Developmint',
    short_name: 'Developmint',
    start_url: '/',
    display: 'standalone',
    background_color: colors.rains,
    theme_color: colors.developmint
  },

  purgeCSS: {
    mode: 'postcss',
    paths: [
      'i18n/**/*.js'
    ],
    whitelistPatterns: [/cookie-consent/]
  },

  /*
   * Build configuration
   */
  build: {
    transpile: [/vue-if-bot/, /^vue-cookieconsent-component(.*)?$/, 'shifty/src/tweenable'],
    postcss: {
      plugins: {
        tailwindcss: './tailwind.js'
      }
    },

    /*
     * Run ESLint on save
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        if (ctx.isDev) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/
          })
        }
      }
    }
  }
}
