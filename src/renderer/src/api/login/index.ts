/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@renderer/utils/request'
import { AxiosPromise } from 'axios'
import { PermissionResponseData } from './type'

enum API {
  LIST_PERMISSION_URL = '/auth/v1/menu/listTreeMenu'
}

/**
 * 获取菜单权限
 *
 * @param i18n 国际化标志
 */
export function listPermission(i18n: string): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.LIST_PERMISSION_URL,
    method: 'get',
    params: {
      platformCode: 'pc',
      i18n: i18n
    }
  })
}

/**
 * 校验是否登录
 */
export function checkIsLogin(): AxiosPromise<PermissionResponseData> {
  return request({
    url: '/sso/isLogin',
    method: 'get'
  })
}

/**
 * 获取sso地址
 */
export function getSsoAuthUrl(back: string): AxiosPromise<PermissionResponseData> {
  return request({
    url: '/sso/getSsoAuthUrl',
    method: 'get',
    params: { clientLoginUrl: back }
  })
}

/**
 * sso 使用 ticket获取 token
 */
export function doLoginByTicket(ticket: string, back: string) {
  return request({
    url: '/sso/doLoginByTicket',
    method: 'get',
    params: {
      ticket,
      back
    }
  })
}

/**
 * sso 用户信息
 */
export function userInfoAPI() {
  return request({
    url: '/sso/userInfo',
    method: 'get'
  })
}

/**
 * dingTalk 授权
 */
export function dingTalkAuth(authCode: string) {
  return request({
    url: '/dingTalk/auth',
    method: 'get',
    params: {
      authCode
    }
  })
}

/**
 * 用户名密码 授权
 */
export function simpleLogin(username: string, password: string) {
  return request({
    url: '/auth/simpleLogin',
    method: 'get',
    params: {
      username,
      password,
      _t: new Date().getTime() // 添加时间戳参数
    }
  })
}
