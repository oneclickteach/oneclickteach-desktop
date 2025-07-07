import { DarkMode, DirectionMode } from "../enums"

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
  local: LocalInterface,
  darkMode: DarkMode
}
