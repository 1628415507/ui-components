<template>
  <div class="flex-sb">
    <el-descriptions title="默认情况下，从 0 开始为元素编号" direction="vertical" border>
      <el-descriptions-item v-for="(value, key) in DefaultColor" :label="key">
        {{ value }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="也可以手动的指定成员的数值" direction="vertical" border>
      <el-descriptions-item v-for="(value, key) in Color" :label="key">
        {{ value }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="也可以手动的指定成员的数值" direction="vertical" border>
      <el-descriptions-item v-for="(value, key) in MixColor" :label="key">
        {{ value }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script setup lang="ts">
// 默认情况下，从 0 开始为元素编号
enum DefaultColor {
  Red,
  Green,
  Blue
}

enum Color {
  Red = '红色',
  Green = '绿色',
  Blue = '蓝色'
}
let color: Color = Color.Red
// 当某一项不是数值类型时，该项后面的枚举都需要初始化
enum MixColor {
  Red,
  Green= '绿色',
  Blue= '蓝色'
}
</script>
<style scoped></style>
