class Watcher {
  constructor(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    this.value = this.get();//通过此方法将全局Dep.target对象绑定到当前的watcher实例上
    this.dirty = true  // 初始时默认为true（计算属性用）
  }
  update() {
    const value = this.vm.$data[this.prop];
    const oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.callback(value);//执行回调函数
    }
  }
  get() {
    Dep.target = this; // ☆☆☆ 绑定当前watcher的实例
    // ☆☆☆ 因为this.vm.$data中的属性被监听，
    // 所以使用this.vm.$data[this.prop]时
    // 会触发监听器 Object.defineProperty里的 get方法
    const value = this.vm.$data[this.prop];//触发Object.defineProperty里的 get方法
    Dep.target = null;
    return value;
  }
  // 用于computed计算属性求值
  evaluate() {
    this.value = this.get()  //  计算属性求值
    this.dirty = false  // 表示计算属性已经计算，不需要再计算
  }
  depend() {
    let i = this.deps.length  // deps内是计算属性内能访问到的响应式数据的dep的数组集合
    while (i--) {
      this.deps[i].depend()  // 让每个dep收集当前的render-watcher
    }
  }
}
