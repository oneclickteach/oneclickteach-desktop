import { ApiResponse, ServerMC } from '../types'
import { HttpClient } from '../utils/http'
import { BaseService } from './BaseService'

export class ServerService extends BaseService {
  constructor(client: HttpClient) {
    super(client, '/cloud')
  }

  async listServers(): Promise<ApiResponse<ServerMC[]>> {
    return this.client.get<ServerMC[]>(this.buildPath('/servers'))
  }

  async getServer(serverId: number): Promise<ApiResponse<ServerMC>> {
    return this.client.get<ServerMC>(this.buildPath(`/servers/${serverId}`))
  }

  async createServer(server: ServerMC): Promise<ApiResponse<ServerMC>> {
    return this.client.post<ServerMC>(this.buildPath('/servers'), server)
  }

  async deleteServer(serverId: number): Promise<ApiResponse<void>> {
    return this.client.delete<void>(this.buildPath(`/servers/${serverId}`))
  }
}
