# sky-route 普通路由
  由工具类SkyUtils.skyNavigate(Object object)方法与sky-routePage组件形成

### 主要功能与实现思路
  该组件的主要功能还是自定义路由，但辅以手势系统、worklet动画，完成了比官方的预设路由更丰富的效果，与高级路由的区别是内部没有兼容<scroll-view>组件。

1. 路由类型 
  向上'upRoute'、向下'downRoute'、向左'rightRoute'、向右'rightRoute'、弹出'popRoute'、隐式'implicitRoute'
2. 路由效果
  以下属性均可自定义：路由页面高度、路由页面宽度、路由页面背景透明度、路由动画时长、源页面是否参与动画效果、页面是否禁止拖动返回交互
3. 实现思路
  可以参考官方的自定义路由文档

4. 目前未验证横向滚动的可用性，希望您可以尝试并告知我，万分感谢。

### 组件包结构
  路由组件由1个自定义组件 sky-routePage组成，并且需要用到已经工具类SkyUtils

### 使用前说明
1. 页面中引用组件时，请酌情添加class或style样式，例如加上背景色，可能会导致背景不透明

2. 手势拖动效果的可用范围，只在pageWidth、pageHeight的设定值内，超出范围属于遮罩层，可以通过遮罩层点击事件 "tapmask" 处理

3. 使用leftRoute时，页面左边会有阴影，属于原生效果，无法处理，请谅解


### 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明

2. 初始化 SkyUtils 工具类，SkyUtils包含组件所需的所有方法已经多种实用函数，所以建议在app-onLaunch中初始化,当然也可以在跳转行为前。
```
  <!-- app.js -->
  App({
    onLaunch() {
        ;(async ()=>{
          const SkyUtils = await import('./miniprogram_npm/jieyue-ui-com/utils/skyUtils');
          // 在函数调用时动态引入模块
          wx.SkyUtils = SkyUtils.default;
          wx.SkyUtils.skyInit()
        })()
    }
  })
```
3. 跳转form页面使用SkyUtils.skyNavigate()方法
```
<!-- 跳转form页面 -->
  page({
    methods:{
      gotoRoutePage(){
          wx.SkyUtils.skyNavigate({
            "pageHeight": 60, // 页面高度（竖直方向路由） （单位*% 默认99,100会有未知错误）
            "pageWidth": 60, // 页面宽度（横向方向路由） （单位*% 默认99,100会有未知错误）
            "pageMask":  35, // 背景透明度 （单位*% 默认35）
            "routeDuration":  350, // 路由动画时长 （ms 默认350）
            "disableDrag":  false, // 页面是否禁止拖动返回交互
            "fromPageAnimation":  false, // 上个页面是否参与推出动画（根据页面路由自动规划）
            "routeType": "upRoute", // 路由跳转类型（现支持 向上'upRoute'、向下'downRoute'、向左'rightRoute'、'rightRoute'、弹出'popRoute'、隐式'implicitRoute'）
            "url":"/pages/routePageAbout/routePageAdvanceTemp/routePageAdvanceTemp" //目标页面的路径,
            "events": {
              // 同wx.navigateTo(Object object)为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function(data) {
                console.log(data)
              },
              someEvent: function(data) {
                console.log(data)
              }
              ...
            },
            success: function(res) {
              // 同wx.navigateTo(Object object)成功回调 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            },
            fail: function(res) {
              // 同wx.navigateTo(Object object)  失败回调
            },
            complete: function(res) {
              // 同wx.navigateTo(Object object)  完成回调
            },
          })
      }
    }
  })
```

4. 在跳转目标页面的 json 配置文件中添加  sky-routeAdvancePage 自定义组件的配置
```
    "usingComponents": {
      "sky-routerPageAdvance":"/miniprogram_npm/jieyue-ui-com/sky-routeAdvancedPage/sky-routeAdvancedPage"
    }
```

5. 在跳转目标页面中使用组件
```
<!-- 跳转目标页面 -->
  <sky-routerPage bind:tapmask="closePage" >
    <view style="width: 100%;height: 100%;background-color: red;"></view>
  </sky-routerPage>
```

6. 特殊情况
当routeType=downRoute时，手势互动会出现瑕疵，后续会跟进修复

## API
### 方法skyNavigate(Object object)中Props
| 参数              | 说明                                     | 类型    | 默认值             |
| :---             | :---                                    | :---    | :---               |
| pageHeight       | 页面高度（竖直方向路由） （单位*%）       | Number  | 60                 |
| pageWidth        | 页面宽度（横向方向路由） （单位*%）       | Number  | 60                 |
| pageMask         | 背景透明度 （单位*%）                     | Number  | 35                 |
| routeDuration    | 路由动画时长 （ms）                       | Number  | 350                |
| disableDrag      | 页面是否禁止拖动返回交互                   | Boolean | false              |
| fromPageAnimation| 上个页面是否参与推出动画（根据页面路由自动规划）| Boolean | false              |
| routeType        | 路由跳转类型（向上'upRoute'、向下'downRoute'、向左'rightRoute'、'rightRoute'、弹出'popRoute'、隐式'implicitRoute'）| String | "upRoute" |
| url              | 目标页面的路径                            | String  | -                  |
| events              | 页面间通信接口，用于监听被打开页面发送到当前页面的数据。基础库 2.7.3 开始支持                            | String  | -                  |
| success              | 接口调用成功的回调函数                            | Object  | -                  |
| fail              | 接口调用失败的回调函数                            | function  | -                  |
| complete              | 接口调用结束的回调函数（调用成功、失败都会执行）                            | String  | -                  |


### 组件sky-routeAdvancedPage中Props
无


### 组件事件Events（使用时，请先查看下方 <b>重要Events示例代码</>
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| tapmark               | 点击遮罩层                         | -    |



## slot节点
### 内部slot  用户自定义内容






