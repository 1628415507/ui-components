/*
 * @Description:
 * @Date: 2024-11-04 13:52:40
 * @LastEditTime: 2024-11-04 14:27:01
 */
self.addEventListener('message', (event) => {
  // console.log('【  self.clients 】-10',  self.clients,event.data )
  // 来自其他页面的消息
  if (event.data.startsWith('another')) {
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((windowClients) => {
        console.log('【 windowClients 】-14', windowClients)
        windowClients.forEach((client) => {
          client.postMessage('New message for ' + client.id)
        })
      })
  }
})
