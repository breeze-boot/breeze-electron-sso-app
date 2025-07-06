import router from '@renderer/router'
import setting from '@renderer/setting'
import pinia from '@renderer/store'
import useUserStore from '@renderer/store/modules/user'

const whiteRoute: string[] = [
  '/login',
  '/sso-login',
  '/ding-scan',
  '/simple-login',
  '/ding-auth',
  '/sso'
]
const userStore = useUserStore(pinia)

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  // 设置文档标题
  document.title = (to.meta.title || '') + ` | ${setting.title}`
  const token = userStore.accessToken as string
  // 用户未登录
  if (!token) {
    if (whiteRoute.includes(to.path)) {
      next() // 白名单路由直接放行
      return
    } else {
      next({ path: '/login', query: { redirect: to.path, ...to.query } }) // 重定向到登录页
      return
    }
  }

  // 菜单已初始化
  if (to.path === '/login' || to.path === '/sso-login' || to.path === '/sso') {
    next({ path: '/home' }) // 重定向到主页
    return
  }

  // 处理无效路由
  if (to.matched.length === 0) {
    next({ path: '/login' })
    return
  }

  // 继续导航
  next()
})

// 全局后置守卫
router.afterEach(() => {})
