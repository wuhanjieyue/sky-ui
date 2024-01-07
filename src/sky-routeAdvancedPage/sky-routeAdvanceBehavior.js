// my-behavior.js
const {
  runOnJS
} = wx.worklet
export default Behavior({
  behaviors: [],
  
  properties: {
    scrollY:{
      type:Boolean,
      value:false
    },
    scrollX:{
      type:Boolean,
      value:false
    },
    upperThreshold:{
      type: Number,
      optionalTypes:[String],
      value:50
    },
    lowerThreshold:{
      type: Number,
      optionalTypes:[String],
      value:50
    },
    scrollTop:{
      type: Number,
      optionalTypes:[String],
    },
    scrollLeft:{
      type: Number,
      optionalTypes:[String],
    },
    scrollIntoView:{
      type: String,
      observer:'_scrollIntoViewChanged',
      value:'startnode'
    },
    scrollWithAnimation:{
      type:Boolean,
      value:false
    },
    enableBackToTop:{
      type:Boolean,
      value:false
    },
    enablePassive:{
      type:Boolean,
      value:false
    },
    refresherEnabled:{
      type:Boolean,
      value:false
    },
    refreshertThreshold:{
      type:Number,
      value:45
    },
    refresherDefaultStyle:{
      type:String,
      value:'black'
    },
    refresherBackground:{
      type:String,
      value:'#FFF'
    },
    refresherTriggered:{
      type:Boolean,
      value:false
    },
    bounces:{
      type:Boolean,
      value:true
    },
    showScrollbar:{
      type:Boolean,
      value:true
    },
    fastDeceleration:{
      type:Boolean,
      value:false
    },
    type:{
      type:String,
      value:'list'
    },
    
    reverse:{
      type:Boolean,
      value:false
    },
    clip:{
      type:Boolean,
      value:true
    },
    cacheExtent:{
      type:Number
    },
    minDragDistance:{
      type:Number,
      value:18
    },
    scrollIntoViewWithinExtent:{
      type:Boolean,
      value:false
    },
    scrollIntoViewOffset:{
      type:Number,
      value:0
    },
    scrollIntoViewAlignment:{
      type:String,
      value:'start'
    },
    padding:{
      type:Array,
      value:[0, 0, 0, 0]
    },
    refresherTwoLevelEnabled:{
      type:Boolean,
      value:false
    },
    refresherTwoLevelTriggered:{
      type:Boolean,
      value:false
    },
    refresherTwoLevelThreshold:{
      type:Number,
      value:150
    },
    refresherTwoLevelCloseThreshold:{
      type:Number,
      value:80
    },
    refresherTwoLevelScrollEnabled:{
      type:Boolean,
      value:false
    },
    refresherBallisticRefreshEnabled:{
      type:Boolean,
      value:false
    },
    refresherTwoLevelPinned:{
      type:Boolean,
      value:false
    },
    gridType:{
      type:String,
      value:'aligned'
    },
    crossAxisCount:{
      type:Number,
      value:2
    },
    maxCrossAxisExtent:{
      type:Number,
      value:0
    },
    mainAxisGap:{
      type:Number,
      value:0
    },
    crossAxisGap:{
      type:Number,
      value:0
    },
    gridPadding:{
      type:Array,
      value:[0, 0, 0, 0]
    },
    listPadding:{
      type:Array,
      value:[0, 0, 0, 0]
    },
  },
  
  methods: {
    tapmask(){
      this.triggerEvent('tapmask', {}, {})
    },
    _dragstart (e) {
      this.triggerEvent('dragstart', e, {})
    },
    _dragging(e){
      this.triggerEvent('dragging', e, {})
    },
    _dragend(e){
      this.triggerEvent('dragend', e, {})
    },
    _scrolltoupper(e){
      this.triggerEvent('scrolltoupper', e, {})
    },
    _scrolltolower(e){
      this.triggerEvent('scrolltolower', e, {})
    },
    _scroll(e){
      this.triggerEvent('scroll', e, {})
    },
    _refresherpulling(e){
      this.triggerEvent('refresherpulling', e, {})
      
    },
    _refresherrefresh(e){
      this.triggerEvent('refresherrefresh', e, {})
    },
    _refresherrestore(e){
      this.triggerEvent('refresherrestore', e, {})
    },
    _refresherabort(e){
      this.triggerEvent('refresherabort', e, {})
      
    },
    _refresherwillrefresh(e){
      this.triggerEvent('refresherwillrefresh', e, {})

    },
    _onscrollstart(e){
      'worklet';
      runOnJS(this.js_onscrollstart.bind(this))(e)
    },
    js_onscrollstart(e){
      this.triggerEvent('onscrollstart', e, {})
    },
    _onscrollupdate(e){
      'worklet';
      this.scrollTop.value = e.detail.scrollTop;
      runOnJS(this.js_onscrollupdate.bind(this))(e)
    },
    js_onscrollupdate(e){
      this.triggerEvent('onscrollupdate', e, {})
    },
    _adjustDecelerationVelocity(velocity) {
      'worklet';
      const scrollTop = this.scrollTop.value;
      return scrollTop <= 0 ? 0 : velocity;
    },
    js_adjustDecelerationVelocity(e){
      this.triggerEvent('adjustDecelerationVelocity', e, {})
    },
    _onscrollend(e){
      'worklet';
      runOnJS(this.js_onscrollend.bind(this))(e)
    },
    js_onscrollend(e){
      this.triggerEvent('onscrollupdate', e, {})
    },
    _refresherstatuschange(e){
      this.triggerEvent('refresherstatuschange', e, {})
    },
    
  }
})