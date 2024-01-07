# sky-tabbar  底部导航栏

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无


## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-tabbar":"/miniprogram_npm/jieyue-ui-com/sky-tabbar/sky-tabbar",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-tabbar title="凸出滚动" type="protrude" shadow="true" selected="0" tabbar-list="[object Object],[object Object],[object Object],[object Object],[object Object]" safe-bottom="false" animation="true" vibration="true" border-radius="true" color="var(--text-l2)" selected-color="var(--text-l0)" background-color="var(--main-l3)"  ></sky-tabbar>
```

## API
### 组件Props
| 参数             | 说明                                   | 类型      | 默认值               |
| :---             | :---                                   | :---      | :---                 |
| canvasId       | 当type为凸出或凹陷滚动时，组件部分是由canvas绘制，如果一个页面需复用此组件，需要给每个组件指定不同的canvasI的，不然会出现绘制不成功的情况         | String|Number   | ''                 |
| safeBottom       | 自动显示导航栏底部安全区域               | Boolean   | true                 |
| type             | 导航栏样式，可选 'norm'普通/'protrude'凸出/'concave'凹陷 | String | 'norm'          |
| tabbars          | 导航栏列表                             | Array     | [tabbarItem]  请参考以下tabbarItemProps 文档                    |
| selected         | 默认选中项下标                         | Number    | 0                    |
| borderRadius     | 导航栏边框弧角                         | Boolean   | false                |
| color            | tab上的文字默认颜色，使用颜色变量可以自动适配深色模式 | String | 'var(--text-l2)' |
| selectedColor    | 选中项文字默认颜色，使用颜色变量可以自动适配深色模式 | String | 'var(--text-l0)' |
| backgroundColor  | 底部导航栏背景色                       | String    | 'var(--bg-l0)'      |
| animation        | 切换选中项是否有动画效果               | Boolean   | false                |
| vibration        | 切换选中项是否有震动效果               | Boolean   | false                |
| shadow           | 底部导航栏阴影                         | Boolean   | false                |


### 请参考以下tabbarItemProps
{pagePath:"",text:"消息",iconPath:"",selectedIconPath:"",iconPathDark:"",selectedIconPathDark:""}
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| id          | 唯一id         | String|Number  | 必须含有此字段            |
| pagePath          | 跳转页面url         | String  | ''            |
| text          | 选项文字       | String  | ''           |
| iconPath          | 未选中项图片地址         | String | ''            |
| selectedIconPath          | 选中项图片地址         | String | -            |
| iconPathDark     | 黑暗模式未选中项图片地址         | String  | ''                 |
| selectedIconPathDark      | 黑暗模式未选中项图片地址| String  | ''                 |


### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| tapIcon               | 切换选项                        | index #选中的选项下标；pagePath #跳转页面地址   |
