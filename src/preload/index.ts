import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义渲染器API
const api = {
  // 发送登录消息到主进程
  toMainPage: (data: any) => {
    ipcRenderer.send('toMainPage', data)
  },
  onLoginResponse: (callback: (data: any) => void) =>
    ipcRenderer.on('login-response', (_, data) => callback(data))
}

// 使用 contextBridge 暴露 Electron API 到渲染器
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      // 仅暴露必要的 API
      ipcRenderer: {
        ...api,
        ...electronAPI
      }
    })
  } catch (error) {
    console.error('Failed to expose Electron API:', error)
  }
} else {
  // 上下文隔离禁用时的回退方案
  // @ts-ignore
  window.electron = {
    ipcRenderer: {
      ...api,
      ...electronAPI
    }
  }
}
