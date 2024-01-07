# sky-indexBar  索引页

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
无

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
  <!-- 页面json -->
  "usingComponents": {    
      "sky-indexBar":"/miniprogram_npm/jieyue-ui-com/sky-indexBar/sky-indexBar",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中 -->
      <sky-indexBar list="{{list}}" dir-top="{{36}}" bind:selectItem="selectItem">
      </sky-indexBar>
  <!--js -->
```


## API
### 组件Props
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| list     | 索引数据列表，列表结构名称请参考以下barItemProps         | Array  | [barItem]                 |
| dirTop      | 右侧索引栏距离顶部位置| Number  | 0                 |


### barItemProps
{percent:0.8, color:'var(--warn-l1)'}
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| alpha        | 索引项名称      | String  | -           |
| subItems         | 当前索引项下列表       | Array  | [{name:'test01'},{name:'test02'}]         |


### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| selectItem             | 点击单项回调函数                        | name:选中项名称 ,index:父项index下标 ，subIndex:子项当前下标   |
