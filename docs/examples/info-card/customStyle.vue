<template>
  <div>
    <z-info-card header="带边框的信息卡片" :border="true">
      <div style="padding: 20px">
        <p>
          通过设置
          <code>border</code>
          属性为
          <code>true</code>
          显示边框。
        </p>
      </div>
    </z-info-card>

    <z-info-card header="自定义背景色" background="#e8f4fd">
      <div style="padding: 20px">
        <p>
          通过
          <code>background</code>
          属性设置背景色。
        </p>
      </div>
    </z-info-card>

    <z-info-card
      header="自定义内容样式"
      :body-style="{ padding: '30px', backgroundColor: '#f5f7fa' }"
      body-class="custom-body"
    >
      <div>
        <p>
          通过
          <code>body-style</code>
          和
          <code>body-class</code>
          自定义内容区域样式。
        </p>
      </div>
    </z-info-card>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
:deep(.custom-body) {
  border-radius: 4px;
  background-color: #ccc !important;
}
</style>
