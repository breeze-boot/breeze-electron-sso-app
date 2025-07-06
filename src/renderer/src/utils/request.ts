import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import pinia from '@renderer/store'
import { ElMessageBox, ElMessage } from 'element-plus'
import JSONBigInt from 'json-bigint'
import { StorageName } from '@renderer/types/types'
import router from '@renderer/router'
import useUserStore from '@renderer/store/modules/user'
import { convertBigNumberToString } from '@renderer/utils/common.ts'
import i18n from '@renderer/i18n/index'
import { CookiesKey } from '@renderer/utils/cookies.ts'

let userStore: any = undefined

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 50000
})

/**
 * 转换bigNumber
 */
request.defaults.transformResponse = [
  (data: any) => {
    // 此处是使用json-bigint进行json格式化
    return convertBigNumberToString(JSONBigInt.parse(data))
  }
]

/**
 * 请求拦截器
 */
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.responseType === 'blob') {
    config.transformResponse = []
  }

  if (!userStore) {
    userStore = useUserStore(pinia)
  }
  // 如果存在token，请求携带token
  // const accessToken: string = userStore.accessToken
  // if (accessToken && !config.headers[StorageName.Authorization]) {
  //   config.headers[StorageName.Authorization] = `Bearer ${accessToken}`
  // }
  config.headers[CookiesKey.XTenantId] = userStore.tenantId
  config.headers[StorageName.AcceptLanguage] = i18n.global.locale.value
  return config
})

/**
 * 重定向到登录页
 */
const redirectToLogin = async (): Promise<void> => {
  await userStore.logout()
  await router.push({ path: '/login' }).then((): void => {})
}

/**
 * 退出登录
 */
const handle401ErrorLogout = async () => {
  ElMessageBox.confirm(
    i18n.global.t('common.sureToLogOutExitSystem'),
    i18n.global.t('common.tip'),
    {
      confirmButtonText: i18n.global.t('common.confirm'),
      cancelButtonText: i18n.global.t('common.cancel'),
      type: 'warning'
    }
  ).then(async () => {
    await redirectToLogin()
    window.location.reload()
  })
}

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    return data
  },
  async (error: any) => {
    if (!axios.isAxiosError(error)) {
      ElMessage.error(i18n.global.t('axios.systemAbnormality'))
      return Promise.reject()
    }
    if (!error.response) {
      switch (error.code) {
        case 'ECONNABORTED':
          ElMessage.error(`${i18n.global.t('axios.connectionTimedOut')} ${error.message}`)
          return Promise.reject()
        default:
          ElMessage.error(i18n.global.t('axios.systemAbnormality'))
          return Promise.reject()
      }
    }
    // 返回其他请求头
    const { data, status } = error.response
    let { message } = error.response.data
    switch (status) {
      case 401:
        await handle401ErrorLogout()
        data.message = message || i18n.global.t('axios.reLogin')
        return Promise.reject(data)
      case 403:
        message = message || i18n.global.t('axios.insufficientPermissionsReLogin')
        break
      case 404:
        message = message || i18n.global.t('axios.networkRequestNotExist')
        break
      case 503:
        message = message || i18n.global.t('axios.serviceUnavailable')
        break
      case 400:
        message = message || i18n.global.t('axios.requestParameterError')
        break
      case 405:
        message = message || i18n.global.t('axios.preview')
        break
      case 500:
        message = message || i18n.global.t('axios.serverInternalError')
        break
      default:
        message = message || i18n.global.t('axios.unknownError')
        break
    }
    data.message = message
    return Promise.reject(data)
  }
)

export default request
