export interface BlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flag?: boolean
  adjacentMines: number
}
