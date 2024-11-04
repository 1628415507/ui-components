<template>
  <div>
    正确值为111
    <form id="myForm" onsubmit="return false;" class="scroll-container">
      <button type="submit" onclick="handleValidation()">确认</button>
      <div class="demo-box flex-sb-column">
        <input v-for="item in 6" type="text" id="else" name="else" />
        <!-- 模拟验证表单 -->
        <input type="text" id="name" name="name" />
        <input type="text" id="age" name="age" />
      </div>
    </form>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
// ⼀个假设的表单验证函数
function validateInput(inputId) {
  // 调⽤此处的校验逻辑，返回是否存在错误
  let el = document.getElementById(inputId) // 此处只是⽰例, 实际上应根据具体的校验逻辑返回⼀个布尔类型
  return el.value === '111'
}

function handleValidation() {
  let valid = true
  let ids = ['name', 'age']
  ids.forEach((key) => {
    let element = document.getElementById(key)
    // 进⾏校验判断
    if (!validateInput(key)) {
      console.error(`验证失败: ${key}`)
      valid = false // 标记校验失败
      // 滚动到出现问题的元素位置
      element.scrollIntoView({ block: 'center', behavior: 'smooth' })
      element.classList.add('error-highlight') // 增加⼀些提⽰效果, ⽐如错误边框, 可按需实现
    } else {
      element.classList.add('success-highlight')
    }
  })
  return valid // 检查是否验证失败，如果失败则不提交表单
}
onMounted(() => {
  // 处理表单提交事件，与HTML中的onclick绑定
  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault() // 阻⽌表单默认提交⾏为
    handleValidation()
  })
})
</script>
<style scoped>
input,
button {
  margin: auto 5px;
  border: 1px solid #ccc;
}
.scroll-container {
  background-color: #eee;
  height: 100px;
  overflow: auto;
}

.error-highlight {
  background-color: red;
  border: 1px solid #ccc;
}

.success-highlight {
  background-color: transparent;
}
</style>
