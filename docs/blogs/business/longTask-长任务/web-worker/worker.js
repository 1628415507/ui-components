onmessage = function (event) {
  console.log('【 onmessage 】-2', '子线程任务开始')
  const { start, end } = event.data
  let sum = 0
  for (let i = start; i <= end; i++) {
    console.log('【 子线程长任务... 】-39')
    sum += i
  }
  postMessage(sum) // 任务完成向主线程发送消息
}
// ==================如果实时通信计算结果，依然会被卡死。========================
// onmessage = function (event) {
//   const { start, end } = event.data

//   let sum = 0
//   for (let i = start; i <= end; i++) {
//     sum = i + 1
//     postMessage(sum) // 实时向主线程发送消息
//   }
// }
