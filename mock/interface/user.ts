/*
 * @Description:
 * @Author: Hongzf
 * @Date: 2022-12-01 18:21:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-07-25 11:19:44
 */
import userListJSON from '../database/user.json'
import menuJSON from '../database/menus.json'
import Mock from 'mockjs'
// 参数示例
// const list = Mock.mock({
//   'data|10': [
//     {
//       // 生成10条数据
//       'id|+1': 1, // id会自增
//       name: '@cname', // 随机生成姓名 --中文名
//       sex: '@integer(0, 1)', // 性别一般是用数字表示 0男生 1女生
//       email: '@email', // 随机生成邮箱地址
//       account: '@name', // 随机生成账号名 -- 英文
//       status: '@boolean', // 随机生成布尔值 表示账户状态
//       profile: '@image( 50x50, #FF6600, #fff, png, 头像 )', // 随机生成头像
//       createTime: '@datetime(yyyy-MM-dd HH:mm:ss)', // 随机生成创建时间
//       role: '@pick(["董事长", "总监", "经理", "组长"])' // 随机生成角色
//     }
//   ]
// })

const userInterface = [
  {
    url: '/mock/api/login',
    method: 'post',
    response: (params) => {
      console.log('【 params 】-55', params)
      return {
        code: 500,
        data: {
          accessToken: '123',
          loginTime: '@datetime(yyyy-MM-dd HH:mm:ss)' // 随机生成创建时间
        }
      }
    }
  },
  {
    url: '/mock/api/queryResource',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: menuJSON
      }
    }
  },
  {
    url: '/mock/api/getAppInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        resourceTitle: 'mock请求测试'
      }
    }
  },
  {
    url: '/mock/associate/user', // 请求的URL地址
    method: 'post', // 请求的方法类型
    response: ({ query }) => {
      console.log('【 query 】-107', query)
      // 返回的数据或函数体（可以动态生成）
      return {
        status: 1,
        code: '15000',
        message: '成功',
        data: {
          rows: userListJSON,
          total: 1021
        },
        success: true
      }
    }
  },

]

export default userInterface
