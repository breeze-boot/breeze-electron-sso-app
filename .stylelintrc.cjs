// @see https://stylelint.bootcss.com/

module.exports = {
// 简化后的 extends 配置，避免重复继承
  extends: [
    'stylelint-config-standard', // 基础 CSS 规则
    'stylelint-config-standard-scss', // SCSS 扩展规则（已包含推荐规则）
    'stylelint-config-standard-vue', // Vue 模板支持
    'stylelint-config-prettier', // 与 Prettier 兼容
    'stylelint-config-recess-order' // 属性排序
  ],
  overrides: [{
    files: ['**/*.(scss|css|vue|html)'],
    customSyntax: 'postcss-scss'
  },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml'
  ],
  /**
   * null  => 关闭该规则
   * always => 必须
   */
  rules: {
    // 禁止空的样式块
    'block-no-empty': true,

    // 禁止使用未知的 CSS 函数
    'function-no-unknown': true,

    // 禁止使用未知的 CSS 属性
    'property-no-unknown': true,

    // 禁止使用已被废弃的 CSS 属性
    'property-no-vendor-prefix': true,

    // 指定属性的排序规则
    'order/properties-order': [], // 已通过 recess-order 配置

    // SCSS 特定规则
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'selector-pseudo-class-no-unknown': [
      // 不允许未知的选择器
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'] // 忽略属性，修改element默认样式的时候能使用到
      }
    ]
  },
  // 自定义语法支持
  customSyntax: 'postcss-html', // 支持 HTML 和 Vue 模板中的样式

  // 指定需要检查的文件类型
  files: ['**/*.css', '**/*.scss', '**/*.vue', '**/*.html'],

  // 插件列表
  plugins: [
    'stylelint-scss', // SCSS 插件
    'stylelint-order' // 属性排序插件
  ]
}
