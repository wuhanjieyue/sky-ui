# sky-text  文字

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-text":"/miniprogram_npm/jieyue-ui-com/sky-text/sky-text",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
  <sky-text    content="文本内容" max-lines="2" fade></sky-text>
  
```
## API
### 组件Props
| 参数        | 说明               | 类型      | 默认值  |
| :---        | :---               | :---      | :---   |
| content     | 文本内容            | String    | ''     |
| userSelect  | 长按文字是否可选    | Boolean   | false  |
| maxLines    | 最大行数            | Number    | -1     |
| clip       | 文本溢出处理-修剪 (和以下几个参数四选一) 优先级按顺序依次  | Boolean   | false  |
| fade        | 文本溢出处理-淡出   | Boolean   | false  |
| ellipsis    | 文本溢出处理-省略号 | Boolean   | false  |
| visible     | 文本溢出处理-不截断 | Boolean   | false  |
