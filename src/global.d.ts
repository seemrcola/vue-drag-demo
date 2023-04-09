interface FnKeyboard {
    ctrl: boolean
    shift: boolean
    meta: boolean
    space: boolean
}

declare interface Window {
    // 键盘按键记录
    $KeyboardActive: FnKeyboard
    // 编辑 JSON 的存储对象
    opener: any,
    // drag操作图片居中带来的clientX偏移补丁 mac
    $fixClientX: number,
    // drag操作图片居中带来的clientY偏移补丁 mac
    $fixClientY: number
    // os
    $OS: 'WINDOWS'|'MAC'
}

  // *******************************************************************
  // ** !!这里做个解释 [这是貌似是一个mac专属bug] $fixClientX $fixClientY
  // ** 当drag操作自定义拖动图片，并且改变了dataTransfer!.setDragImage(img, x, y)
  // ** 此时当drag操作结束时，dragend获取clientX喝clientY都会受到这个x和y的影响
  // ** 把dragend绑定在document上就不会有这个问题
  // ** 但是dragend绑定在和dragstart一样的元素上时就会造成clientX和clientY的偏移
  // ** fix: 但是为了记录这个操作，我决定在window上加个属性来打补丁，以提醒自己这个知识点。
  //* ******************************************************************
