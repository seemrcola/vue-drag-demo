export enum CellStatus {
  ALIVE = 1,
  DEAD = 0,
}

export interface CellState {
  status: CellStatus
  x: number
  y: number
}
