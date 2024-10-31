const performance = {
  timings: {},
  config: {
    reportUrl: '/report',
  },
  init() {
    // 监听所有请求的开始时间
    window.addEventListener('fetchStart', (event)
      => {
      this.timings[event.detail.id] = {
        startTime: Date.now(),
      };
    });
    // 监听所有请求的结束时间，并计算请求耗时
    window.addEventListener('fetchEnd',
      (event) => {
        const id = event.detail.id;
        if (this.timings[id]) {
          const timing = this.timings[id];
          timing.endTime = Date.now();
          timing.duration = timing.endTime - timing.startTime;
          // 将耗时信息发送到服务端
          const reportData = {

            url: event.detail.url,
            method: event.detail.method,
            duration: timing.duration,
          };
          this.report(reportData);
        }
      });
  },
  report(data) {
    // 将耗时信息发送到服务端
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.config.reportUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  },
};

export default performance;