# sky-halfCircle  半圆图

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无


## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-halfCircle":"/miniprogram_npm/jieyue-ui-com/sky-halfCircle/sky-halfCircle",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
<sky-halfCircle  canvas-id="sd1" size="1" percent="0.8" background-color="var(--suc-l3)" color="var(--suc-l1)" animation="true" width="default" touch-back="false"  ></sky-halfCircle>
```

## API
### 组件Props
| 参数             | 说明               | 类型      | 默认值                |
| :---             | :---               | :---      | :---                  |
| canvasId         | 图表id             | String    | new Date().getTime()  |
| size             | 图标大小  默认宽度是屏幕的一半         | Number    | 1                     |
| percent          | 进度百分比         | Number    | 0                     |
| backgroundColor  | 背景底色           | String    | 'var(--bg-l3)'        |
| color            | 进度条颜色         | String    | 'var(--bg-l2)'        |
| width            | 线条粗细           | String    | 'default'             |
| animation        | 是否显示动画效果   | Boolean   | true                  |
| touchBack        | 点击反馈           | Boolean   | false                 |



### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchCanvas             | 点击图表事件                        |        touchX :点击位置在图表中的相对定位X,touchY:点击位置在图表中的相对定位Y,pageX:点击位置在屏幕的相对定位X,pageY：点击位置在屏幕的相对定位Y,onSchedule:点击位置是否在进度内   |
