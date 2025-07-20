import { resolve } from 'path'
import { externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import eslintPlugin from 'vite-plugin-eslint'
import { ConfigEnv, loadEnv } from 'vite'

/**
 * @type {import('electron-vite').UserConfig}
 */
export default ({ mode }: ConfigEnv) => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd())
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@renderer/assets/styles/variables.scss";`
          }
        }
      },
      // electron.vite.config.ts 中的代理配置示例
      server: {
        proxy: {
          [env.VITE_APP_BASE_API]: {
            target: env.VITE_APP_BASE_SERVER,
            // 需要代理跨域
            changeOrigin: true,
            // 允许websocket代理
            ws: true,
            // 将api替换为空
            rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
            bypass(req, res, options: any) {
              const proxyURL = options.target + options.rewrite(req.url)
              console.log('proxyURL', proxyURL)
              res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
            }
          }
        }
      },
      plugins: [
        vue(),
        eslintPlugin({
          include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
        }),
        svgLoader({
          defaultImport: 'component' // 以组件形式导入
        })
      ]
    }
  }
}
