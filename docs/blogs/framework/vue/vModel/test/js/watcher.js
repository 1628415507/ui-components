function Watcher(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    this.value = this.get();//通过此方法将全局Dep.target对象绑定到当前的watcher实例上
}
Watcher.prototype = {
    update: function () {
        const value = this.vm.$data[this.prop];
        const oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.callback(value);//执行回调函数
        }
    },
    get: function () {
        Dep.target = this; //绑定当前watcher的实例
        //☆☆☆ 因为this.vm.$data的属性被监听，
        // 所以使用this.vm.$data[this.prop]时
        // 会触发监听器 Object.defineProperty里的 get方法
        const value = this.vm.$data[this.prop];//触发Object.defineProperty里的 get方法
        Dep.target = null;
        return value;
    }
}
