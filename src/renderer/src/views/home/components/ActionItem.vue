<!-- ActionItem.vue -->
<template>
  <div
    class="action-item"
    :class="{ 'action-item-hover': hover, 'action-item-clicked': clicked }"
    @click="handleClick"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="action-icon">
      <i :class="icon"></i>
    </div>
    <div class="action-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  // 可选：自定义图标颜色
  iconColor: {
    type: String,
    default: '#165dff'
  },
  // 可选：自定义背景颜色
  bgColor: {
    type: String,
    default: 'rgba(22, 93, 255, 0.1)'
  }
})

// 状态管理
const hover = ref(false)
const clicked = ref(false)

// 点击事件处理
const emit = defineEmits(['click'])

const handleClick = () => {
  clicked.value = true

  // 触发点击事件
  emit('click')

  // 点击效果持续200ms
  setTimeout(() => {
    clicked.value = false
  }, 200)
}
</script>

<style scoped lang="scss">
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 10px;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;

  .action-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    transition: all 0.3s ease;

    i {
      font-size: 22px;
      transition: all 0.3s ease;
    }
  }

  .action-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #001529;
    transition: all 0.3s ease;
  }

  &:hover {
    background-color: #e6e9ed;
    transform: translateY(-2px);

    .action-icon {
      transform: scale(1.1);
    }
  }

  &.action-item-clicked {
    transform: scale(0.95);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-item {
    padding: 14px;

    .action-icon {
      width: 40px;
      height: 40px;

      i {
        font-size: 18px;
      }
    }

    .action-text {
      font-size: 0.85rem;
    }
  }
}
</style>
