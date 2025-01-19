<!--
 * @Description: 面包屑(参考链接:https://blog.csdn.net/qq_45489665/article/details/125235810)
 * @Author: Hongzf
 * @Date: 2022-11-25 17:15:35
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:12:54
-->
<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <!-- :to="{ path: item.path }" -->
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <!-- 没有重定向!item.redirect || ||最后一个，不跳转 -->
      <span v-if="index == breadcrumbs.length - 1">
        {{ item.meta.title }}
      </span>
      <span v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { onBeforeMount, Ref, ref, watch } from 'vue'
import { useRoute, useRouter, RouteLocationMatched } from 'vue-router'
// 页面跳转
const router = useRouter()
function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
// 因为 当被点击后，需要把 to （目标路由的链接，类型都是RouteLocationRaw），传到router.push()里面
// 所以需要对 matched 进行类型的转换
// 获取面包屑数据
const breadcrumbs: Ref<RouteLocationMatched[]> = ref([])
const curRoute = useRoute()
const getBreadcrumb = () => {
  // 利用route.matched可以得到单个匹配的路径
  let matchedList = curRoute.matched.filter((item) => item.meta && item.meta.title)
  const first = matchedList[0]
  // 第一个路径如果不是首页，需要在匹配路径前面拼接一个首页
  if (first.path !== '/home') {
    const homeItem: any = {
      path: '/home',
      meta: { title: '首页' }
    }
    matchedList = [homeItem].concat(matchedList)
  }
  breadcrumbs.value = matchedList
}
// 路径会发生改变，所以要用watch进行监听,// 监听路径的改变,如果发生变化了，执行方法
watch(
  () => curRoute.path,
  () => {
    getBreadcrumb()
  }
)
onBeforeMount(() => {
  getBreadcrumb()
})
</script>
