<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { SelectData } from '@renderer/types/types.ts'
import { selectTenant } from '@renderer/api/auth/tenant'
import { useMessage } from '@renderer/hooks/message'
import useUserStore from '@renderer/store/modules/user'
import useSettingStore from '@renderer/store/modules/setting'
import SvgButton from '@renderer/components/SvgButton/index.vue'

let $router = useRouter()
let settingStore = useSettingStore()
let { settings } = storeToRefs(settingStore)
let loading = ref(false)
const userStore = useUserStore()

// 单点登录地址
const loginUrl = '/sso-login?back=' + encodeURIComponent(location.href)

/**
 * 初始化
 */
onMounted(async () => {
  await initSelectTenant()
  // const res: any = await checkIsLogin()
  // if (res.data) {
  //   await $router.push(loginUrl)
  // }
})

const tenantOption = ref<SelectData[]>()

const tenant = ref<any>()
const open = ref(false)

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

/**
 * 标题动态获取计算属性
 */
const title = computed(() => {
  return settings.value.title
})

const handleToSsoLogin = () => {
  if (!tenantId.value) {
    open.value = true
    return
  }
  $router.push(loginUrl)
}

/**
 * 获取当前租户
 */
const tenantId = computed({
  get: () => {
    return userStore.tenantId
  },
  set: (value) => {
    userStore.storeTenantId(value)
  }
})

/**
 * 获取当前租户
 */
const tenantName = computed(() => {
  return tenantOption.value?.find((item) => item?.value === tenantId.value)?.label
})
</script>

<template>
  <!-- SSO登录场景容器 -->
  <div class="sso-login-container">
    <div class="sso-login">
      <el-popover placement="bottom" trigger="hover">
        <el-select
          v-model="tenantId"
          :teleported="false"
          style="width: 120px"
          @change="() => userStore.storeTenantId(tenantId)"
        >
          <el-option
            v-for="item in tenantOption"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>
        <template #reference>
          <svg-button
            ref="tenant"
            :style="{ background: 'transparent !important', border: 'transparent !important' }"
            :circle="true"
            icon="tenant"
            width="2rem"
            height="2rem"
          />
        </template>
      </el-popover>
    </div>

    <div class="login-form-card">
      <h1>{{ title }}</h1>
      <svg-button
        :style="{ background: 'transparent !important' }"
        :circle="true"
        :loading="loading"
        icon="login"
        width="10rem"
        height="10rem"
        type="primary"
        @svg-btn-click="handleToSsoLogin"
      />
      <div class="tenant-name">{{ tenantName }}</div>
    </div>
    <el-tour v-model="open" content-style="width: 200px">
      <el-tour-step :target="tenant?.$el" title="租户">请选择租户</el-tour-step>
    </el-tour>
  </div>
</template>

<style lang="scss" scoped>
.sso-login-container {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 48.7% 44.3%, #fefefe 10.5%, #b5eff9 50%);

  .sso-login {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
  }

  .login-form-card {
    position: absolute;
    top: 20vh;
    left: 50%;
    display: flex;
    flex-direction: column;
    place-items: center center;
    justify-content: center;
    width: 28rem;
    height: 25rem;
    border: none;
    transform: translateX(-50%);

    h1 {
      margin-top: -10px;
      margin-bottom: 100px;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
      background: linear-gradient(to right, blue, rgb(35 60 70));
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tenant-name {
      position: absolute;
      bottom: 0;
      z-index: 999;
      width: 100%;
      height: 50px;
      padding: 10px;
      text-align: center;
    }
  }
}

.el-card {
  box-shadow: rgb(0 0 0 / 24%) 0 0 3px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
