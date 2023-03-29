export interface ShowData {
  x: number
  y: number
  rotate: number
  scale: [number, number]
  height: number
  width: number
  [propname: string]: any
}

export interface DeltaData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
}
