<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center max-w-md mx-auto px-4">
      <UIcon name="i-heroicons-wifi" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">无网络连接</h1>
      <p class="text-gray-600 mb-6">请检查您的网络连接，然后重试。</p>
      <UButton @click="refreshPage" color="primary">
        刷新页面
      </UButton>
    </div>
  </div>
</template>

<script setup>
function refreshPage() {
  window.location.reload()
}

// 监听网络状态变化
onMounted(() => {
  window.addEventListener('online', () => {
    // 网络恢复时自动刷新
    window.location.reload()
  })
})
</script>