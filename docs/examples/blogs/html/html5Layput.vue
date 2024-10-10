<template>
  <div>
    <!-- 头部 -->
    <header>
      header1
      <nav>
        <a href="#">nav1</a>
        <a href="#">nav2</a>
        <a href="#">nav3</a>
      </nav>
    </header>
    <div class="flex-sb">
      <!-- 侧边栏 -->
      <aside>
        侧边栏aside
        <section>section1</section>
      </aside>
      <!-- 主要内容 -->
      <main>
        <article>article1</article>
        <article>
          <header>header2</header>
          <section>section2</section>
          <section>section3</section>
        </article>

        <!-- 其他article -->
      </main>
    </div>
    <!-- footer -->
    <footer>footer</footer>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.flex-sb {
  display: flex;
  justify-content: space-between;
}
header {
  background-color: pink;
  padding: 5px;
}
nav {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
  a {
    color: white;
    margin: 0 10px;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
}
aside {
  width: 30%;
  background-color: var(--box-bg);
}
main {
  width: 70%;
  background-color: var(--theme-color);
  padding: 10px;
}
section {
  background-color: #bcf;
  margin:5px;
}
article {
  background: #eee;
  padding: 10px;
  margin:5px;
}

footer {
  background-color: rgb(112, 194, 200);
}
</style>
