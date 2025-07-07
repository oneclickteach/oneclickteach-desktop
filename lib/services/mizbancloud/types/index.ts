export interface MizbanCloudConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  statusCode: number
  timestamp: string

  // Just Added for Server Get API Response
  // volume_created?: boolean
  // image_written?: boolean
  // instance_created?: boolean
  // interface_attached?: boolean
  // percent?: number
  // messages?: {
  //   [key: string]: string
  // }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface RequestOptions {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

export interface DataCenterMC {
  id: number
  code: number
  display_name: string
  city: string
  country: string
  has_sas: number
  sas_multi_create: number
  has_ssd: number
  ssd_multi_create: number
  has_nvme: number
  nvme_multi_create: number
  ip_count: number
  is_active: number
  is_hidden: number
  has_test: number
  provides_ipv6: number
  provides_ipv4: number
  os_reload_enabled: number
  rescue_enabled: number
  is_default: boolean
}

export interface OperatingSystemMC {
  id: number
  name: string
  display_name: string
  distro: string
  version: number
}

export interface InterfaceMC {
  id: number
  name: string
  mac_address: string
  mac_type: string
  ip_address: string
  ip_type: string
  is_private: number
}

export interface VolumeMC {
  id: number
  name: string
  display_name: string
  space: number
  type: string
  operating_system: string
  deleted_at: null | string
  operating_system_id: number
}

export interface ServerMC {
  id: number
  name: string
  display_name: string
  status: string
  ip_versions: string
  rescue_volume: null | number
  ssh_id: null | number
  default_password: null | string
  user_init_scripts: string
  is_test: boolean
  was_test: number
  is_paused: number
  ha_enabled: number
  cpu: number
  ram: number
  reload_count: number
  rescue_count: number
  created_at: string
  updated_at: string
  extra: string
  old_serial: null | string
  old_volume_id: null | number
  remote_request_id: null | string
  remote_request_data: null | string
  is_rescued: number
  delete_after_unrescue: number
  admin_suspend: number
  network_id: null | number
  volume: VolumeMC
  interfaces: InterfaceMC[]
  datacenter: DataCenterMC
  shamsi_created_at: string
  shamsi_updated_at: string
}
