import { DarkMode, DirectionMode } from '../enums'

export interface WindowConfigInterface {
  width: number
  height: number
  x?: number
  y?: number
  maximized: boolean
}

export interface ServerConfigInterface {
  mizbanCloudApiKey: string
  host: string
  port: number
  user: string
  password: string
}

export interface LocalInterface {
  name: string
  flag: string
  code: string
  direction: DirectionMode
}

export interface CommonConfigInterface {
  local: LocalInterface
  darkMode: DarkMode
}
