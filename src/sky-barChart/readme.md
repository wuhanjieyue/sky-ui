# sky-barChart  柱状图

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无


## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-barChart":"/miniprogram_npm/jieyue-ui-com/sky-barChart/sky-barChart",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-barChart title="自定义" canvas-id="sd1" show-axis="true" color="var(--warn-l2)" chart-width="372.6" chart-height="186.3" animation="true" touch-back="true" list="[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]"  ></sky-barChart>
```

## API
### 组件Props
| 参数          | 说明                     | 类型      | 默认值               |
| :---          | :---                     | :---      | :---                 |
| canvasId      | 图表唯一id               | String    | ""                   |
| chartWidth    | 图表宽度 （请尽量保持宽高比2:1）                | Number    | 屏幕宽度          |
| chartHeight   | 图表高度   （请尽量保持宽高比2:1）              | Number    | chartWidth/2        |
| color          | 柱状全局颜色，若需要修改单独颜色，请参考以下pointItem    | String  | var(--suc-l1)          |
| lineList         | 图表数据集 (代表多条数据的数组)                | Array     | [pointItem] 请参考以下pointItemProps                  |
| animation     | 图表是否显示展开动画     | Boolean   | true                 |
| showAxis      | 是否显示图表坐标轴       | Boolean   | false                |
| touchBack     | 点击交互                 | Boolean   | false                |



### pointsItemProps
{x:'今天',y:200,color:'var(--main-l1)',showX:true},
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| x          | x坐标显示值 (这里只是显示值，x的长度会平均分布)          | String  | ''            |
| y          | y坐标显示值(这里是y轴的真实长度，但会根据canvas的高度压缩)         | Number  | -          |
| color          | 柱状自定义颜色，设置此项会覆盖上面全局设置     | String  | -           |
| showX          | 是否在X轴上显示出坐标信息（y轴信息会自动计算）       | BooleaN  | false          |





### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchCanvas             | 点击图表事件                        |        touchX :点击位置在图表中的相对定位X,touchY:点击位置在图表中的相对定位Y,pageX:点击位置在屏幕的相对定位X,pageY：点击位置在屏幕的相对定位Y,index:选中项的下标   |
