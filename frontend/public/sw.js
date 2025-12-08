// 自定义 Service Worker
const CACHE_NAME = 'moments-cache-v1'
const urlsToCache = [
  '/',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// 安装事件
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存已打开')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker 安装完成')
        self.skipWaiting()
      })
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker 激活完成')
      return self.clients.claim()
    })
  )
})

// 获取事件
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }

  // API 请求网络优先
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            return new Response('离线模式 - 数据不可用', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            })
          })
        })
    )
    return
  }

  // 静态资源缓存优先
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    }).catch(() => {
      // 返回离线页面
      if (request.destination === 'document') {
        return caches.match('/offline')
      }
      return new Response('离线模式 - 资源不可用', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      })
    })
  )
})

// 消息事件（用于更新）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 推送通知事件
self.addEventListener('push', (event) => {
  console.log('收到推送通知')
  const options = {
    body: event.data ? event.data.text() : '您有新的动态',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'moments-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: '查看'
      },
      {
        action: 'dismiss',
        title: '忽略'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Moments', options)
  )
})

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('通知被点击')
  event.notification.close()

  const urlToOpen = new URL('/', self.location.origin).href

  const promiseChain = clients.openWindow(urlToOpen)
  event.waitUntil(promiseChain)
})