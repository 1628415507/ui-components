class VirtualScroll {
  constructor(container, itemHeight, totalItems, renderCallback) {
    this.container = container; // 容器元素
    this.itemHeight = itemHeight; // 每个项的高度
    this.totalItems = totalItems; // 总列表项数
    this.renderCallback = renderCallback; // 渲染每一项的回调函数

    this.viewportHeight = container.clientHeight; // 视口高度
    this.bufferSize = Math.ceil(this.viewportHeight / itemHeight) * 3; // 缓冲大小
    this.renderedItems = []; // 已渲染项的数组

    this.startIndex = 0; // 当前渲染的开始索引
    this.endIndex = this.bufferSize; // 当前渲染的结束索引

    container.addEventListener("scroll", () => this.onScroll());
    this.update();
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight) - this.bufferSize / 2;
    const newEndIndex = newStartIndex + this.bufferSize;

    if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
      this.startIndex = Math.max(0, newStartIndex);
      this.endIndex = Math.min(this.totalItems, newEndIndex);
      this.update();
    }
  }

  update() {
    // 清空已有内容
    this.container.innerHTML = "";

    // 计算并设置容器的总高度
    const totalHeight = this.totalItems * this.itemHeight;
    this.container.style.height = `${totalHeight}px`;

    // 渲染视口内的项
    const fragment = document.createDocumentFragment();
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.renderCallback(i);
      item.style.top = `${i * this.itemHeight}px`;
      fragment.appendChild(item);
    }
    this.container.appendChild(fragment);
  }
}

// 创建一个列表项的函数
function createItem(index) {
  const item = document.createElement("div");
  item.className = "list-item";
  item.innerText = `Item ${index}`;
  item.style.position = "absolute";
  item.style.width = "100%";
  return item;
}

// 初始化虚拟滚动
const container = document.querySelector(".scroll-container"); // 容器元素需要预先在HTML中定义
const virtualScroll = new VirtualScroll(container, 30, 10000, createItem);