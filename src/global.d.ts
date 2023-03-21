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

