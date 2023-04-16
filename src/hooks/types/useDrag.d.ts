export interface Options {
  needShift: boolean
}

export interface DragState {
  isDragging: boolean
  clientX: number
  clientY: number
}

export interface DertaState {
  isChanged: boolean
  dertaX: number
  dertaY: number
}

export interface UseDragResult {
  handleMouseDown: (event: MouseEvent) => void
  handleMouseMove: (event: MouseEvent) => boolean
  handleMouseUp: (event: MouseEvent) => void
  getDerta: () => DertaState
  getPoint: () => DragState
}
