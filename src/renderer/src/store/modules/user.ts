/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { defineStore, StoreDefinition } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginResponseData } from '@renderer/api/login/type'
import { userInfoAPI } from '@renderer/api/login'
import type { UserState } from '@renderer/store/modules/types/types.ts'
import {
  CLEAR_STORAGE,
  GET_OBJ_STORAGE,
  GET_STR_ARRAY_STORAGE,
  GET_STRING_STORAGE,
  SET_OBJ_STORAGE,
  SET_STR_ARRAY_STORAGE,
  SET_STRING_STORAGE
} from '@renderer/utils/storage'
import { AuthoritiesData, AuthoritiesDatas, StorageName, UserInfoData } from '@renderer/types/types'
import { CookiesKey, CookiesStorage } from '@renderer/utils/cookies.ts'

/**
 * 过滤出按钮权限
 */
const filterPermissions = (userInfo: UserInfoData): string[] => {
  if (!userInfo) return []
  return (userInfo.authorities as AuthoritiesDatas).map((item: AuthoritiesData) => item.authority)
}

const useUserStore: StoreDefinition<'User', UserState> = defineStore('User', () => {
  // 状态管理
  const userInfo = ref<UserInfoData>(
    (GET_OBJ_STORAGE(StorageName.UserInfo) as UserInfoData) || ({} as UserInfoData)
  )
  const tenantId = ref<number | null>(CookiesStorage.get(CookiesKey.XTenantId))
  const accessToken = ref<string>(GET_STRING_STORAGE(StorageName.AccessToken) || '')
  const roleCodes = ref<string[]>(GET_STR_ARRAY_STORAGE(StorageName.RoleCodes) || [])
  const permissions = ref<string[]>(GET_STR_ARRAY_STORAGE(StorageName.Permissions) || [])

  // 持久化方法
  const persistUserInfo = () => SET_OBJ_STORAGE(StorageName.UserInfo, userInfo.value)
  const persistTenantId = () => {
    if (tenantId.value !== null) {
      CookiesStorage.set(CookiesKey.XTenantId, tenantId.value)
    } else {
      CookiesStorage.remove(CookiesKey.XTenantId)
    }
  }
  const persistAccessToken = () => SET_STRING_STORAGE(StorageName.AccessToken, accessToken.value)
  const persistRoleCodes = () => SET_STR_ARRAY_STORAGE(StorageName.RoleCodes, roleCodes.value)
  const persistPermissions = () => SET_STR_ARRAY_STORAGE(StorageName.Permissions, permissions.value)

  // 获取用户信息
  const storeUserInfo = async (): Promise<LoginResponseData> => {
    try {
      const response: any = await userInfoAPI()
      const { data } = response
      if (!data) return {} as LoginResponseData

      userInfo.value = data
      tenantId.value = data.tenantId
      roleCodes.value = data.userRoleCodes
      permissions.value = filterPermissions(data)

      // 显式持久化
      persistUserInfo()
      persistTenantId()
      persistRoleCodes()
      persistPermissions()

      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return {} as LoginResponseData
    }
  }

  // 退出登录
  const logout = async () => {
    const env = import.meta.env.MODE
    const baseUrl = import.meta.env.VITE_APP_BASE_SERVER
    const apiPath = env !== 'development' ? '/api' : ''

    window.location.href = `${baseUrl}${apiPath}/sso/logout?satoken=${accessToken.value}&back=${encodeURIComponent(location.origin)}&${CookiesKey.XTenantId}=${CookiesStorage.get(CookiesKey.XTenantId)}`
    await clearLoginInfo()
  }

  // 清除登录信息
  const clearLoginInfo = () => {
    userInfo.value = {} as UserInfoData
    tenantId.value = null
    accessToken.value = ''
    roleCodes.value = []
    permissions.value = []

    // 显式持久化
    persistUserInfo()
    persistTenantId()
    persistAccessToken()
    persistRoleCodes()
    persistPermissions()

    CLEAR_STORAGE()
  }

  // 保存登录信息
  const storeLoginInfo = (token: string) => {
    accessToken.value = token
    persistAccessToken()
  }

  // 保存租户信息
  const storeTenantId = (id: number) => {
    tenantId.value = id
    persistTenantId()
  }

  // 获取权限信息
  const userPermissions = computed(() => {
    return permissions.value.length > 0
      ? permissions.value
      : GET_STR_ARRAY_STORAGE(StorageName.Permissions)
  })

  // 获取角色信息
  const userRoleCodes = computed(() => {
    return roleCodes.value.length > 0
      ? roleCodes.value
      : GET_STR_ARRAY_STORAGE(StorageName.RoleCodes)
  })

  return {
    // 状态
    userInfo,
    tenantId,
    accessToken,
    roleCodes,
    permissions,

    // 方法
    storeUserInfo,
    logout,
    clearLoginInfo,
    storeLoginInfo,
    storeTenantId,

    // 获取器
    userPermissions,
    userRoleCodes
  }
})
export default useUserStore
