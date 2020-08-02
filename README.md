# 尺子组件预览

![aYShJP.png](https://s1.ax1x.com/2020/08/02/aYShJP.png)

# 把组件接入页面json文件

```json
{
  "usingComponents": {
  	"scale": "/components/wx-scale/wx-scale"        
  }
}
```

# 页面中使用

```html
//wxml
<view class="tallBox">
  <view class="tallTxt2">{{value}}</view>
  <view class='wrap'>
    <scale min="30" max="300" int="{{true}}" step="1" single="10" h="60" active="{{val}}" styles="{{styles[1]}}" bindvalue="bindvalue"></scale>
  </view>
</view>



//wxss
.wrap {
  width: 90%;
  margin: 30rpx auto;
}
.tallBox {
  width: auto;
  height: 300rpx;
  text-align: center;
}
.tallTxt2 {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 50rpx;
  color: #5d52c3;
  font-weight: 600;
}
```

# 参数说明

```
min="{{Number}}"	尺子最小刻度
max="{{Number}}"	尺子最大刻度
int="{{Booble}}"	上方数字是否显示整数
step="{{1 || 2 || 5}}"	每个格子代表的距离
single="{{Number}}"		尺子底部数字之间的距离
h="{{Number}}"			尺子高度
active="{{Number}}"		进入默认选择的数值,不可超过或小于最大最小刻度
styles="{{styles[1]}}"	在组件js文件中的properties进行定义尺子样式
bindvalue="{{function}}"每次滑动后尺子的回调数据function(e){value = e.detail.value}
```





# 日历组件预览



![aYAEHU.png](https://s1.ax1x.com/2020/08/02/aYAEHU.png)

# 把组件接入页面json文件

```json
{
  "usingComponents": {
    "calendar": "/components/calendar/calendar"
  }
}
```

#  页面中使用

```html
//wxml
 <calendar 
 	bindselect="bindselect" 
 	bind:get="GetToady" 
 />
```

# 参数说明

```
bindselect="{{Function}}"	打开关闭日历的回调函数funciton(e){value = e.detail.ischeck}
bind:ge="{{Function}}"		点击确定后的回调函数function(e){value = e.detail}
```





# 点击选择评分组件预览

![aY14MD.png](https://s1.ax1x.com/2020/08/02/aY14MD.png)

# 把组件接入页面json文件

```json
{
  "usingComponents": {
    "start": "/components/start/start"
  }
}
```

#  页面中使用

```wxml
<start start="4" stateList="{{stateList}}" bind:get="getStart"></start>
```

# 参数说明

```
start="{{Number}}"		初始化分数

stateList="{{Array}}"	每颗星星对应的评分,需在js文件中进行绑定,如 stateList: ['非常差', '差', '一般', '好', '非常好']

bind:get="{{Function}}"	点击星星对应的回调函数,function(e){e.detai = {start: 5, state: "非常好"}}
```

