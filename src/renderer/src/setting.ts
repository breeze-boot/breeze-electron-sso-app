import { DEVICE, LANGUAGE, LAYOUT, THEME } from '@renderer/utils/common.ts'
import logoUrl from '@renderer/assets/electron.svg'

/**
 * 用于项目logo | 标题配置
 */
export default {
  title: 'Breeze-Vite-UI',
  defaultIsCollapse: true,
  defaultDevice: DEVICE.PC,
  defaultShowAvatar: false,
  defaultEnableWatermark: true,
  defaultLogoHidden: true,
  defaultMenuLayout: LAYOUT.VERTICAL,
  defaultThemeColor: 'rgb(64, 158, 255)',
  defaultEnableDark: THEME.LIGHT,
  defaultLightFont: {
    color: 'rgba(255, 255, 255, .15)'
  },
  defaultDarkFont: {
    color: 'rgba(0, 0, 0, .15)'
  },
  watermarkContent: ['BREEZE', 'VUE3'],
  defaultLanguage: LANGUAGE.ZH_CN,
  defaultLogoUrl: logoUrl,
  size: 'small',
  // 钉钉登录配置
  dingLogin: {
    redirectUri: 'https://22i24277w6.51vip.biz',
    clientId: 'dingmdfbjobhznnpqsy4',
    state: 'state'
  }
}
