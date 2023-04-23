#### 拖拽闪烁的问题
如果尝试在两个元宝自动机模型中添加一些变化的量，比如把virus组件的template部分改成这样：
```html
<template>
  <div b>
    <div>{{ day }}</div>
    <canvas ref="canvas" height="400" width="400" />
  </div>
</template>
```
那就会发现在拖拽的时候，这个组件会闪烁，好像总是会渲染回之前的位置  
项目中的拖拽进画布和画布中的拖拽是不一样的，拖拽进画布是自己根据鼠标事件写的，画布中的拖拽是moveable  
自己的拖拽没有问题，但是moveable的就会有  

#### 猜测
moveable中是在`requetAnimationFrame`这个api中来修改的位置信息。我的`day`属性变化也是在这个api
去执行的，那就有一种可能，多个`requetAnimationFrame`的回调可能并没有在一个周期内执行。
也就是说我这个回调执行后，就直接渲染了还没有改变位置，下一次渲染前才会调用上一次位置改变的回调，这样位置就弹回去了。

### GPT的回答
如果我设置多了RequestFrameAnimation，执行顺序是怎么样的  
    
如果你设置了多个 requestAnimationFrame，它们会按照浏览器渲染引擎的刷新频率来执行。通常每秒会执行 60 次，因此如果你设置了多个 requestAnimationFrame，它们将按照以下顺序执行：

所有回调函数都被添加到回调队列中。
当浏览器下一次刷新时，它将按照它们被添加到队列中的顺序来执行回调函数。
如果回调函数执行的时间超过了渲染间隔，浏览器会跳过未执行的函数并将其推迟到下一帧。
因此，当你设置多个 requestAnimationFrame 时，每个回调函数的执行顺序取决于它们在队列中的添加顺序，以及它们执行的时间。建议不要设置过多的 requestAnimationFrame，以保持网页的性能和流畅度。  


目前猜测是这个可能。




