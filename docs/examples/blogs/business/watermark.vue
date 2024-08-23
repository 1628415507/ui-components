<!--
 * @Description: web ⽹⻚如何禁⽌别⼈移除⽔印
 * @Date: 2024-08-23 16:49:49
 * @LastEditTime: 2024-08-23 17:58:06
-->
<template>
  <div id="watermarkBox">
    <div v-for="(item, index) in 6" data-iswatermark="true">水印{{ index + 1 }}</div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

function handleObserver() {
  // 1。创建了⼀个 MutationObserver 实例
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      // 1-1.判断页面是否有元素被删除
      if (mutation.removedNodes.length > 0) {
        const hasWatermark = Array.from(mutation.removedNodes).some((el) => {
          return el.getAttribute('data-iswatermark') === 'true'
        })
        // 1-2.如果水印被删除，则重新插入水印的 DOM 元素到目标节点
        if (hasWatermark) {
          console.log('【页面有元素被删除 】-19', mutation.removedNodes, hasWatermark)
          const watermarkElement = document.createElement('div')
          watermarkElement.setAttribute('data-iswatermark', 'true')
          watermarkElement.innerText = '水印'
          targetNode.appendChild(watermarkElement)
        }
      }
    }
  })
  // 2.通过 observe ⽅法将其绑定到⽬标节点上。
  // const targetNode = document.body //监听对象
  const targetNode = document.getElementById('watermarkBox') //监听对象
  const config = { childList: true, subtree: true }
  targetNode && observer.observe(targetNode, config)
}
onMounted(() => {
  handleObserver()
})
</script>
