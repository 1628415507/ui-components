/*
 * @Description: 
 * @Date: 2025-01-07 15:24:45
 * @LastEditTime: 2025-01-07 15:34:11
 */
// 三个状态：PENDING、FULFILLED、REJECTED
//  javascript 对象中的 constructor属性 指向的函数本身。
const PENDING = 'PENDING' // 等待中
const FULFILLED = 'FULFILLED' // 完成
const REJECTED = 'REJECTED' // 拒绝

export default class MyPromise {
  // 每个构造函数C刚被制造出来的时候，它的C.prototype上面都会有一个constructor属性，并且执行它本身
  // constructor 属性返回对创建此对象的数组函数的引用。
  // 【1】立即执行函数
  constructor(executor) {
    console.log(0, '创建Promise对象')
    // (1) promise 的 三个状态
    this.status = PENDING // 默认状态为 PENDING
    // (2) promise 有两个保存状态结果的值
    this.value = undefined // 存放成功状态的值，默认为 undefined
    this.reason = undefined // 存放失败状态的值，默认为 undefined
    this.successCB = [] // 成功存放的数组
    this.failCB = [] // 失败存放的数组
    // 【1-1】调用此方法就是成功
    let resolve = (value) => {
      // 状态为 PENDING 时才可以更新状态，
      //防止 executor 中调用了两次 resovle/reject 方法
      if (this.status === PENDING) {
        console.log(2, '成功则调用 resolve 方法-异步')
        this.status = FULFILLED
        this.value = value
        this.successCB.forEach((f) => f()) //???
      }
    }
    // 【1-2】调用此方法就是失败
    let reject = (reason) => {
      //确保状态还未改变
      if (this.status == PENDING) {
        console.log(3, '失败则调用 reject 方法')
        this.status = REJECTED
        this.reason = reason
        this.failCB.forEach((f) => f())//???
      }
    }
    // 【1-3】立即执行函数
    try {
      console.log(1, '立刻执行函数executor(resolve, reject)')
      // 立即执行，将 resolve 和 reject 函数传给使用者
      executor(resolve, reject)//回调
    } catch (error) {
      console.log(3, '出错则调用reject函数 error')
      reject(error) //出错则调用reject函数
    }
  }
  //【2】异步函数
  // 包含一个 then 方法，并接收两个参数 onFulfilled、onRejected，
  // 第一个参数是状态变为成功后应该执行的回调函数，
  // 第二个参数是状态变为失败后应该执行的回调函数。
  then(onFulfilled, onRejected) {
    console.log(4, 'then:当前状态-同步', this.status)
    // 【2-1】成功后用户需要执行的函数
    if (this.status === FULFILLED) {
      //onFulfilled：成功后用户需要执行的函数
      console.log(5, '成功后执行 onFulfilled函数')
      onFulfilled(this.value)
    }
    // 【2-2】失败后用户需要执行的函数
    if (this.status === REJECTED) {
      //onRejected：失败后用户需要执行的函数
      console.log(6, '失败后执行 onRejected函数')
      onRejected(this.reason)
    }
    // 【2-3】一开始调用的时候如果外部还没有执行resolve或reject，则需要先放到successCB和failCB里
    // 等后续执行resolve或reject的时候再执行※
    if (this.status === PENDING) {
      this.successCB.push(() => {
        onFulfilled(this.value)
      })
      this.failCB.push(() => {
        onRejected(this.reason)
      })
    }
  }
}