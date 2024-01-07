/**
 * SkyLine框架的专用工具类
*/
/** 小程序版本强制更新管理器 */
import promisifys from "./promisify"

import downRouteBuilder from './routejs/downRoute'
import implicitRouteBuilder from './routejs/implicitRoute'
import leftRouteBuilder from './routejs/leftRoute'
import popRouteBuilder from './routejs/popRoute'
import rightRouteBuilder from './routejs/rightRoute'
import upRouteBuilder from './routejs/upRoute'

async function navigateTemp(eve){
  // const builder = await require('./routejs/'+ eve.routeType)
  // builder.default()
  switch ( eve.routeType ) {
    case "downRoute":
      downRouteBuilder()
      break;
    case 'implicitRoute':
      implicitRouteBuilder()
      break;
    case 'leftRoute':
      leftRouteBuilder()
      break;
    case 'popRoute':
      popRouteBuilder()
    break;
    case 'rightRoute':
      rightRouteBuilder()
      break;
    case 'upRoute':
      upRouteBuilder()
    break;
    default:
  }
  wx.navigateTo(eve)
}
class SkyUtils {

  /**
   * 小程序初始化
   */
  skyInit(){
    let app = getApp()
    const systemInfo = wx.getSystemInfoSync()
    app.globalData.sky_system = systemInfo
    const menuInfo = wx.getMenuButtonBoundingClientRect()
    app.globalData.sky_menu = menuInfo
  }
  /**
   * 跳转
   * @param {*} eve 
   */
  skyNavigate(eve){
      //页面高度 （单位*% 默认99,100会有未知错误）
      wx.skyRoutePageHeight = (eve.pageHeight != undefined) ? Math.min(Math.max(eve.pageHeight, 0), 99.9) : 99.9
      //页面宽度度 （单位*% 默认99,100会有未知错误）
      wx.skyRoutePageWidth = (eve.pageWidth != undefined) ? Math.min(Math.max(eve.pageWidth, 0), 99.9) : 99.9
      // 背景透明度 （单位*% 默认35）
      wx.skyRoutePageMask =  (eve.pageMask != undefined) ? Math.min(Math.max(eve.pageMask, 0), 100) : 35
      // 路由动画时长 （ms 默认350)
      wx.skyRouteDuration = (eve.routeDuration != undefined) ? Math.min(Math.max(eve.routeDuration, 100)
      , 1500) : 350
      // 页面是否禁止拖动返回交互
      wx.skyDisableDrag = (eve.disableDrag != undefined) ? eve.disableDrag : false
      // 上个页面是否参与推出动画（根据页面路由自动规划）
      wx.skyFromPageAnimation = (eve.fromPageAnimation != undefined) ? eve.fromPageAnimation : false
      // 路由跳转类型（现支持 向上'upRoute'、向下'downRoute'、向左'rightRoute'、'rightRoute'、弹出'popRoute'、隐式'implicitRoute')
      wx.skyRouteType = (eve.routeType != undefined) ? eve.routeType : 'upRoute'
      // wx.nextTick(()=>{
      // })

      navigateTemp(eve)

  }


    //除法函数，用来得到精确的除法结果
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    accDiv(arg1, arg2) {
      var t1 = 0, t2 = 0, r1, r2;
      try {
          t1 = arg1.toString().split(".")[1].length
      } catch (e) {
      }
      try {
          t2 = arg2.toString().split(".")[1].length
      } catch (e) {
      }
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      let res =  (r1 / r2) * Math.pow(10, t2 - t1);
      return parseFloat(res.toFixed(2))
  }

  //乘法函数，用来得到精确的乘法结果
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：accMul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果

  accMul(arg1, arg2) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
          m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
          m += s2.split(".")[1].length 
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }




  //加法函数，用来得到精确的加法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：accAdd(arg1,arg2)
  //返回值：arg1加上arg2的精确结果

  accAdd(arg1, arg2) {
      var r1, r2, m;
      try {
          r1 = arg1.toString().split(".")[1].length
      } catch (e) {
          r1 = 0
      }
      try {
          r2 = arg2.toString().split(".")[1].length
      } catch (e) {
          r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
  }



  //减法函数
  accSub(arg1, arg2) {
      var r1, r2, m, n;
      try {
          r1 = arg1.toString().split(".")[1].length
      } catch (e) {
          r1 = 0
      }
      try {
          r2 = arg2.toString().split(".")[1].length
      } catch (e) {
          r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = (r1 >= r2) ? r1 : r2;
      return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
  }


    rpx2px(rpx,windowWidth){
      let px = (windowWidth / 750) * Number(rpx)
      return Math.floor(px);
  }


  px2rpx(px,windowWidth){
      let rpx = (750 / windowWidth) * Number(px)
      return Math.floor(rpx);
  }

  /**
   * 将数字转为成千位符号,分隔
   * @param {*} number 
   */
  formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 将数字转换成字符串，并且清楚末尾无效的0
   * @param {*} num 
   */
  removeTrailingZeros(num) {
    let str = num.toString();
    
    // 判断是否包含小数点
    if (str.indexOf('.') !== -1) {
      // 去除末尾的0和小数点
      while (str.charAt(str.length - 1) === '0') {
        str = str.slice(0, -1);
      }
      
      // 如果末尾是小数点，则去除小数点
      if (str.charAt(str.length - 1) === '.') {
        str = str.slice(0, -1);
      }
    }
    
    // 返回处理后的结果
    return str;
  };

  numberUpper(num) {
    var chineseNum = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var unit = ["", "拾", "佰", "仟"];
    var bigUnit = ["", "万", "亿", "万亿"];
    var smallUnit = ["角", "分", "厘", "毫"];

    // 将数字转换为字符串
    var numStr = num.toString();


    // 处理整数部分
    var result = "";
    var zeroFlag = false; // 标记是否需要添加零
    // 处理小数部分
    var integerStr = numStr.split('.')[0];
    var len = integerStr.length;
    for (var i = 0; i < len; i++) {
        var digit = parseInt(integerStr[i]);
        var unitIndex = (len - i - 1) % 4;

        if (digit !== 0) {
            result += (zeroFlag ? chineseNum[0] : '') + chineseNum[digit] + unit[unitIndex];
            zeroFlag = false;
        } else {
            zeroFlag = true;
        }

        // 添加万、亿等单位
        if (unitIndex === 0 && i < len - 1) {
            result += bigUnit[Math.floor((len - i - 1) / 4)];
        }
    }

    // 处理小数部分
    var decimalIndex = numStr.indexOf('.');
    if (decimalIndex !== -1) {
        var decimalPart = numStr.substring(decimalIndex + 1).slice(0, 4);
        if (decimalPart !== "") {
            result += "点"; // 添加小数点
            for (var j = 0; j < decimalPart.length; j++) {
                var decimalDigit = parseInt(decimalPart[j]);
                result += chineseNum[decimalDigit] + (decimalDigit !== 0 ? smallUnit[j] : '');
            }
        }
    }

    // 处理没有整数部分的情况
    if (result === "") {
        result = chineseNum[0];
    }

    return result;
  };

  // 深克隆
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj; // 如果是原始类型或 null，直接返回
    }
  
    if (Array.isArray(obj)) {
      // 如果是数组，进行数组的深克隆
      const newArray = [];
      for (let i = 0; i < obj.length; i++) {
        newArray[i] = this.deepClone(obj[i]);
      }
      return newArray;
    }
  
    // 如果是对象，进行对象的深克隆
    const newObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = this.deepClone(obj[key]);
      }
    }
    return newObj;
  }

    /**
   * 节流方法
   * @param {*} method 
   * @param {*} wait 
   */
    throttle(method, wait=350) {
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

    /**
 * 防抖函数
 * @param {*} func 
 * @param {*} wait 
 */
  debounce(func, wait = 350){
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

  /**
   * 小程序更新方法
   */
  #numHasTried = 0 // 重试次数
  async versionUpdate() {
    console.log("Check for updates")
    if (!wx.canIUse("getUpdateManager")) {
      wx.showModal({
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        showCancel: false
      })
      return false
    }

    const updateManager = wx.getUpdateManager() // 每次取到的实例内存地址都不一样

    let res = await promisifys.promisifyOn(updateManager.onCheckForUpdate)()
    if (res.hasUpdate) {
      updateManager.onUpdateFailed(() => {
        console.log("更新竟然失败了")
        // 更新失败了，重试三次吧
        if (this.#numHasTried++ < 3) {
          this.execute() // 这是地方部分机型是真有可能失败
        } else {
          wx.showModal({
            content: "版本更新失败，请将小程序从是近列表中删除后重试。如果还不行，请与门店伙伴联系",
            showCancel: false
          })
        }
      })

      await promisifys.promisifyOn(updateManager.onUpdateReady)()
      res = await promisifys.promisify(wx.showModal)({
        title: "更新",
        content: "新版本已准备好，马上重启更新？"
      })
      wx.setStorageSync("myPrivateStorage", Math.random())

      // 新版本已经下载好，用户也同意了，重启
      if (res.confirm) {
        updateManager.applyUpdate()

      }
      return true
    }

    return false
  }

  
}

export default new SkyUtils()