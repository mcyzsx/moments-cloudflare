<template>
  <!-- 主体容器 -->
  <div
    class="w-full md:w-[567px] mx-auto h-full shadow-2xl dark:bg-neutral-900"
  >
    <slot />
    <Footer />
  </div>

  <!-- 网易云音乐 mini 播放器 -->
  <div
    class="netease-mini-player"
    data-playlist-id="13681647281"
    data-embed="false"
    data-position="bottom-right"
    data-lyric="true"
    data-theme="auto"
    data-default-minimized="true"
  ></div>

  <!-- 桌面端回到顶部 -->
  <div
    title="到顶部"
    v-if="y > 200"
    @click="y = 0"
    class="hidden sm:block bottom-[20%] sm:right-[20%] md:right-[10%] lg:right-[15%] xl:right-[20%] 2xl:right-[28%] fixed flex items-center justify-center"
  >
    <UIcon
      name="i-lets-icons-expand-top-stop"
      class="w-10 h-10 text-gray-500 cursor-pointer"
    />
  </div>

  <!-- 移动端悬浮按钮组 -->
  <div class="sm:hidden relative">
    <div class="right-0 bottom-10 fixed flex items-center justify-end">
      <div class="flex flex-col items-center gap-2">
        <!-- 回到顶部 -->
        <div
          v-if="y > 300"
          @click="y = 0"
          class="dark:bg-gray-900/85 mr-4 rounded-full bg-slate-50 w-10 h-10 flex items-center justify-center shadow-xl"
        >
          <UIcon
            name="i-lets-icons-expand-top-stop"
            class="w-6 h-6 text-[#9fc84a] cursor-pointer"
          />
        </div>
        <!-- 发布按钮 -->
        <NuxtLink
          to="/new"
          v-if="global.userinfo.token && $route.path === '/'"
          class="dark:bg-gray-900/85 mr-4 rounded-full bg-slate-50 w-10 h-10 flex items-center justify-center shadow-xl"
        >
          <UIcon name="i-carbon-camera" class="w-6 h-6 text-[#9fc84a]" />
        </NuxtLink>
        <!-- 更多菜单 -->
        <div
          class="dark:bg-gray-900/85 mr-4 rounded-full bg-slate-50 w-10 h-10 flex items-center justify-center shadow-xl"
          @click="open = true"
        >
          <UIcon
            name="i-icon-park-solid-more-four"
            class="w-6 h-6 text-[#9fc84a] cursor-pointer"
          />
        </div>
        <!-- 登录按钮 -->
        <NuxtLink
          to="/user/login"
          v-if="!global.userinfo.token && $route.path === '/'"
          class="dark:bg-gray-900/85 mr-4 rounded-full bg-slate-50 w-10 h-10 flex items-center justify-center shadow-xl"
        >
          <UIcon name="i-carbon-login" class="w-6 h-6 text-[#9fc84a]" />
        </NuxtLink>
      </div>
    </div>

    <MobileNav :open="open" />
  </div>

  <!-- ======== PWA 相关组件 ======== -->
  <!-- 安装提示 -->
  <PWAInstallPrompt />

  <!-- 更新提示 -->
  <div
    v-if="updateAvailable"
    class="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2"
  >
    <span>有新版本可用</span>
    <UButton size="xs" color="white" variant="ghost" @click="refreshApp">
      立即更新
    </UButton>
  </div>

  <!-- 离线提示 -->
  <div
    v-if="!isOnline"
    class="fixed top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
  >
    离线模式
  </div>
</template>

<script lang="ts" setup>
import type { SysConfigVO, UserVO } from "~/types";
import { useGlobalState } from "~/store";
import { usemyPWA } from "~/composables/useMyPWA";

/* ---------- 原有逻辑完全保留 ---------- */
const global = useGlobalState();
const open = useState<boolean>("sidebarOpen", () => false);
const currentUser = useState<UserVO>("userinfo");
const sysConfig = useState<SysConfigVO>("sysConfig");
const currentProfile = await useMyFetch<UserVO>("/user/profile");
const sysConfigVO = await useMyFetch<SysConfigVO>("/sysConfig/get");
if (currentProfile) {
  currentUser.value = currentProfile;
  sysConfig.value = sysConfigVO;
}
const { y } = useWindowScroll();

/* ---------- PWA 新增逻辑 ---------- */
// 使用 PWA composable
const { isOnline, updateAvailable, refreshApp } = usemyPWA();

/* ---------- 原有 head 完全保留 ---------- */
useHead({
  title: sysConfigVO.title,
  link: [
    {
      rel: "shortcut icon",
      type: "image/png",
      href: sysConfigVO.favicon || "/favicon.png",
    },
    {
      rel: "apple-touch-icon-precomposed",
      href: sysConfigVO.favicon || "/favicon.png",
    },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: "我的 RSS 订阅",
      href: sysConfigVO.rss || `/rss`,
    },
  ],
  style: [
    {
      innerHTML: sysConfigVO.css || "",
    },
  ],
  script: [
    {
      type: "text/javascript",
      innerHTML: sysConfigVO.js || "",
    },
  ],
});

if (sysConfigVO.enableGoogleRecaptcha) {
  useHead({
    script: [
      {
        type: "text/javascript",
        src: `https://recaptcha.net/recaptcha/api.js?render=${sysConfigVO.googleSiteKey}`,
      },
    ],
  });
}
</script>