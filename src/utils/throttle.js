/**
 * 节流方法
 * @param {*} method 
 * @param {*} wait 
 */
function throttle(method, wait=350) {
  let previous = 0
  return function(...args) {
    let context = this
    let now = new Date().getTime()
    if (now - previous > wait) {
      method.apply(context, args)
      previous = now
    }else {
      console.log("节流少许");
    }
  }
}

export default throttle