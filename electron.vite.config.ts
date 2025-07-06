import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
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
          additionalData: `@import "@renderer/assets/styles/variables.scss";`
        }
      }
    },
    // electron.vite.config.ts 中的代理配置示例
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:9000', // 后端地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
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
})
