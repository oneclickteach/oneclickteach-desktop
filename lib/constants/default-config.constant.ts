export const WINDOWS_CONFIG_DEFAULT = {
  width: 1400,
  height: 900,
  x: undefined,
  y: undefined,
  maximized: false,
}

export const LOCAL_CONFIG_DEFAULT = {
  name: 'en',
  flag: '🇺🇸',
  code: 'en',
  direction: 'ltr',
}

export const COMMON_CONFIG_DEFAULT = {
  local: LOCAL_CONFIG_DEFAULT,
  darkMode: 'dark',
}

export const SERVER_CONFIG_DEFAULT = {
  serverProviderType: 'vagrant',
  mizbanCloudApiKey: '',
  vagrant: {
    node: {
      box: 'generic/ubuntu2004',
      cpu: 2,
      memory: 2048,
      ip: '192.168.56.200',
    },
    ports: {
      api: 5000,
      web: 5001,
      database: 55432,
    },
  },
  inventory: {
    server: {
      host: '192.168.56.200',
      port: 22,
      user: 'vagrant',
      sshPrivateKeyFile: '',
    },
    redis: {
      externalPort: 56379,
      password: 'password',
    },
    postgresql: {
      externalPort: 55432,
      user: 'oneclickteach',
      password: 'password',
      db: 'oneclickteach',
    },
    api: {
      imageVersion: 'v0.1.6',
      host: 'http://localhost:5000',
      externalPort: 5000,
      secret: 'dB4EIz2AnNiIWzyO7murLhNU9nD3O5E5xTkzbfwSKKzMyMA3qJyEyDOZ19QwDmdclWbnLt7rvr8yaI2zrE0D9ruV61pL8sl5',
      logLevel: 'trace',
    },
    web: {
      imageVersion: 'v0.1.13',
      host: 'http://localhost:5001',
      externalPort: 5001,
    },
  },
}
