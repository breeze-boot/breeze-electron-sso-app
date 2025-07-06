<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-form-card">
        <div class="login-header">
          <h1>系统登录</h1>
          <p>请输入账号密码登录系统</p>
        </div>

        <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="0" class="login-form">
          <el-form-item label="" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :disabled="loading"
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :disabled="loading"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>

          <el-form-item label="" prop="tenantId">
            <el-select
              v-model="form.tenantId"
              placeholder="请选择租户"
              style="width: 100%"
              filterable
              @change="() => userStore.storeTenantId(form.tenantId)"
            >
              <el-option
                v-for="item in tenantOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item style="margin-top: 30px; text-align: center">
            <el-button
              :loading="loading"
              type="primary"
              :style="{ width: '100%', height: '48px', fontSize: '16px', fontWeight: '500' }"
              :class="{ 'btn-pulse': !loading }"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <div class="tenant-info">
            <span>当前租户:</span>
            <span class="tenant-name">{{ tenantName }}</span>
          </div>
          <div class="copyright">© {{ new Date().getFullYear() }} 系统版权所有</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SALES, SelectData } from '@renderer/types/types.ts'
import { simpleLogin } from '@renderer/api/login'
import useUserStore from '@renderer/store/modules/user.ts'
import { selectTenant } from '@renderer/api/auth/tenant'
import { useMessage } from '@renderer/hooks/message'
import { encrypt } from '@renderer/utils/common.ts'

const $router = useRouter()

// 表单状态
const form = reactive({
  username: 'admin',
  password: '123456',
  tenantId: ''
})

// 组件状态
const tenantOption = ref<SelectData[]>([])
const loading = ref(false)
const rules = ref({
  tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
const loginFormRef = ref<any>()

// 获取当前租户名称
const tenantName = computed(() => {
  const selected = tenantOption.value.find((item) => item.value === form.tenantId)
  return selected ? selected.label : '未选择'
})
let userStore = useUserStore()

/**
 * 初始化租户下拉框
 */
const initSelectTenant = async () => {
  try {
    const response: any = await selectTenant()
    tenantOption.value = response.data
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

onMounted(() => {
  initSelectTenant()
})

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // 模拟登录接口
    const response: any = await simpleLogin(form.username, encrypt(form.password!.trim(), SALES))
    // 存储用户信息
    await userStore.storeLoginInfo(response.data.access_token)
    await userStore.storeUserInfo()
    ElMessage.success('登录成功')
    await $router.push({ path: '/' })
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 现代配色方案 - 采用深色调与高对比度元素 */
$primary-color: #409eff; /* 主色调 - 柔和蓝色 */
$primary-dark: #3083e0; /* 主色深色 */
$primary-light: #e6f7ff; /* 主色浅色 */
$secondary-color: #67c23a; /* 辅助色 - 成功绿色 */
$text-primary: #303133; /* 主文本色 */
$text-secondary: #606266; /* 次文本色 */
$border-color: #dcdfe6; /* 边框色 */
$bg-primary: #fff; /* 主背景色 */
$bg-secondary: #f5f7fa; /* 次背景色 */
$input-focus: #409eff; /* 输入框聚焦色 */
$shadow-light: 0 2px 12px 0 rgb(0 0 0 / 10%);
$shadow-medium: 0 4px 24px 0 rgb(0 0 0 / 12%);
$transition: all 0.3s ease;

.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  /* 背景装饰元素 - 现代几何图形 */
  &::before,
  &::after {
    position: absolute;
    z-index: 0;
    content: '';
    opacity: 0.08;
  }

  &::before {
    top: 20%;
    left: 5%;
    width: 300px;
    height: 300px;
    background: $primary-color;
    border-radius: 50%;
  }

  &::after {
    right: 8%;
    bottom: 15%;
    width: 200px;
    height: 200px;
    background: $secondary-color;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }

  .login-form-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;

    .login-form-card {
      overflow: hidden;
      background: $bg-primary;
      border-radius: 24px;
      box-shadow: $shadow-medium;
      transition: $transition;

      &:hover {
        box-shadow: 0 10px 30px 0 rgb(0 0 0 / 15%);
        transform: translateY(-5px);
      }

      .login-header {
        position: relative;
        padding: 45px 40px 35px;
        overflow: hidden;
        color: white;
        text-align: center;
        background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
        border-radius: 0 0 30px 30px;

        &::before {
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 120px;
          height: 120px;
          content: '';
          background: rgb(255 255 255 / 10%);
          border-radius: 50%;
        }

        h1 {
          position: relative;
          z-index: 1;
          margin-bottom: 12px;
          font-size: 32px;
          font-weight: 700;
        }

        p {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: 16px;
          opacity: 0.9;
        }
      }

      .login-form {
        padding: 40px;

        .el-form-item {
          margin-bottom: 28px;

          .el-input {
            height: 50px;
            border-radius: 12px;
            transition: $transition;

            &:focus-within {
              .el-input__inner {
                border-color: $input-focus;
                box-shadow: 0 0 0 3px rgb(64 158 255 / 20%);
              }
            }

            .el-input__inner {
              height: 50px;
              padding-left: 45px;
              font-size: 16px;
              background-color: $bg-secondary;
              border-color: $border-color;
              border-radius: 12px;
              transition: $transition;
            }

            .el-input__prefix {
              width: 40px;
              font-size: 18px;
              line-height: 50px;
              color: $text-secondary;
              text-align: center;
            }

            .el-input__suffix {
              width: 40px;
              font-size: 18px;
              line-height: 50px;
              color: $text-secondary;
              text-align: center;
              cursor: pointer;

              &:hover {
                color: $primary-color;
              }
            }
          }
        }
      }

      .login-footer {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 25px 40px 30px;
        background-color: $bg-secondary;
        border-top: 1px solid $border-color;
        border-radius: 0 0 24px 24px;

        .tenant-info {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-primary;

          .tenant-name {
            margin-left: 8px;
            font-weight: 500;
            color: $primary-color;
          }
        }

        .copyright {
          font-size: 13px;
          color: $text-secondary;
          text-align: center;
          opacity: 0.8;
        }
      }
    }
  }
}

// 响应式设计
@media (width <= 450px) {
  .login-container {
    padding: 15px;
  }

  .login-form-card {
    .login-header {
      padding: 35px 30px 25px;

      h1 {
        font-size: 28px;
      }
    }

    .login-form {
      padding: 30px 25px;
    }

    .login-footer {
      padding: 20px 25px 25px;
    }
  }
}

// 动画效果
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

.btn-pulse {
  animation: pulse 2s infinite;
}
</style>
