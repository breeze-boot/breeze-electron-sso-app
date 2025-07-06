/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
export const loginRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@renderer/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/simple-login',
    name: 'SimpleLogin',
    component: () => import('@renderer/views/login/simple-login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/sso',
    name: 'Sso',
    component: () => import('@renderer/views/login/sso/index.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true,
      type: 1,
      href: 0
    }
  },
  {
    path: '/sso-login',
    name: 'SsoLogin',
    component: () => import('@renderer/views/login/sso/sso-login/index.vue'),
    meta: {
      title: 'sso登录',
      icon: 'sso-login',
      hidden: true,
      type: 1,
      href: 0
    }
  }
]

export const constantRoutes = [
  {
    path: '/home',
    name: 'Layout',
    component: () => import('@renderer/views/home/index.vue'),
    meta: {
      title: '',
      hidden: false,
      type: 0,
      href: 0
    }
  }
]
