# sky-smoothPolyline  折线图

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无


## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-smoothPolyline":"/miniprogram_npm/jieyue-ui-com/sky-smoothPolyline/sky-smoothPolyline",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-smoothPolyline  canvas-id="sd1" type="smooth" show-axis="true" chart-width="300" chart-height="150" animation="true" touch-back="true" _list="[object Object]"  ></sky-smoothPolyline>
```

## API
### 组件Props
| 参数          | 说明                     | 类型      | 默认值               |
| :---          | :---                     | :---      | :---                 |
| canvasId      | 图表唯一id               | String    | ""                   |
|               |                          | Number    |                      |
| chartWidth    | 图表宽度   （请尽量保持宽高比2:1）              | Number    | 屏幕宽度          |
|               |                          | String    |                      |
| chartHeight   | 图表高度     （请尽量保持宽高比2:1）            | Number    | chartWidth/2        |
|               |                          | String    |                      |
| lineList         | 图表数据集 (代表多条数据的数组)                | Array     | [pointsItem] 请参考以下pointItemProps                  |
| animation     | 图表是否显示展开动画     | Boolean   | true                 |
| showAxis      | 是否显示图表坐标轴       | Boolean   | false                |
| type          | 图表类型，可选 'line'直连线/'smooth'平滑过渡 | String | 'smooth'       |
| touchBack     | 点击交互                 | Boolean   | false                |



### pointsItemProps
{name:'今天',lineColor:'var(--main-l1)',fill:false,linWidth:3,pointList:[{ x: 0, y: 400},
{ x: 100, y: 500 ,showPoint:true,showX:true}],
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| name          | 数据名称         | String  | ''            |
| lineColor          | 数据线条颜色         | String  | '#ffffff'            |
| fill          | 数据是否显示填充色     | Boolean  | false           |
| lineWidth          | 数据线条宽度       | Number  | 3           |
| pointList          | 坐标点的数据列表       | Array  | [point]   请参考以下pointProps        |


### pointProps
{ x: 100, y: 500 ,showPoint:true,showX:true}
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| x          | x坐标显示值 (这里只是显示值，x的长度会平均分布)        | String  | -           |
| y          | y坐标显示值(这里是y轴的真实长度，但会根据canvas的高度压缩)         | Number  | -          |
| showPoint          | 是否显示坐标点     | Boolean  | false           |
| showX          | 是否在X轴上显示出坐标信息（y轴信息会自动计算）       | BooleaN  | false          |




### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchCanvas             | 点击图表事件                        |        touchX :点击位置在图表中的相对定位X,touchY:点击位置在图表中的相对定位Y,pageX:点击位置在屏幕的相对定位X,pageY：点击位置在屏幕的相对定位Y   |
