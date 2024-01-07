# sky-divider  分割线

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
该组件依赖 sky-icon与sky-text 组件，使用前请确保以下组件的存在
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
    "sky-divider":"/miniprogram_npm/jieyue-ui-com/sky-divider/sky-divider"
    }
```
3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中  直接在引用组件中使用slot 可用属性是index和item-->
      <sky-divider   title="{{title}}" loading load-color="{{loadColor}}" text-color="{{textColor}}" line-color="{{lineColor}}" breachShow line-breach-color="{{lineBreachColor}}"></sky-divider>

  <!--js-->
  Component({
    data: {
        lineColor:'var(--err-l0)',        #切割线颜色
        loading:true,                     #加载状态
        loadColor:'var(--main-l0)',       #加载状态颜色
        title:'你等得不耐烦了吗',          #切割线文字
        textColor:'var(--suc-l0)',        #切割线文字颜色
        breachShow:true,                  #左右隐藏耳是否显示
        lineBreachColor:'var(--suc-l0)'   #隐藏耳颜色
    }
  })
```

## API
### 组件Props
| 参数              | 说明                 | 类型      | 默认值             |
| :---              | :---                 | :---      | :---               |
| lineColor         | 切割线颜色           | String    | colorTemp          |
| loading           | 加载状态             | Boolean   | false              |
| loadColor         | 加载状态颜色         | String    | 'var(--text-l1)'   |
| title             | 切割线文字           | String    | ''                 |
| textColor         | 切割线文字颜色       | String    | 'var(--text-l1)'   |
| breachShow        | 左右隐藏耳是否显示   | Boolean   | false              |
| lineBreachColor   | 左右隐藏耳颜色       | String    | colorTemp          |


