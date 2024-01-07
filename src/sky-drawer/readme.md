# sky-drawer  抽屉

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
该组件依赖 sky-icon、sky-text 组件，使用前请确保以下组件的存在
```
  "usingComponents": {
    "sky-icon":"/miniprogram_npm/jieyue-ui-com/sky-icon/sky-icon",
    "sky-text":"/miniprogram_npm/jieyue-ui-com/sky-text/sky-text"
  }
```

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-draw":"/miniprogram_npm/jieyue-ui-com/sky-drawer/sky-drawer",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-draw  title="{{item.name}}" icon-name="{{item.icon}}" draw-flag="{{index == 0 ? true : false}}" bind:tap="tapIcon" id="drawerCom">
        <view wx:for="{{dataList}}" wx:key="id" wx:for-item="citem" >
            抽屉内容：{{index}}-{{item}}
        </view>
      </sky-draw>

  <!--js-->
  Component({
    data: {
      title: '', // 抽屉标题
      iconName: '', // 抽屉右边的按钮图标（参考icon）
      iconImg: '', // 抽屉右边的自定义按钮的图片地址url
      backColor: 'var(--bg-l0)', // 抽屉背景颜色
      textColor: 'var(--text-lo)', // 抽屉文字颜色
      drawFlag: false, // 控制抽屉是否展开
      drawDuration: 250, // 抽屉展开与回收的动画时长
      drawIconRotate: 0, // 点击右边按钮时会有旋转动画，此属性控制旋转角度
      drawControl: true // 点击抽屉标题栏时，是否自动展开闭合
    },
    methods:{
      tapIcon(){
        console.log("点击抽屉图标")
      }
    }
  })
```

4. 组件对外方法，组件内部数据变动时，无法自动获取内容高度，这时在引用页面可以调动组件的：computeHeight(drawFlag)方法重新计算抽屉高度。
```
  <!-- 组件js内 -->
      /**
     * @param {抽屉闭合判断} drawFlag 
     */
    computeHeight(drawFlag){}

    <!-- 引用页面js -->
    methods:{
      reSetData(){
          this.setData({dataList:newDataList})
          wx.nextTick(()=>{
              this.selectComponent("#drawerCom").computeHeight(true)
          })
      }
    }
```

## API
### 组件Props
| 参数             | 说明                                | 类型      | 默认值              |
| :---             | :---                                | :---      | :---                |
| title            | 抽屉标题                             | String    | ''                  |
| iconName        | 抽屉右边的按钮图标（参考icon）        | String    | ''                  |
| iconImg          | 抽屉右边的自定义按钮的图片地址url     | String    | ''                  |
| backColor        | 抽屉背景颜色                         | String    | 'var(--bg-l0)'      |
| textColor        | 抽屉文字颜色                         | String    | 'var(--text-lo)'    |
| drawFlag         | 控制抽屉是否展开                     | Boolean   | false               |
| drawDuration     | 抽屉展开与回收的动画时长             | Number    | 250                 |
| drawIconRotate   | 点击右边按钮时会有旋转动画，此属性控制旋转角度| Number  | 0                  |
| drawControl      | 点击抽屉标题栏时，是否自动展开闭合    | Boolean   | true                |

### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| tapIcon               | 点击右侧按钮，抽屉是否回收由drawControl控制                       | -    |
| computeHeight(drawFlag) | 组件对外方法，重新计算抽屉内容高度，使用方法详见 5.                       | drawFlag（抽屉闭合判断）   |

## slot节点
### drawer组件中内容自定义组件， 可用程度：基本可用
### 特殊情况，当内部组件内容发生变化时，需要重新计算高度，这是使用组件对外方法即可 computeHeight(drawFlag).
```
    <slot></slot>
```
