# sky-icon  图标

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-icon":"/miniprogram_npm/jieyue-ui-com/sky-icon/sky-icon",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中 -->
      <sky-icon  icon-name="{{iconName}}" icon-img="{{iconImg}}" icon-size="{{iconSize}}" icon-color="{{iconColor}}"></sky-icon>

  <!--js -->
  Component({
    data: {
      iconName: '', // 图标名称
      iconImg: '', // 自定义图标图片url
      iconSize: 36, // 图标大小
      iconColor: 'var(--text-l0)' // 图标颜色
    },
  })
```


## API
### 组件Props
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| iconName     | 图标名称         | String  | ''                 |
| iconImg      | 自定义图标图片url| String  | ''                 |
| iconSize     | 图标大小         | Number  | 36                 |
| iconColor    | 图标颜色         | String  | 'var(--text-l0)'   |

