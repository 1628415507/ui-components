class VirtualScroll {
  constructor(container, itemHeight, totalItems, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    // 初始化观察对象
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: this.container,//父容器元素
      threshold: 1.0,
    });
    this.items = new Map();
    this.init();
  }
  // 填充初始屏幕的元素
  init() {
    for (let i = 0; i < this.totalItems; i++) {
      const placeholder = this.createPlaceholder(i);
      this.container.appendChild(placeholder);
      this.observer.observe(placeholder);//观察元素的视口状态
    }
  }
  // 创建占位元素
  createPlaceholder(index) {
    const placeholder = document.createElement("div");
    placeholder.style.height = `${this.itemHeight}px`;
    placeholder.style.width = "100%";
    placeholder.dataset.index = index; // store indexreturn placeholder;
  }
  // 
  onIntersection(entries) {
    entries.forEach((entry) => {
      const index = entry.target.dataset.index;
      // 当元素进入视口时,渲染列表项
      if (entry.isIntersecting) {
        const rendered = this.renderItem(index);
        this.container.replaceChild(rendered, entry.target);
        this.items.set(index, rendered);
      } else if (this.items.has(index)) {
        // 当元素离开视口时,换回占位符
        const placeholder = this.createPlaceholder(index);
        this.container.replaceChild(placeholder, this.items.get(index));
        this.observer.observe(placeholder);
        this.items.delete(index);
      }
    });
  }
}
// 渲染列表项
function renderItem(index) {
  const item = document.createElement("div");
  item.classList.add("item");
  item.textContent = `Item ${index}`;
  item.dataset.index = index;
  item.style.height = "30px"; // Same as your itemHeight in VirtualScroll
  return item;
}
// 使用示例
const container = document.getElementById("scroll-container");
const itemHeight = 30; // Height of each item
const itemCount = 1000; // Total numberof items you have
const virtualScroll = new VirtualScroll(container, itemHeight, itemCount, renderItem);