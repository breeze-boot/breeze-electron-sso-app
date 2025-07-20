/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'element-plus'
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'element-plus/dist/locale/en.mjs'
declare module 'vue-i18n'
declare module 'crypto-js'
declare module 'json-bigint'

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_SERVER: string
  /** API 基础路径 */
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_MINIO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
