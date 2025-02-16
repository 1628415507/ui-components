function defineReactive(data, key, value) {
  //递归调用，监听所有属性
  observer(value)
  var dep = new Dep()
  Object.defineProperty(data, key, {
    get: function () {
      // ☆☆☆在new Wather的get方法里改变Dep.target的指向，
      // 然后再通过读取this.vm.$data[this.prop]的值来触发这里的observe中的get，
      // 所以这里的Dep.target就指向了对应的每个watcher的实例
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return value
    },
    set: function (newVal) {
      if (value !== newVal) {
        value = newVal
        dep.notify() //通知订阅器
      }
    }
  })
}

function observer(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key])
  })
}

function Dep() {
  this.subs = []
}
Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}
Dep.prototype.notify = function () {
  this.subs.forEach((sub) => {
    sub.update()
  })
}
Dep.target = null
