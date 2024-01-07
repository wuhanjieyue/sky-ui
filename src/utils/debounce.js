/**
 * 防抖函数
 * @param {*} func 
 * @param {*} wait 
 */
function debounce(func, wait = 350){
  let timer = null

  return function(...args) {
    const context = this 
    if (timer) {
      clearTimeout(timer)
      console.log("防抖少许");
    }
    timer = setTimeout(() => {
      func.call(context, ...args)
    }, wait)
  }
}

export default debounce