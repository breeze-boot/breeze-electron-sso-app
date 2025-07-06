<!--
 * @author: gaoweixuan
 * @since: 2023-11-12
-->
<script setup lang="ts">
import { onMounted, computed, shallowRef } from 'vue'

defineOptions({
  name: 'SvgIcon',
  inheritAttrs: false
})

const props = defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //svg矢量图的名字
  name: {
    type: String,
    default: ''
  },
  //svg图标的颜色
  color: {
    type: String,
    default: ''
  },
  //svg宽度
  width: {
    type: String,
    default: '1rem'
  },
  //svg高度
  height: {
    type: String,
    default: '1rem'
  }
})

const iconStyle = computed(() => {
  return {
    width: props.width,
    height: props.height
  }
})

const $emit = defineEmits(['svg-click'])

const svgComponent = shallowRef() // 编辑器实例，必须用 shallowRef

onMounted(async () => {
  try {
    // 动态导入SVG组件
    svgComponent.value = (await import(`@renderer/assets/icons/${props.name}.svg`)).default
  } catch (error) {
    console.error('Failed to load SVG:', error)
  }
})
</script>

<template>
  <component
    :is="svgComponent"
    :style="iconStyle"
    v-bind="$attrs"
    @click="() => $emit('svg-click')"
  />
</template>
