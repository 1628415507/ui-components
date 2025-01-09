// 解析el中的所有'{{}}'中的变量并添加到wather监听
function Compile(vm) {
    this.vm = vm
    this.el = vm.$el
    this.fragment = null
    this.init()
}

Compile.prototype = {
    init: function () {
        this.fragment = this.nodeFragment(this.el)//将dom节点转成虚拟的文档片段
        this.compileNode(this.fragment)//重新渲染文档片段，解析更新值
        this.el.appendChild(this.fragment) //解析完成挂载到真实dom中,一次性插入到文档中
    },
    // 将真实Dom节点转成虚拟的文档片段
    nodeFragment: function (el) {
        const fragment = document.createDocumentFragment()//创建文档片段
        let child = el.firstChild//获取el下的所有子节点
        //将子节点，全部移动文档片段里
        while (child) {
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },
    compileNode: function (fragment) {
        let childNodes = [...fragment.childNodes]//子节点
        childNodes.forEach((node) => {
            // 解析dom元素上的v-model指令
            // <input class="form-control" v-model="name" type="text">
            if (this.isElementNode(node)) {
                this.compile(node)
            }
            // 解析dom中的{{name}}中的变量，并添加到watcher中
            // 匹配name: <h1>{{name}}</h1>
            let reg = /\{\{(.*)\}\}/
            let text = node.textContent
            if (reg.test(text)) {
                let prop = reg.exec(text)[1]
                this.compileText(node, prop) //替换模板
            }

            //编译子节点
            if (node.childNodes && node.childNodes.length) {
                this.compileNode(node)
            }
        })
    },
    // 解析属性名是v-开头的指令(v-model)的属性
    compile: function (node) {
        let nodeAttrs = [...node.attributes]
        nodeAttrs.forEach((attr) => {
            let name = attr.name//
            if (this.isDirective(name)) {//判断是否是v-开头的指令
                let value = attr.value
                if (name === 'v-model') {
                    this.compileModel(node, value)
                }
            }
        })
    },
    // 更新Model模板值
    compileModel: function (node, prop) {
        let val = this.vm.$data[prop]//读取值的时候触发了  Object.defineProperty的get
        this.updateModel(node, val)//更新Model模板值

        new Watcher(this.vm, prop, (value) => {
            this.updateModel(node, value)
        })

        node.addEventListener('input', (e) => {
            let newValue = e.target.value
            if (val === newValue) {
                return
            }
            this.vm.$data[prop] = newValue
        })
    },
    compileText: function (node, prop) {
        let text = this.vm.$data[prop]
        this.updateView(node, text)
        new Watcher(this.vm, prop, (value) => {
            this.updateView(node, value)
        })
    },

    updateModel: function (node, value) {
        node.value = typeof value == 'undefined' ? '' : value
    },
    updateView: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') !== -1
    },
    // 代表是一个 元素 节点，例如 <p> 和 <div>
    isElementNode: function (node) {
        return node.nodeType === 1
    },
    isTextNode: function (node) {
        return node.nodeType === 3
    }
}
