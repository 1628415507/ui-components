<template>
  <div>
    <z-info-card header="竖线图标标题" header-icon="line">
      <div style="padding: 20px">
        <p>
          使用
          <code>header-icon="line"</code>
          显示竖线图标（默认）。
        </p>
      </div>
    </z-info-card>

    <z-info-card header="圆点图标标题" header-icon="dot">
      <div style="padding: 20px">
        <p>
          使用
          <code>header-icon="dot"</code>
          显示圆点图标。
        </p>
      </div>
    </z-info-card>

    <z-info-card header="无图标标题" header-icon="">
      <div style="padding: 20px">
        <p>
          使用
          <code>header-icon=""</code>
          不显示图标。
        </p>
      </div>
    </z-info-card>
  </div>
</template>
<script setup lang="ts"></script>
