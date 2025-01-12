class Mvue {
    constructor(options, prop) {
        this.$options = options;
        this.$data = options.data;
        this.$prop = prop;
        this.$el = document.querySelector(options.el);
        //对每层数据进行代理
        Object.keys(this.$data).forEach(key => {
            this.proxyData(key);
        });

        this.init();
    }
    init() {
        observer(this.$data);
        new Compile(this);
    }
    proxyData = function (key) {
        Object.defineProperty(this, key, {
            get: function () {
                return this.$data[key]
            },
            set: function (value) {
                this.$data[key] = value;
            }
        });
    }
}