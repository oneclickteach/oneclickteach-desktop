import { DarkMode } from "../enums"

export interface ServerConfigInterface {
  host: string
  port: number
  user: string
  password: string
}

export interface LocalInterface {
  name: string
  flag: string
  code: string
}

export interface CommonConfigInterface {
  local: LocalInterface,
  darkMode: DarkMode
}
