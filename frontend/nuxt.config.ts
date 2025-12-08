// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: false},
    modules: [
        "@nuxt/ui", 
        '@nuxt/icon', 
        '@nuxtjs/color-mode', 
        '@vueuse/nuxt', 
        'dayjs-nuxt',
        '@vite-pwa/nuxt'  // 添加 PWA 模块
    ],
    ssr: false,
    nitro: {
        preset: 'static',
    },
    runtimeConfig: {
        public: {
            apiBase: ''
        }
    },
    dayjs: {
        locales: ['zh'],
        defaultLocale: 'zh'
    },
    icon: {
        clientBundle: {
            scan: {
                globInclude: ['**/*.{vue,jsx,tsx}', 'node_modules/@nuxt/ui/**/*.js'],
                globExclude: ['.*', 'coverage', 'test', 'tests', 'dist', 'build'],
            },
        },
    },
    tailwindcss: {
        safelist: [
            'grid-cols-1',
            'grid-cols-3',
        ]
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag:string) => ['meting-js'].includes(tag),
        },
    },
    
    // PWA 配置
    pwa: {
        registerType: 'autoUpdate',
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'gstatic-fonts-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^\/api\/.*/i,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 60 * 5 // 5 minutes
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                {
                    urlPattern: /^\/r2\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'r2-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 20
        },
        devOptions: {
            enabled: true,
            type: 'module',
            navigateFallbackAllowlist: [/^\/$/]
        },
        manifest: {
            name: 'Moments - 极简朋友圈',
            short_name: 'Moments',
            description: '基于 Cloudflare 的极简朋友圈系统，支持离线访问',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            id: '/',
            icons: [
                {
                    src: 'icons/icon-72x72.png',
                    sizes: '72x72',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-96x96.png',
                    sizes: '96x96',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-128x128.png',
                    sizes: '128x128',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-144x144.png',
                    sizes: '144x144',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-152x152.png',
                    sizes: '152x152',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-384x384.png',
                    sizes: '384x384',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: 'icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ],
            categories: ['social', 'lifestyle'],
            lang: 'zh-CN'
        }
    },

    app: {
        head: {
            meta: [
                { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no" },
                { charset: "utf-8" },
                // PWA 相关 meta 标签
                { name: "theme-color", content: "#ffffff" },
                { name: "apple-mobile-web-app-capable", content: "yes" },
                { name: "apple-mobile-web-app-status-bar-style", content: "default" },
                { name: "apple-mobile-web-app-title", content: "Moments" },
                { name: "format-detection", content: "telephone=no" },
                { name: "mobile-web-app-capable", content: "yes" }
            ],
            link: [
                { href: `/css/APlayer.min.css`, rel: 'stylesheet' },
                // 添加 PWA 相关链接
                { rel: "manifest", href: "/manifest.json" },
                { rel: "apple-touch-icon", href: "/icons/icon-152x152.png" },
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/icon-32x32.png" },
                { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/icon-16x16.png" },
                { rel: "mask-icon", href: "/icons/safari-pinned-tab.svg", color: "#3B82F6" }
            ],
            script: [
                {src: `/js/APlayer.min.js`, type: 'text/javascript', async: true, defer: true},
                {src: `/js/Meting.min.js`, type: 'text/javascript', async: true, defer: true},
                { src: `/js/main.js`, type: 'text/javascript', async: true, defer: true },
            ]
        }
    },
    vite: {
        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:8787",
                    // changeOrigin: true,
                },
                "/r2": {
                    target: "http://localhost:8787",
                    // changeOrigin: true,
                },
                "/upload": {
                    target: "http://localhost:8787",
                    // changeOrigin: true,
                },
                "/rss": {
                    target: "http://localhost:8787",
                    // changeOrigin: true,
                },
                "/swagger": {
                    target: "http://localhost:8787",
                    // changeOrigin: true,
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    hashCharacters: 'base36'
                }
            }
        }
    }
})