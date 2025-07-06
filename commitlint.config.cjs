// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 自定义规则（可选）
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式（不影响代码运行的变动）
        'refactor', // 重构
        'test',     // 测试
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回退
        'perf'      // 性能优化
      ]
    ],
    'subject-case': [0], // 允许任意大小写
    'subject-full-stop': [0, 'never'] // 不强制句末标点
  }
}
