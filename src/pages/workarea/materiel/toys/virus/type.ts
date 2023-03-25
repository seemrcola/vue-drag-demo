export enum CellStatus {
  V = '感染者', // 感染者
  D = '康复者', // 康复不易感
  R = '易感者', // 易感者
}

// 感染者
export interface V {
  status: CellStatus.V
  x: number
  y: number
  days: number
  v: number // 感染次数
}

// 不易感者
export interface D {
  status: CellStatus.D
  x: number
  y: number
  days: number
  v: number // 感染次数
}

// 易感者
export interface R {
  status: CellStatus.R
  x: number
  y: number
  days: number
  v: number // 感染次数
}

export type Person = R | D | V
