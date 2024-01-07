# sky-number  数字

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无

## 组件说明
引用了DIN字体（优美的数字字体）,如果您对该字体的商用版权感到困惑,请修改fontType属性，其默认是'din',修改成'normal'则代表不使用DIN字体。

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-number":"/miniprogram_npm/jieyue-ui-com/sky-number/sky-number",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
  <sky-number title="显性变化" number="81927.92819" font-type="din" format-type="commas" duration="500" animation="true"  ></sky-number>
  
```
## API
### 组件Props
| 参数        | 说明                   | 类型    | 默认值  |
| :---        | :---                   | :---    | :---   |
| number      | 数字                   | Number  | 0      |
| fontType    | 字体类型               | String  | 'din'  |
| formatType  | 数字展示类型           | String  | 'normal'|
| trimZero    | 清除数字末尾无效的0    | Boolean | false  |
| duration    | 数字改变的时长         | Number  | 0      |
| animation   | 数字变化时显示缩放动画效果 | Boolean | false  |

