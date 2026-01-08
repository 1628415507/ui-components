<template>
  <div>
    <z-info-card
      header="完整功能示例"
      header-icon="line"
      :border="true"
      :collapsible="true"
      :expand="true"
      :resizable="true"
      resize-type="vertical"
      background="#ffffff"
      min-height="200px"
      @expand-change="handleExpandChange"
    >
      <div>
        <p>这是一个包含所有功能的完整示例：</p>
        <ul>
          <li>可收缩功能</li>
          <li>可调整大小（垂直方向）</li>
          <li>带边框</li>
          <li>自定义背景色</li>
          <li>标题前缀图标（竖线）</li>
        </ul>
        <p>你可以拖拽右下角来调整高度</p>
      </div>
    </z-info-card>
  </div>
</template>

<script setup lang="ts">
function handleExpandChange(expanded: boolean) {
  console.log('展开状态:', expanded)
}
</script>
