# sky-tab  选项卡

## 依赖组件(使用页面不需要引入，只需要确保以下组件的可用性)
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
      "sky-tab":"/miniprogram_npm/jieyue-ui-com/sky-tab/sky-tab",
    }
```

3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中-->
    <sky-tab title="选项卡样式" tabs="[item,item....]" tab-color="var(--err-l1)" select-color="var(--main-l0)" select-blod="true" select-type="line" select-bg="var(--suc-l1)" tab-current="3"  ></sky-tab>
  
```

## API
### 组件Props
| 参数         | 说明                               | 类型    | 默认值               |
| :---         | :---                               | :---    | :---                 |
| tabList      | 选项卡列表                         | Array   | [tabItem] 请参考以下tabItemProps 文档   |
| tabCurrent   | 选项卡选中项                       | Number  | 0                    |
| tabColor     | 选项标题未选中文本色               | String  | 'var(--text-l1)'     |
| selectColor  | 选项标题选中项文本色               | String  | 'var(--text-l0)'     |
| selectBlod   | 选项标题选中项文本是否加粗         | Boolean | false                |
| selectType   | 选中项样式，可选值 'line'底部横线/'box'盒式背景 | String | 'line'          |
| selectBg     | 选中项样式颜色                     | String  | 'var(--text-l1)'     |
| duration     | 选项卡变化过渡动画时间             | Number  | 150                  |

### tabItemProps
| 参数         | 说明            | 类型    | 默认值             |
| :---         | :---            | :---    | :---               |
| id          | 唯一id         | String|Number  | 必须含有此字段            |
| title          | 选项标题         | String  | ''            |
| logoNumber          | 选项卡数字标签       | Number  | 右上角徽标（0不显示,-1则显示点）           |
| logoColor          | 标签背景         | String | ''            |
| disabled          | 此项标签是否禁用         | Boolean | -            |
| iconName     | 图标名称         | String  | ''                 |
| iconImg      | 自定义图标图片url| String  | ''                 |
| iconSize     | 图标大小         | Number  | 36                 |
| iconColor    | 图标颜色         | String  | 'var(--text-l0)'   |

### 组件事件Events
| 方法名                   | 说明                              | 参数  |
| :---------------------- | :-------------------------------- | :--- |
| touchTab               | 切换选项卡                        | index #选中的选项下标   |
| endScroll             | 选项卡滚动结束  | -    |
