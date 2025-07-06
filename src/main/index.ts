import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 声明窗口变量
let mainWindow: BrowserWindow | null = null

/**
 * 创建主应用窗口
 * 配置并初始化主窗口实例
 */
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1024, // 主窗口更大，提供完整功能
    height: 980,
    minWidth: 760,
    minHeight: 980,
    frame: false, // 无边框窗口
    show: false, // 创建时不立即显示
    autoHideMenuBar: true, // 自动隐藏菜单栏
    ...(process.platform === 'linux' ? { icon } : {}), // Linux 平台设置应用图标
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // 预加载脚本路径
      sandbox: false, // 禁用沙箱
      nodeIntegration: false, // 禁用渲染进程使用 Node.js API
      contextIsolation: true // 禁用上下文隔离
    }
  })

  // 窗口准备好显示时触发
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // 处理窗口内的新窗口打开请求，使用系统默认浏览器打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 窗口关闭时清理引用
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 根据环境加载不同的内容
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发环境加载 Vite 开发服务器地址
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 生产环境加载打包后的 HTML 文件
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 处理登录验证
ipcMain.on('toMainPage', (event, data) => {
  try {
    console.log('收到登录请求:', data, event)
    console.log('登录验证中...')
  } catch (error) {
    console.error('登录过程发生错误:', error)
  }
})

// 处理退出登录请求
ipcMain.handle('logout', async () => {
  mainWindow?.close()
  return { success: true }
})

// 应用生命周期管理
app.whenReady().then(() => {
  // 设置 Windows 平台的应用 ID
  electronApp.setAppUserModelId('com.electron')

  // 为开发环境配置快捷键（F12 打开开发者工具，Ctrl+R 刷新）
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 注册 IPC 事件监听器，当渲染进程发送 'ping' 时打印 'pong'
  ipcMain.on('ping', () => console.log('pong'))

  // 创建登录窗口
  createMainWindow()

  // macOS平台特有的激活处理
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// 所有窗口关闭时的处理
app.on('window-all-closed', () => {
  // 非 macOS 平台退出应用
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
