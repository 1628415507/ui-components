/*
 * @Description: Cookies相关操作
 * @Author: Hongzf
 * @Date: 2022-12-02 15:08:27
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-02 16:33:22
 */
import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'access_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  console.log('【 token 】-18', token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
