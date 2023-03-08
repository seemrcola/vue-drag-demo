export enum CellStatus {
  V = '感染者', // 感染者
  D = '康复不易感', // 康复，不易感
  R = '易感者', // 易感者
}

// 感染者
export interface V {
  status: CellStatus.V
  x: number
  y: number
  days: 0 // 七天后恢复
}

// 不易感者
export interface D {
  status: CellStatus.D
  x: number
  y: number
  days: 0 // 不易感者的days暂时没有用
}

// 易感者
export interface R {
  status: CellStatus.R
  x: number
  y: number
  days: 0 // 接触过久会感染
}

export type Person = R | D | V
