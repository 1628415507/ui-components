<!--
 * @Description: 根据路径匹配examples文件夹下的组件
 * @Date: 2024-06-27 09:40:26
 * @LastEditTime: 2024-10-30 18:26:47
-->
<template>
  <ClientOnly>
    <div class="example-component">
      <component v-if="dynamicComponent" :is="dynamicComponent" v-bind="$attrs" />
      <div v-else class="example-component--spin">
        <div></div>
        <div></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { onBeforeMount, shallowRef } from 'vue'

const props: any = defineProps<{
  path?: string
}>()

// 创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。
let dynamicComponent = shallowRef(null)

onBeforeMount(() => {
  // 匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。
  // 如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 { eager: true } 作为第二个参数：
  let modules: any
  const pattern = new RegExp('/', 'g')
  const matches = props.path.match(pattern)
  console.log('【 matches 】-34', props.path, matches)
  const pathLevel = matches.length //获取examples目录下层级
  if (pathLevel == 1) {
    // modules = import.meta.glob(`../../../../examples/*/*.vue`, {
    modules = import.meta.glob(`/*/*.vue`, {
      eager: true
    })
  }
  if (pathLevel == 2) {
    modules = import.meta.glob(`/*/*/*.vue`, {
      eager: true
    })
  }
  if (pathLevel == 3) {
    modules = import.meta.glob(`/*/*/*/*.vue`, {
      eager: true
    })
  }
  if (pathLevel == 4) {
    modules = import.meta.glob(`/*/*/*/*/*.vue`, {
      eager: true
    })
  }
  // console.log('【 modules 】-43', modules)
  // const modules = import.meta.glob(`../../../../examples/*/*/*.vue`, {
  //   eager: true,
  // })
  // console.log('【 获取examples下的所有vue文件 】-40', modules)
  // 动态加载示列组件
  for (const modulesKey in modules) {
    const module = modules[modulesKey]
    // 找到example的组件，并加载
    if (modulesKey.split('.vue')[0].endsWith(props.path)) {
      dynamicComponent.value = module.default
    }
  }
})
</script>

<style lang="scss" scoped>
// loading动画
@keyframes lds-ripple {
  0% {
    top: 18px;
    left: 18px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 18px;
    left: 18px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 18px;
    left: 18px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 36px;
    height: 36px;
    opacity: 0;
  }
}
.example-component {
  // min-height: 86px;
  // padding: 1.5rem;
  &--spin {
    width: 36px;
    height: 36px;
    display: inline-block;
    position: relative;
    > div {
      position: absolute;
      border: 4px solid var(--theme-light);
      opacity: 1;
      border-radius: 50%;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    div:nth-child(2) {
      animation-delay: -0.5s;
    }
  }
}
</style>
