<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border z-50 max-w-md mx-auto">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="/icons/icon-72x72.png" alt="Moments" class="w-12 h-12 rounded-lg">
        <div>
          <h3 class="font-semibold text-gray-900">安装 Moments 应用</h3>
          <p class="text-sm text-gray-600">在您的设备上获得更好的体验</p>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton size="sm" variant="ghost" @click="dismissPrompt">
          稍后再说
        </UButton>
        <UButton size="sm" color="primary" @click="installPWA">
          安装
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const showInstallPrompt = ref(false)
let deferredPrompt = null

onMounted(() => {
  // 监听 PWA 安装事件
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })

  // 检查是否已经安装
  window.addEventListener('appinstalled', () => {
    console.log('PWA 已安装')
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受了安装')
      } else {
        console.log('用户拒绝了安装')
      }
      showInstallPrompt.value = false
      deferredPrompt = null
    })
  }
}

function dismissPrompt() {
  showInstallPrompt.value = false
}
</script>