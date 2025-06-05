/*
 * @Description:
 * @Date: 2024-12-16 17:36:25
 * @LastEditTime: 2024-12-17 09:58:21
 */
import faker from 'faker'

function randomId() {
  return (Math.random() * 100000000).toFixed(0)
}
function randomText() {
  return faker.lorem.word()
}
export const todoListMock = [
  // 已选中数据
  { todoId: randomId(), type: 'accept', text: randomText(), isSelect: true }, //待接单
  { todoId: randomId(), type: 'submit', text: randomText(), isSelect: true }, //待提交
  { todoId: randomId(), type: 'release', text: randomText(), isSelect: true }, //待放单
  { todoId: randomId(), type: 'declare', text: randomText(), isSelect: true }, //待报关
  { todoId: randomId(), type: 'dispatch', text: randomText(), isSelect: true },
  { todoId: randomId(), type: 'dispatch', text: randomText(), isSelect: true },
  { todoId: randomId(), type: 'submit', text: randomText(), isSelect: true },
  // 未选中数据
  { todoId: randomId(), type: 'submit', text: randomText(), isSelect: false },
  { todoId: randomId(), type: 'accept', text: randomText(), isSelect: false },
  { todoId: randomId(), type: 'dispatch', text: randomText(), isSelect: false },
  { todoId: randomId(), type: 'declare', text: randomText(), isSelect: false }
]
