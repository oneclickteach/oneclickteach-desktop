import { ApiResponse, DataCenterMC, OperatingSystemMC } from '../types'
import { HttpClient } from '../utils/http'
import { BaseService } from './BaseService'

export class StaticService extends BaseService {
  constructor(client: HttpClient) {
    super(client, '/static')
  }

  async listDataCenters(): Promise<ApiResponse<DataCenterMC[]>> {
    return this.client.get<DataCenterMC[]>(this.buildPath('/datacenters'))
  }

  async listOperatingSystems(): Promise<ApiResponse<OperatingSystemMC[]>> {
    return this.client.get<OperatingSystemMC[]>(this.buildPath('/os-list'))
  }
}
