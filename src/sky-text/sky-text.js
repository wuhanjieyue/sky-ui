// components/sky-text/sky-text.js
Component({

  /**
   * 组件的属性列表
   */
  properties:{
    // 文本内容
    content:{
      type:String,
      value:''
    },
    // 长按文字是否可选
    userSelect:{
        type:Boolean,
        value:false
    },
    // 最大行数
    maxLines:{
      type:Number,
      value:-1
    },
    /**
     * 文本溢出处理
     * clip	修剪文本
     * fade	淡出
     * ellipsis	显示省略号
     * visible	文本不截断
     */
    clip:{
      type:Boolean,
      value:false
    },
    fade:{
      type:Boolean,
      value:false
    },
    ellipsis:{
      type:Boolean,
      value:false
    },
    visible:{
      type:Boolean,
      value:false
    },
  },
  observers:{
    'clip, fade,ellipsis,visible ': function(clip, fade,ellipsis,visible) {
      let overflowTemp = ''
      if(clip){
        overflowTemp = 'clip'
      }
      if(fade){
        if(overflowTemp != ''){
            console.error("文字溢出处理有重复属性，请校对")
        }
        overflowTemp = 'fade'
      }
      if(ellipsis){
        if(overflowTemp != ''){
          console.error("文字溢出处理有重复属性，请校对")
      }
        overflowTemp = 'ellipsis'
      }
      if(visible){
        if(overflowTemp != ''){
          console.error("文字溢出处理有重复属性，请校对")
      }
        overflowTemp = 'visible'
      }
      this.setData({
        overflow: overflowTemp
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    overflow:'visible'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})