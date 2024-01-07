# sky-layout 布局

## 依赖组件
无

## 使用方法
1. 安装组件，参见组件包根目录下 readme.md 说明
2. 使用页面引入组件
```
    "usingComponents": {
      "sky-layout":"/miniprogram_npm/jieyue-ui-com/sky-layout/sky-layout"
    }
```
3. 页面中使用,例如下：
```
  <!--wxml 引用组件的页面中  直接在引用组件中使用slot 可用属性是index和item-->
  <sky-layout list="{{dataList}}" key="id" line-count="{{3}}">
        <view slot="layitem{{index}}"  slot:index slot:item    bind:tap="tapItem" data-class="{{item}}" >
            <view style="height: 160rpx;line-height:160rpx;width: 100%;text-align: center;" >
              {{item}}
            </view>
        </view>
    </sky-layout>

  <!--js-->
  const getList = (num) => {
  const ans = []
  for (let i = 0; i < num; i++) {
      ans.push({
        id: i
      })
    }
    return ans
  }
  Component({
    data: {
      dataList:getList(30),
    }
  })
```

## API
### 组件Props
| 参数       | 说明                   | 类型    | 默认值 |
| :---       | :---                   | :---    | :---   |
| list       | layout组件中的列表数据 | Array   | []     |
| Key        | 数据for循环的"wx:key"值 | String|Number  | "index"|
| lineCount  | 布局每行的item个数,可选范围 2-8     | Number  | 3      |

## slot节点
### 、layout组件中列表数据的item项， 可用程度：基本可用
```
    <slot  name="layitem{{index}}" index="{{ index }}" item="{{ item }}"></slot>
```

