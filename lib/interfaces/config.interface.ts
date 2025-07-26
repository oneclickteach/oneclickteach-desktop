import { DarkMode, DirectionMode, ServerProviderType } from '../enums'

export interface WindowConfigInterface {
  width: number
  height: number
  x?: number
  y?: number
  maximized: boolean
}

export interface VagrantConfigInterface {
  node: {
    box: string
    cpu: number
    memory: number
    ip: string
  }
  ports: {
    api: number
    web: number
    database: number
  }
}

export interface InventoryConfigInterface {
  server: {
    host: string
    port: number
    user: string
    sshPrivateKeyFile: string
    password: string
  }
  redis: {
    externalPort: number
    password: string
  }
  postgresql: {
    externalPort: number
    user: string
    password: string
    db: string
  }
  api: {
    imageVersion: string
    host: string
    externalPort: number
    secret: string
    logLevel: string
  }
  web: {
    imageVersion: string
    host: string
    externalPort: number
  }
}

export interface ServerConfigInterface {
  serverProviderType: ServerProviderType
  mizbanCloudApiKey: string
  vagrant: VagrantConfigInterface
  inventory: InventoryConfigInterface
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
