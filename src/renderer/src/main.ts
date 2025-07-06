import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './permission.ts'
import router from './router'
import i18n from '@renderer/i18n/index'
import pinia from '@renderer/store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(ElementPlus)
app.use(i18n)
app.use(pinia)
app.use(ElementPlus, { locale: zhCn, size: 'small', zIndex: 3000 })
app.use(router)
app.mount('#app')
