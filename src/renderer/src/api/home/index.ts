/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@renderer/utils/request'
import { AxiosPromise } from 'axios'

enum API {
  LIST_SSO_CLIENT_URL = '/auth/v1/ssoClient/getHomeSsoClient'
}

/**
 * 获取子系统列表
 */
export function getHomeSsoClient(): AxiosPromise<any> {
  return request({
    url: API.LIST_SSO_CLIENT_URL,
    method: 'get'
  })
}
