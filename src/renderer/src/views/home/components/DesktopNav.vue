<!-- DesktopNav.vue -->
<template>
  <el-dropdown style="margin: 0 10px" :show-timeout="70" :hide-timeout="50" trigger="click">
    <span class="el-dropdown-link" style="cursor: pointer">
      <el-avatar v-if="showAvatar" :src="showAvatar ? avatar : '#'">
        <span class="user-name">{{ userInfo?.username || '未登录用户' }}</span>
      </el-avatar>
      <el-avatar v-else size="default">
        <span class="user-name">{{ userInfo?.username || '未登录用户' }}</span>
      </el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handlePersonalCenter">个人中心</el-dropdown-item>
        <el-dropdown-item @click="handleEditPassword">修改密码</el-dropdown-item>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useSettingStore from '@renderer/store/modules/setting.ts'
import useUserStore from '@renderer/store/modules/user'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
})
const { t } = useI18n()
const userStore = useUserStore()

const emits = defineEmits(['logout'])

const settingStore = useSettingStore()

console.log(props.userInfo)

/**
 *退出登录
 */
const handleLogout = async () => {
  ElMessageBox.confirm(t('common.sureToLogOutExitSystem'), t('common.tip'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  }).then(() => {
    userStore.logout().then(() => {
      window.location.reload()
    })
    emits('logout')
  })
}
</script>

<style scoped>
.user-name {
  margin-right: 4px;
  font-weight: 500;
  font-size: 0.6rem;
}
</style>
