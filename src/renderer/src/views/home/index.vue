<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
 * @description: 完全响应式的用户欢迎页面（优化版）
 -->
<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { loadGreetings } from '@renderer/utils/times'
import useUserStore from '@renderer/store/modules/user'
import useSettingStore from '@renderer/store/modules/setting.ts'
import { SsoClientUrl } from '@renderer/api/home/type.ts'
import { getHomeSsoClient } from '@renderer/api/home'
import { ElMessage } from 'element-plus'
import MobileNav from '@renderer/views/home/components/MobileNav.vue'
import DesktopNav from '@renderer/views/home/components/DesktopNav.vue'
import ActionItem from '@renderer/views/home/components/ActionItem.vue'
import SvgButton from '@renderer/components/SvgButton/index.vue'

// 状态管理
const settingStore = useSettingStore()
const userStore = useUserStore()

// 数据状态
const ssoClient = ref<SsoClientUrl[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const windowWidth = ref(window.innerWidth)

// 响应式断点定义
const breakpoints = {
  MOBILE: 768,
  TABLET: 1024
}

// 计算属性：设备类型判断
const isMobile = computed(() => windowWidth.value < breakpoints.MOBILE)
const isTablet = computed(
  () => windowWidth.value >= breakpoints.MOBILE && windowWidth.value < breakpoints.TABLET
)
const isDesktop = computed(() => windowWidth.value >= breakpoints.TABLET)

// 计算属性：用户信息是否存在
const hasUserInfo = computed(() => !!userStore.userInfo?.username)

// 计算属性：问候语样式
const greetingStyle = computed(() => ({
  background: 'linear-gradient(135deg, #001529 0%, #165DFF 100%)',
  backgroundClip: 'text',
  '-webkit-background-clip': 'text',
  color: 'transparent'
}))

// 加载系统链接
const handleLoadSystem = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await getHomeSsoClient()

    // 处理返回数据
    if (response.data && response.data.length > 0) {
      // 添加租户ID参数
      ssoClient.value = response.data.map((item: SsoClientUrl) => ({
        ...item,
        url: item.url + '&X-Tenant-Id=1'
      }))
    } else {
      errorMessage.value = '未获取到系统链接数据'
    }
  } catch (error: any) {
    console.error('加载系统链接失败:', error)
    errorMessage.value = error.message || '加载系统链接失败'
    ElMessage.error('加载系统链接失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 卡片点击动画
const handleCardClick = (url: string) => {
  // 添加点击效果
  const linkElement = event.currentTarget as HTMLElement
  linkElement.classList.add('clicked')

  // 延迟跳转以显示动画效果
  setTimeout(() => {
    window.open(url, '_blank')
    linkElement.classList.remove('clicked')
  }, 200)
}

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 页面加载完成后执行
onMounted(() => {
  handleLoadSystem()
  window.addEventListener('resize', handleResize)

  // 为了更好的用户体验，添加页面进入动画
  document.body.classList.add('page-loaded')
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <!-- 顶部导航栏 - 响应式调整 -->
  <header class="top-nav">
    <div class="logo" style="color: red">
      <svg-button
        :circle="true"
        :loading="loading"
        icon="electron"
        width="1.4rem"
        height="1.4rem"
        type="primary"
      />
      <span class="logo-text">企业管理平台</span>
    </div>

    <!-- 导航菜单根据设备类型显示不同布局 -->
    <div class="nav-menu">
      <template v-if="isMobile">
        <mobile-nav :user-info="userStore.userInfo" @logout="userStore.logout" />
      </template>
      <template v-else>
        <desktop-nav :user-info="userStore.userInfo" @logout="userStore.logout" />
      </template>
    </div>
  </header>

  <main class="welcome-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 欢迎卡片 -->
      <el-card class="welcome-card animate-fade-in">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">欢迎回来，{{ userStore.userInfo?.username || '用户' }}</h2>
            <div v-if="!isMobile" class="card-actions">
              <el-button size="small" type="text" icon="el-icon-refresh" @click="handleLoadSystem">
                刷新
              </el-button>
            </div>
          </div>
        </template>

        <div class="welcome-content">
          <div class="user-profile">
            <!-- 移动端显示简洁的头像和问候 -->
            <div v-if="isMobile" class="mobile-profile">
              <el-avatar
                :size="80"
                :src="userStore.userInfo?.avatar || settingStore.settings.logoUrl"
                class="user-avatar-big"
              />
              <h3 class="greeting-mobile" :style="greetingStyle">
                {{ loadGreetings() }}，{{ userStore.userInfo?.username || '尊敬的用户' }}
              </h3>
            </div>

            <!-- 桌面端和iPad显示完整信息 -->
            <div v-else class="desktop-profile">
              <el-avatar
                :size="120"
                :src="userStore.userInfo?.avatar || settingStore.settings.logoUrl"
                class="user-avatar-big"
              />
              <div class="user-details">
                <h3 class="greeting" :style="greetingStyle">
                  {{ loadGreetings() }}，{{
                    userStore.userInfo?.realName || userStore.userInfo?.username || '尊敬的用户'
                  }}！
                </h3>
                <p class="welcome-message">每一天，都是您迈向卓越的新起点！</p>

                <div class="user-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{
                      userStore.userInfo?.roleName || '未分配角色'
                    }}</span>
                    <span class="stat-label">角色</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ userStore.userInfo?.loginCount || 0 }}</span>
                    <span class="stat-label">登录次数</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{
                      userStore.userInfo?.lastLoginTime || '首次登录'
                    }}</span>
                    <span class="stat-label">上次登录</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 系统链接卡片 -->
      <el-card class="systems-card animate-fade-in" style="animation-delay: 0.2s">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">快速访问</h2>
            <div class="card-subtitle">常用系统与服务</div>
          </div>
        </template>

        <div class="systems-grid">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-placeholder">
            <el-skeleton animated :count="isMobile ? 3 : isTablet ? 4 : 6" />
          </div>

          <!-- 错误状态 -->
          <div v-else-if="errorMessage" class="error-message">
            <el-alert title="加载失败" type="error" :description="errorMessage" show-icon />
          </div>

          <!-- 系统链接 -->
          <div v-else class="systems-list">
            <div
              v-for="(item, index) in ssoClient"
              :key="item.clientId || index"
              class="system-card"
              @click="handleCardClick(item.url)"
            >
              <div class="card-icon">
                <i :class="item.iconClass || 'el-icon-link'" />
              </div>
              <div class="card-content">
                <h3 class="card-name">{{ item.clientName }}</h3>
                <p v-if="!isMobile" class="card-desc">{{ item.description || '点击访问' }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 快捷操作卡片 - 响应式调整 -->
      <el-card class="quick-actions animate-fade-in" style="animation-delay: 0.4s">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">快捷操作</h2>
            <div class="card-subtitle">常用功能入口</div>
          </div>
        </template>

        <div class="actions-grid">
          <!-- 移动端显示为两列 -->
          <div v-if="isMobile" class="actions-grid-mobile">
            <action-item icon="el-icon-user" text="个人中心" @click="console.log('打开个人中心')" />
            <action-item icon="el-icon-setting" text="系统设置" @click="console.log('打开设置')" />
            <action-item icon="el-icon-question" text="帮助中心" @click="console.log('查看帮助')" />
            <action-item icon="el-icon-bell" text="消息通知" @click="console.log('查看通知')" />
          </div>

          <!-- 桌面端显示为四列 -->
          <div v-else class="actions-grid-desktop">
            <action-item icon="el-icon-user" text="个人中心" @click="console.log('打开个人中心')" />
            <action-item icon="el-icon-setting" text="系统设置" @click="console.log('打开设置')" />
            <action-item icon="el-icon-question" text="帮助中心" @click="console.log('查看帮助')" />
            <action-item icon="el-icon-bell" text="消息通知" @click="console.log('查看通知')" />
          </div>
        </div>
      </el-card>
    </div>
  </main>

  <!-- 页脚 - 响应式调整 -->
  <footer class="footer">
    <div class="footer-content">
      <div class="copyright">© 2023 企业管理平台. 保留所有权利.</div>
      <div v-if="!isMobile" class="footer-links">
        <a href="#" target="_blank">使用条款</a>
        <a href="#" target="_blank">隐私政策</a>
        <a href="#" target="_blank">联系我们</a>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
/* 基础样式 - 优化SASS变量和结构 */
$primary-color: #165dff;
$primary-light: rgba(22, 93, 255, 0.1);
$text-primary: #001529;
$text-secondary: rgba(124, 124, 124, 0.42);
$bg-light: #f5f7fa;
$border-color: #e6e9ed;
$shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.08);
$header-height: 80px;
$footer-height: 80px;

/* 页面整体布局 */
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部导航优化 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $header-height;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: $shadow-sm;
  z-index: 100;

  .logo {
    display: flex;
    align-items: center;

    .logo-img {
      height: 36px;
      margin-right: 8px;
    }

    .logo-text {
      font-size: 1rem;
      font-weight: bold;
      color: $text-primary;
    }
  }

  .nav-menu {
    display: flex;
    align-items: center;
  }
}

/* 主内容区域优化 */
.welcome-container {
  position: fixed;
  top: $header-height;
  left: 0;
  height: calc(100vh - $header-height - $footer-height);
  width: 100vw;
  flex: 1;
  padding: 20px;
  background-color: $bg-light;
  overflow: auto; /* 启用垂直滚动 */

  /* 隐藏滚动条但保留滚动功能 */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 卡片基础样式 */
.welcome-card,
.systems-card,
.quick-actions {
  border-radius: 12px;
  box-shadow: $shadow-md;
  margin-bottom: 20px;
  border: none;
  transition: all 0.3s ease;
  background-color: #fff;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;

    .card-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: 4px;
    }

    .card-subtitle {
      font-size: 0.85rem;
      color: $text-secondary;
    }
  }
}

/* 欢迎卡片样式 */
.welcome-card {
  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;

    .mobile-profile,
    .desktop-profile {
      width: 100%;
    }

    .mobile-profile {
      display: flex;
      flex-direction: column;
      align-items: center;

      .greeting-mobile {
        font-size: 1.3rem;
        font-weight: bold;
        margin-top: 12px;
      }
    }

    .desktop-profile {
      display: flex;
      flex-direction: row;
      align-items: center;

      .user-avatar-big {
        border: 3px solid $primary-color;
        box-shadow: 0 0 15px $primary-light;
      }

      .user-details {
        margin-left: 24px;

        .greeting {
          font-size: 1.6rem;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .welcome-message {
          font-size: 1rem;
          color: $text-secondary;
          margin-bottom: 16px;
        }

        .user-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;

          .stat-item {
            display: flex;
            flex-direction: column;

            .stat-value {
              font-size: 1rem;
              font-weight: bold;
              color: $text-primary;
            }

            .stat-label {
              font-size: 0.8rem;
              color: $text-secondary;
            }
          }
        }
      }
    }
  }
}

/* 系统链接卡片样式 */
.systems-card {
  .systems-list {
    display: grid;
    /* 响应式网格布局 - 移动端2列，平板3列，桌面4列 */
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 18px;
  }

  .system-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 12px;
    background-color: #fff;
    border: 1px solid $border-color;
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;

    &:hover {
      transform: translateY(-5px);
      box-shadow: $shadow-lg;
      border-color: $primary-color;
    }

    &.clicked {
      transform: scale(0.95);
      transition: transform 0.2s;
    }

    .card-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: $primary-light;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      i {
        font-size: 28px;
        color: $primary-color;
      }
    }

    .card-content {
      text-align: center;

      .card-name {
        font-size: 1.1rem;
        font-weight: bold;
        color: $text-primary;
        margin-bottom: 8px;
      }

      .card-desc {
        font-size: 0.9rem;
        color: $text-secondary;
        line-height: 1.4;
      }
    }
  }

  .loading-placeholder {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .error-message {
    padding: 16px;
  }
}

/* 快捷操作卡片样式 */
.quick-actions {
  .actions-grid-mobile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .actions-grid-desktop {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 12px;
    background-color: $bg-light;
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;

    &:hover {
      background-color: $border-color;
      transform: translateY(-2px);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: $primary-light;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;

      i {
        font-size: 24px;
        color: $primary-color;
      }
    }

    .action-text {
      font-size: 1rem;
      font-weight: 500;
      color: $text-primary;
      text-align: center;
    }
  }
}

/* 页脚样式 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  height: $footer-height;
  padding: 0 16px;
  border-top: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(124, 124, 124, 0.6);

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;

    .copyright {
      font-size: 0.85rem;
      margin-bottom: 8px;
    }

    .footer-links {
      display: flex;
      gap: 20px;
      font-size: 0.85rem;

      a {
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: $primary-color;
        }
      }
    }
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

/* 页面加载动画 */
body {
  opacity: 0;
  transition: opacity 0.5s ease;

  &.page-loaded {
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-container {
    padding: 15px;

    .welcome-content {
      align-items: center;
    }
  }

  .main-content {
    padding: 0;
  }

  .welcome-card,
  .systems-card,
  .quick-actions {
    margin-bottom: 15px;
    padding: 15px;
  }
}
</style>
