<template>
  <div>
    <z-info-card header="固定高度" height="100px">
      <div style="padding: 20px">
        <p>
          通过
          <code>height</code>
          属性设置固定高度为 100px
        </p>
      </div>
    </z-info-card>

    <z-info-card header="最小高度" :resizable="true" min-height="150px">
      <div style="padding: 20px">
        <p>
          通过
          <code>min-height</code>
          属性设置最小高度为 150px。
        </p>
        <p>
          当
          <code>resizable</code>
          为
          <code>true</code>
          时，可以调整大小，但不能小于最小高度。
        </p>
      </div>
    </z-info-card>
  </div>
</template>
<script setup lang="ts"></script>
