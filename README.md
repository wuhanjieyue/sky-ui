# Skyline UI 组件库

## 前言
Skyline 是微信小程序推出的一个类原生的渲染引擎，其使用更精简高效的渲染管线，性能比 WebView 更优异，并且带来诸多增强特性，如 Worklet 动画、手势系统、自定义路由、共享元素等。

使用这个组件库的前提是：通过微信小程序原生+skyline框架开发，所以目前我们不保证兼容webview框架（也就是电脑端与低版本的微信），但后续会进行系统性的兼容。

使用 Skyline UI前，请确保你已经学习过微信官方的 **[微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)** 和 **[Skyline 渲染引擎文档](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)** 。

## 背景
随着Skyline 渲染引擎 1.1.0 版本发布，我们所运营的小程序也平稳的渡过了阵痛期，团队使用Skyline也越来得心应手，所以接下来，团队的开发重心全面偏向Skyline渲染框架，考虑有大量的UI交互重复，我们决定基于Skyline开发了这个UI组件库。

但团队力量有限，这个新生的组件可能有很多的不尽如人意，所以希望能以开源的方式吸引更多开发者使用Skyline框架，如果这个框架不适合你，也可以借鉴其思路。

## 在线预览 
以下是目前两个使用该框架的小程序
### SkylineUI组件库
![SkylineUI](https://sky-ui-1300145561.cos.ap-chengdu.myqcloud.com/skylineui.png)

### NONZERO COFFEE
![SkylineUI](https://sky-ui-1300145561.cos.ap-chengdu.myqcloud.com/nonzero.png)


# 开始使用

## UI库结构
Skyline UI组件库 依赖于以下四部分，具体使用参考以下的具体说明

1. utils工具库： 其中包含了UI库自定义的一个工具类SkyUtils，它包含了组件中所含的各种函数，非常重要。
2. 各组件元素：sky-*(组件名)
3. skywxss样式库：其中包含深浅色色彩、文字字体、布局等样式wxss

## 在小程序中引入 UI库

### 一、直接下载引入
1. [点击下载组件包](https://gitee.com/wuhan-jieyue-information/skylineui-component-library.git)
2. 将src下所有文件复制到您项目根目录下的components文件夹中，没有的话请自行新建。

### 二、npm引入
1.在小程序项目中，可以通过 npm 的方式引入 SkylineUI组件库 。如果你还没有在小程序中使用过 npm ，那先在小程序目录中执行命令：
```javascript
npm init -y
```
2.安装组件库
```javascript
npm install jieyue-ui-com
```
3.npm 命令执行完后，需要在开发者工具的项目中点菜单栏中的 工具 - 构建 npm 

### 两种引入方式的不同可能导致后续使用时，引用组件的路径不同，请注意区别
1.直接引入components文件夹内，引用地址通常是 './components/*'
2.npm引入，组件引用地址通常是'./miniprogram_npm/jieyue-ui-com/*'

## 如何使用
1.在app.js文件中初始化工具类，并且添加两个全局变量
```javascript
// app.js
App({
  onLaunch() {

      ;(async ()=>{
        // 全局注册工具类SkyUtils
        // 这里默认npm引用，地址为'./components/utils/skyUtils'，如果是直接引用组件，地址可能是'./components/utils/skyUtils',后面不再说明
        const SkyUtils = await import('./components/utils/skyUtils');
        wx.SkyUtils = SkyUtils.default;
        // 初始化设备与系统数据
        wx.SkyUtils.skyInit()
        // 小程序自动更新方法
        wx.SkyUtils.versionUpdate()
      })()
  },
  
  globalData: {
    sky_system:{},
    sky_menu:{}
  },

})

```

2.在app.wxss文件中引入样式文件
```javascript
//wxss * _dark.wxss 是适配深色模式的色彩变量
@import '/miniprogram_npm/jieyue-ui-com/skywxss/skycolor.wxss';
@import '/miniprogram_npm/jieyue-ui-com/skywxss/skycolor_dark.wxss';
@import '/miniprogram_npm/jieyue-ui-com/skywxss/skyfontline.wxss';
@import '/miniprogram_npm/jieyue-ui-com/skywxss/skyfont.wxss';
@import '/miniprogram_npm/jieyue-ui-com/skywxss/skyother.wxss';

```

3.page.json中引用组件
```javascript
//page.json
{
  "usingComponents": {
  "sky-text":"/miniprogram_npm/jieyue-ui-com/sky-text/sky-text"
  }
}
```

4.页面中使用
```javascript
 // wxml 
  <sky-text  content="文本内容" max-lines="2" fade></sky-text>
```

5.其他组件具体使用请参考组件包中的redeme.md

## 适配深色模式
如果您在开发时，全部使用我们预设好的颜色变量，那么可以自动适配深色模式。

```css
.page{
    background-color: var(--bg-l0);
}
```

```html
    <view style="background-color: var(--bg-l0)"></view>
    <view style="background-color: {{color}}"></view>
```

```javascript
    Page({
      data: {
        color: "var(--bg-l0)"
      }
    })
```


