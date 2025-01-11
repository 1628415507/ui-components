function Watcher(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    this.value = this.get();//通过此方法将dep对象绑定到当前的this绑定到对应
}
Watcher.prototype = {
    update: function () {
        const value = this.vm.$data[this.prop];
        const oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.callback(value);
        }
    },
    get: function () {
        Dep.target = this; //储存订阅器
        //☆☆☆ 因为this.vm.$data的属性被监听，
        // 所以使用this.vm.$data[this.prop]时
        // 会触发监听器 Object.defineProperty里的 get方法
        const value = this.vm.$data[this.prop];
        Dep.target = null;
        return value;
    }
}
