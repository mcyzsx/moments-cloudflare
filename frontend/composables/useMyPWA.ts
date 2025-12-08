export const usemyPWA = () => {
  const isStandalone = ref(false)
  const isOnline = ref(true)
  const updateAvailable = ref(false)

  onMounted(() => {
    // 检查是否以独立模式运行
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true

    // 检查网络状态
    isOnline.value = navigator.onLine

    // 监听网络状态变化
    window.addEventListener('online', () => {
      isOnline.value = true
    })

    window.addEventListener('offline', () => {
      isOnline.value = false
    })

    // 检查 Service Worker 更新
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                updateAvailable.value = true
              }
            })
          }
        })
      })
    }
  })

  // 刷新应用以获取更新
  const refreshApp = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }
    window.location.reload()
  }

  // 触发更新检查
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      registration.update()
    }
  }

  return {
    isStandalone: readonly(isStandalone),
    isOnline: readonly(isOnline),
    updateAvailable: readonly(updateAvailable),
    refreshApp,
    checkForUpdates
  }
}