<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster richColors position="top-center" />
  </NuxtLayout>

  <!-- ===== PWA 相关：更新提示 & 离线横幅 ===== -->
  <!-- 新版本提示 -->
  <div
    v-if="updateAvailable"
    class="fixed top-4 right-4 z-[9999] flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg"
  >
    <span>有新版本可用</span>
    <UButton size="xs" color="white" variant="ghost" @click="refreshApp">
      立即更新
    </UButton>
  </div>

  <!-- 离线提示 -->
  <div
    v-if="!isOnline"
    class="fixed top-4 left-4 z-[9999] rounded-lg bg-orange-500 px-4 py-2 text-white shadow-lg"
  >
    已离线 · 部分功能可能受限
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '~/assets/simple-markdown.scss'
import { usemyPWA } from './composables/useMyPWA';

/* ---------- PWA ---------- */
const { isOnline, updateAvailable, refreshApp } = usemyPWA()
</script>

<style>
/* 隐藏谷歌 reCAPTCHA 徽章 */
div.grecaptcha-badge {
  display: none !important;
}
</style>