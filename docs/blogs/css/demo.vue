<template>
  <div>
    <header>header</header>
    <nav>nav</nav>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.triangle:after {
  content: ' ';
  $num: 20px;
  width: 0px;
  height: 0px;
  border-right: $num solid transparent;
  border-top: $num solid var(--theme-color);
  border-left: $num solid transparent;
  border-bottom: $num solid transparent;
}
</style>
