declare interface Window {
    // 键盘按键记录
    $KeyboardActive?: { [T: string]: boolean }
    // 编辑 JSON 的存储对象
    opener: any,
    // drag操作图片居中带来的clientX偏移补丁
    $fixClientX: number,
    // drag操作图片居中带来的clientY偏移补丁
    $fixClientY: number
}

