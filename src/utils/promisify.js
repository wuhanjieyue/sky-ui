/**
 * 将小程序/小游戏异步接口转为同步接口
 * 这是异步转同步编程范式必需的一个工具函数
 * 
*/

function promisify(fn) {
  return (args = {}) =>
    new Promise((resolve, reject) => {
      fn(
        Object.assign(args, {
          success: resolve,
          fail: reject
        })
      )
    })
}

function promisifyOn(fn, off) {
  return () =>
    new Promise((resolve, reject) => {
      // 这里防止消费代码取到undefined误以为调用失败
      const cb = res => resolve(res || {})
      fn(cb) && unset(cb)
    })
}

export default {
  promisifyOn,
  promisify
}
