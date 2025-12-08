export default defineNuxtPlugin(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker 已注册:', registration)
      
      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 发现新版本
              console.log('发现新版本，请刷新页面')
              // 可以在这里显示更新提示
            }
          })
        }
      })

      // 定期检查更新
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // 每小时检查一次
    })

    // 监听网络状态变化
    let isOffline = false
    window.addEventListener('online', () => {
      if (isOffline) {
        console.log('网络已连接')
        isOffline = false
        // 可以显示网络恢复提示
      }
    })
    
    window.addEventListener('offline', () => {
      console.log('网络已断开')
      isOffline = true
      // 可以显示离线提示
    })
  }

  // 注册 Web App Install Banner 事件
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA 安装事件已触发')
    // 这个事件会在 components/PWAInstallPrompt.vue 中处理
  })

  // 监听应用安装成功
  window.addEventListener('appinstalled', () => {
    console.log('PWA 安装成功')
  })
})