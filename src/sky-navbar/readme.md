# sky-navbar  顶部导航栏

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
      "sky-navbar":"/miniprogram_npm/jieyue-ui-com/sky-navbar/sky-navbar",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
            <sky-navbar   saft-top="{{saftTop}}" custom="{{custom}}" lay-out="{{layOut}}" left-icon="{{leftIcon}}" auto-icon="{{autoIcon}}" right-icon="{{rightIcon}}" left-size="{{leftSize}}" right-size="{{rightSize}}" icon-color="{{iconColor}}" icon-type="{{iconType}}" title="{{title}}" title-size="{{titleSize}}" title-blod="{{titleBlod}}" title-color="{{titleColor}}" shadow="{{shadow}}"
            bind:touchLeft="touchleft"  bind:touchRight="touchright" bind:touchText="touchtext" >
      </sky-navbar>

  <!--js-->
  Component({
    data: {
        saftTop: true, // 顶部安全区域
        custom: false, // 自定义导航栏
        layOut: 'start', // 布局 start center
        leftIcon: 'chevron-left', // 首位图标
        autoIcon: '', // 首位自动切换图标，当设置时，如果检测页面栈<=1时，左侧图标自动切换成设置的autoIcon
        rightIcon: '', // 次位图标
        leftSize: 38, // 左边图标大小
        rightSize: 38, // 右边图标大小
        iconColor: 'var(--text-l0)', // 图标颜色
        iconType: 'normal', // 图标展示类型 normal 普通排列； capsule 胶囊类型
        title: '', // 标题
        titleSize: 32, // 标题字体大小
        titleBlod: false, // 标题加粗
        titleColor: 'var(--text-l0)', // 标题颜色
        shadow: false // 导航栏底部阴影
    },
    methods:{
        touchtext(){
            wx.showToast({
              title: '点击标题文字',
            })
          },
          touchright(){
            wx.showToast({
              title: '点击右侧按钮',
            })

          },
          touchleft(){
            wx.showToast({
              title: '点击左侧按钮',
            })
          },
    }
  })
```



## API
### 组件Props
| 参数         | 说明                                     | 类型      | 默认值               |
| :---         | :---                                     | :---      | :---                 |
| saftTop      | 顶部安全区域                             | Boolean   | true                 |
| custom       | 自定义导航栏                             | Boolean   | false                |
| layOut       | 布局（start或center）                     | String    | "start"              |
| leftIcon     | 首位图标                                 | String    | 'chevron-left'       |
| autoIcon     | 首位自动切换图标，检测页面栈<=1时自动切换 | String    | ''                   |
| rightIcon    | 次位图标                                 | String    | ''                   |
| leftSize     | 左边图标大小                             | Number    | 38                   |
| rightSize    | 右边图标大小                             | Number    | 38                   |
| iconColor    | 图标颜色                                 | String    | 'var(--text-l0)'    |
| iconType     | 图标展示类型（normal或capsule）           | String    | 'normal'             |
| title        | 标题                                     | String    | ''                   |
| titleSize    | 标题字体大小                             | Number    | 32                   |
| titleBlod    | 标题加粗                                 | Boolean   | false                |
| titleColor   | 标题颜色                                 | String    | 'var(--text-l0)'    |
| shadow       | 导航栏底部阴影                           | Boolean   | false                |


### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchLeft               | 点击左侧按钮                         | -    |
| touchRight             | 点击右侧按钮  | -    |
| touchText             | 点击文字  | -    |

