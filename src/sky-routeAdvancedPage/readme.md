# sky-routeAdvance 高级路由
  由工具类SkyUtils.skyNavigate(Object object)方法与sky-routeAdvancePage组件形成

### 主要功能与实现思路
  该组件的主要功能还是自定义路由，但辅以手势系统、worklet动画，完成了比官方的预设路由更丰富的效果，并且组件已经嵌入<scroll-view>，不需要操心<scroll-view>与自定义路由的交互代码，您只需要关心<scroll-view>组件内的内容即可。

1. 路由类型 
  向上'upRoute'、向下'downRoute'、向左'rightRoute'、向右'rightRoute'、弹出'popRoute'、隐式'implicitRoute'
2. 路由效果
  以下属性均可自定义：路由页面高度、路由页面宽度、路由页面背景透明度、路由动画时长、源页面是否参与动画效果、页面是否禁止拖动返回交互、同时几乎兼容了<scroll-view>组件的所有属性与方法
3. 实现思路
  可以参考官方的自定义路由文档

4. 目前未验证横向滚动的可用性，希望您可以尝试并告知我，万分感谢。

### 组件包结构
  路由组件由1个自定义组件 sky-routeAdvancePage和他的behavior.js 组成，并且需要用到已经工具类SkyUtils

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
  <sky-routerPageAdvance  type="list" scroll-list="{{list}}"  scroll-y scroll-class="scrlclass"	 bind:tapmask="closePage" >
  <view slot="heardslot" style="width: 80%;height: 90px;margin-top: 30rpx;background-color: green"></view>
    <!-- 顶部占位组件 -->
      <view slot="footslot" style="width: 80%;height: 90px;margin-top: 30rpx;background-color: green;"></view>
    <!-- scroll-view组件的列表数据 -->
    <view  wx:for="{{list}}" wx:key="id" wx:for-item="item" wx:for-index="index" style="width: 80%;height: 90px;margin-top: 30rpx;background-color: red;" >
      <view>{{index}}</view>
    </view>
<!-- 底部占位组件 -->
    <view slot="footslot" style="width: 80%;height: 90px;margin-top: 30rpx;background-color: green;"></view>
</sky-routerPageAdvance>

<!-- 目标页面js -->
  const getList = (num) => {
    const ans = []
    for (let i = 0; i < num; i++) {
      ans.push({
        id: i
      })
    }
    return ans
  }
  Page({

    /**
    * 页面的初始数据
    */
    data: {
        list:getList(40),
    },
    methods:{
      tapmask(){
        console.log("点击遮罩层")
      }
    }
})
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
|参数  |说明  |类型  |默认值  |
| :---   | :---   | :---   | :---   |
|scroll-class  |组件内部<scroll-view>类名| String  |- |
|scroll-list  |组件内部<scroll-view>中包裹的数据列表| Array  |[] |
|key  |组件内部<scroll-view>中包裹的数据列表 for循环的key值，对应 wx:key="{{key}}"| Array  |[] |
|type  |对应<scroll-view>的type属性,但可选值略有不同：list\custom，type = "custom" && customGrid对应原属性custom时，使用<grid-view>组件，type = "custom" && customList对应原属性custom时，使用<list-view>组件| String  |list |
|padding  |组件内部<scroll-view>的padding属性| Array  |[0, 0, 0, 0] |
|grid-type  |当<scroll-view type="custom_grid">时，对应内部<grid-view>的type值，可选：aligned\masonry,注意区分type属性| String  |aligned |
|grid-padding  |当<scroll-view type="custom_grid">时，对应内部<grid-view>的padding值,注意区分padding属性  | Array  |[0, 0, 0, 0] |
|其他grid属性  |当<scroll-view type="custom_grid">时，对应内部<grid-view>的其他属性|-  |- |
|list-padding  |当<scroll-view type="custom_list">时，对应内部<list-view>的padding值,注意区分padding属性  | Array  |[0, 0, 0, 0] |
|其他*  |组件内部<scroll-view>其他属性，基本兼容 ,暂不支持associative-container | -  |- |


### 组件事件Events（使用时，请先查看下方 <b>重要Events示例代码</>
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| tapmark               | 点击遮罩层                         | -    |
| dragstart             | 同 <scroll-view> bind:dragstart    | -    |
| dragging              | 同 <scroll-view> bind:dragging     | -    |
| dragend              | 同 <scroll-view> bind:dragend      | -    |
| dragstart             | 同 <scroll-view> bind:dragstart    | -    |
| scrolltoupper         | 同 <scroll-view> bind:scrolltoupper| -    |
| scrolltolower         | 同 <scroll-view> bind:scrolltolower| -    |
| scroll               | 同 <scroll-view> bind:scroll       | -    |
| refresherpulling     | 同 <scroll-view> bind:refresherpulling | - |
| refresherrefresh      | 同 <scroll-view> bind:refresherrefresh | - |
| refresherrestore      | 同 <scroll-view> bind:refresherrestore | - |
| refresherwillrefresh  | 同 <scroll-view> bind:refresherwillrefresh | - |
| refresherabort        | 同 <scroll-view> bind:refresherabort | - |
| adjustDecelerationVelocity | 同 <scroll-view> worklet:adjust-deceleration-velocity，组件调用时使用 bind:adjustDecelerationVelocity | - |
| onscrollstart          | 同 <scroll-view> worklet:onscrollstart，组件调用时使用 bind:onscrollstart | - |
| onscrollupdate         | 同 <scroll-view> worklet:onscrollupdate，组件调用时使用 bind:onscrollupdate | - |
| onscrollend            | 同 <scroll-view> worklet:onscrollend，组件调用时使用 bind:onscrollend | - |
| refresherstatuschange  | 同 <scroll-view> bind:refresherstatuschange | - |

### 重要Events示例代码
1. adjustDecelerationVelocity：同<scroll-view>worklet:adjust-deceleration-velocity,但在组件调用时需要使用bind:adjustDecelerationVelocity
例子：
```
<!--引用组件的页面wxml中-->
  <sky-routeblock bind:adjustDecelerationVelocity="adjustDecelerationVelocity"></sky-routeblock>
```
```
<!--引用组件的页面js中-->
  adjustDecelerationVelocity(e){
    'worklet'
    console.log(e)
  }
```
2. onscrollstart：同<scroll-view>	worklet:onscrollstart,但在组件调用时需要使用bind:onscrollstart
例子：
```
<!--引用组件的页面wxml中-->
  <sky-routeblock bind:onscrollstart="onscrollstart"></sky-routeblock>
```
```
<!--引用组件的页面js中-->
  onscrollstart(e){
    'worklet'
    console.log(e)
  }
```
3. onscrollupdate：同<scroll-view>	worklet:onscrollupdate,但在组件调用时需要使用bind:onscrollupdate
例子：
```
<!--引用组件的页面wxml中-->
  <sky-routeblock bind:onscrollupdate="onscrollupdate"></sky-routeblock>
```
```
<!--引用组件的页面js中-->
  onscrollupdate(e){
    'worklet'
    console.log(e)
  }
```
4. onscrollend：同<scroll-view>	worklet:onscrollend,但在组件调用时需要使用bind:onscrollend
例子：
```
<!--引用组件的页面wxml中-->
  <sky-routeblock bind:onscrollend="onscrollend"></sky-routeblock>
```
```
<!--引用组件的页面js中-->
  onscrollend(e){
    'worklet'
    console.log(e)
  }
```


## 动态slot节点
### 1、scroll-view组件中type="list/custom"时的列表子节点，指数组中的各项 可用程度：基本可用
#### 例子
```
<!--引用组件的页面中  直接在引用组件中使用for循环 可用属性是index和item-->
  <sky-routeblock type="list>
      <view  wx:for="{{list}}" 
          style="width: 80%;height: 90px;margin-top: 30rpx;background-color: red;" 
          id="test{{index}}" 
          data-id="{{index}}">
          item{{index}}
      </view>
  </sky-routeblock>
```


## 静态slot节点
### 1、heardslot  scroll-view组件上方插槽
### 2、footslot  scroll-view组件下方插槽
### 3、refresher scroll-view组件自定义刷新插槽 使用条件：refresherEnabled && refresherTwoLevelEnabled  可用程度：完全可用 ；其他用法参考微信文档
### 4、nestedheader01/nestedheader02/nestedheader03/nestedbody scroll-view组件嵌套nested插槽（nested-scroll-header暂时只支持3个，如有个性化需求，可自己修改源码） 使用条件：type == 'nested' 可用程度：未验证可用 ；其他用法参考微信文档





