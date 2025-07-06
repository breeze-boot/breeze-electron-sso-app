<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { THEME } from '@renderer/utils/common.ts'
import useUserStore from '@renderer/store/modules/user'
import useSettingStore from '@renderer/store/modules/setting'
import SvgButton from '@renderer/components/SvgButton/index.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const settingStore = useSettingStore()
let { theme } = storeToRefs(settingStore)
let curLoginUI = ref<boolean>(false)

// 图标状态管理
const iconState = reactive({
  showIcons: false,
  hovering: false,
  iconAngle: 0,
  rotation: 0,
  iconPositions: [
    { x: 0, y: 0, opacity: 0, scale: 0.8 }, // SSO
    { x: 0, y: 0, opacity: 0, scale: 0.8 } // 简单登录
  ]
})

// 登录类型和图标映射
const loginTypes = ref(['sso-login', 'simple-login'])
const loginIcons = ref(['sso-login', 'simple-login'])

/**
 * 初始化
 */
onMounted(async () => {
  const searchParams = new URLSearchParams(window.location.search)
  const authCode = searchParams.get('authCode')
  if (authCode) {
    curLoginUI.value = true
  }
  changeDark()
  changeThemeColor()
  await userStore.clearLoginInfo()
  calculateIconPositions()
  window.addEventListener('resize', calculateIconPositions)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateIconPositions)
})

/**
 * 计算图标位置
 */
const calculateIconPositions = () => {
  // 获取中心容器的实际尺寸
  const centerIconContainer = document.querySelector('.center-icon-container') as HTMLElement
  if (!centerIconContainer) return

  const containerWidth = centerIconContainer.offsetWidth
  const containerHeight = centerIconContainer.offsetHeight

  const radius = Math.min(containerWidth, containerHeight) * 0.4 // 使用容器尺寸的40%作为半径
  const centerX = containerWidth / 2
  const centerY = containerHeight / 2

  for (let i = 0; i < iconState.iconPositions.length; i++) {
    const angle =
      (i * 2 * Math.PI) / iconState.iconPositions.length + (iconState.rotation * Math.PI) / 180
    iconState.iconPositions[i].x = centerX + radius * Math.cos(angle)
    iconState.iconPositions[i].y = centerY + radius * Math.sin(angle)
  }
}

/**
 * 切换日间/夜间模式
 */
const changeDark = () => {
  let html = document.documentElement
  if (theme.value.themeModel !== THEME.DARK) {
    html.classList.remove(THEME.DARK)
    return
  }
  html.classList.add(THEME.DARK)
}

/**
 * 改变主题颜色
 */
const changeThemeColor = () => {
  document.documentElement.style.setProperty('--el-color-primary', theme.value.themeColor)
}

let loading = ref(false)

/**
 * 处理鼠标进入
 */
const handleMouseEnter = () => {
  if (iconState.showIcons) return

  iconState.showIcons = true
  iconState.hovering = true

  // 添加旋转动画
  let startRotation = iconState.rotation
  let targetRotation = startRotation + 360
  let startTime: number | null = null

  // 重置子图标状态
  iconState.iconPositions.forEach((pos) => {
    pos.opacity = 0
    pos.scale = 0.8
  })

  const animateRotation = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / 1000, 1) // 延长动画时间至1秒

    // 应用缓动函数使动画更自然
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
    const easedProgress = easeOutQuart(progress)

    iconState.rotation = startRotation + (targetRotation - startRotation) * easedProgress
    calculateIconPositions()

    // 显示子图标，添加缩放动画
    iconState.iconPositions.forEach((pos, index) => {
      // 让子图标依次出现
      const iconProgress = Math.max(0, easedProgress - index * 0.2)
      pos.opacity = Math.min(iconProgress * 1.5, 1)
      pos.scale = 0.8 + Math.min(iconProgress, 1) * 0.2
    })

    if (progress < 1) {
      requestAnimationFrame(animateRotation)
    }
  }

  requestAnimationFrame(animateRotation)
}

/**
 * 处理鼠标离开
 */
const handleMouseLeave = () => {
  if (!iconState.showIcons) return

  let startTime: number | null = null

  const animateFadeOut = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / 500, 1)

    // 应用缓动函数
    const easeInQuart = (t: number) => Math.pow(t, 4)
    const easedProgress = easeInQuart(progress)

    // 隐藏子图标
    iconState.iconPositions.forEach((pos) => {
      pos.opacity = 1 - easedProgress
      pos.scale = 1 - easedProgress * 0.2
    })

    if (progress < 1) {
      requestAnimationFrame(animateFadeOut)
    } else {
      iconState.showIcons = false
      iconState.hovering = false
    }
  }

  requestAnimationFrame(animateFadeOut)
}
let $router = useRouter()

/**
 * 切换登录方式
 */
const handleSwitchLogin = (type: string) => {
  loading.value = true
  if (type === 'sso-login') {
    // sso登录
    $router.push({ path: '/sso' })
    loading.value = false
    return
  }
  if (type === 'simple-login') {
    // 用户名密码登录
    $router.push({ path: '/simple-login' })
    loading.value = false
    return
  }
}
</script>

<template>
  <el-watermark
    :font="theme.themeModel === THEME.DARK ? theme.lightFont : theme.darkFont"
    :content="theme.watermarkContent"
  >
    <div class="login-container">
      <!-- 中心图标 - 支持悬停效果 -->
      <div v-if="!curLoginUI" class="login-form-card">
        <div
          class="center-icon-container"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <svg-button
            :circle="true"
            :loading="loading"
            icon="login"
            width="10rem"
            height="10rem"
            type="primary"
          />

          <!-- 动态登录方式图标 -->
          <div
            v-for="(pos, index) in iconState.iconPositions"
            :key="index"
            :style="{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              cursor: 'pointer',
              pointerEvents: iconState.showIcons ? 'auto' : 'none',
              transform: 'translate(-50%, -50%) scale(var(--scale))',
              '--scale': pos.scale,
              opacity: pos.opacity,
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }"
          >
            <svg-button
              :circle="true"
              :loading="false"
              :icon="loginIcons[index]"
              width="3rem"
              height="3rem"
              type="primary"
              @svg-btn-click="handleSwitchLogin(loginTypes[index])"
            />
          </div>
        </div>
      </div>
    </div>
  </el-watermark>
</template>

<style lang="scss" scoped>
// 登录场景样式
.login-container {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 48.7% 44.3%, #fefefe 10.5%, #b5eff9 50%);

  .login-form-card {
    position: absolute;
    top: 20vh;
    left: 50%;
    display: flex;
    flex-direction: column;
    place-items: center center;
    justify-content: center;
    width: 28rem;
    height: 25rem;
    border: none;
    transform: translateX(-50%);

    .center-icon-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 300px;
    }
  }
}
</style>
