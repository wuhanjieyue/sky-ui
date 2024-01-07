# sky-circles  圆环组件

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无


## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-circles":"/miniprogram_npm/jieyue-ui-com/sky-circles/sky-circles",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-circles title="自定义起止点" canvas-id="sd0" size="1" width="mini" animation="false" start-pi="0.6" circles="[object Object],[object Object],[object Object]"  ></sky-circles>
```

## API
### 组件Props
| 参数             | 说明               | 类型      | 默认值                |
| :---             | :---               | :---      | :---                  |
| canvasId         | 图表id             | String    | new Date().getTime()  |
| size             | 图标大小  默认宽度是屏幕的一半         | Number    | 1                     |
| circles          | 圆环数据列表，最大数量最好不要超过3个         | Array    | [circleItem]       请参考以下circleItemProps                     |
| width          | 线条粗细 可选值：default/blod/mini             | String    | default               |
| animation        | 是否显示动画效果   | Boolean   | true                  |
| touchBack        | 点击反馈           | Boolean   | false                 |
| startPI  | 进度开始位置(单位PI，范围0-2)，例如12点方向是0*PI,6点钟方向是1*PI           | Number    | 0      |

### circleItemProps
{percent:0.8, color:'var(--warn-l1)'}
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| percent        | 圆环进度      | Number  | 0           |
| color         | 圆环颜色       | String  | -          |


### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchCanvas             | 点击图表事件                        |        touchX :点击位置在图表中的相对定位X,touchY:点击位置在图表中的相对定位Y,pageX:点击位置在屏幕的相对定位X,pageY：点击位置在屏幕的相对定位Y,touchIndex:当前选中的下标   |
