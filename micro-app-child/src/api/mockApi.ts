/*
 * @Description: mock的接口
 * @Author: Hongzf
 * @Date: 2022-12-01 17:37:58
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 17:43:15
 */

import request from '@/utils/request'

export function getMockInfo() {
  return request({
    url: '/mock/api/getAppInfo',
    method: 'get'
  })
}
