import { CommandResult, runCommand } from '@/lib/window/commandRunner'
import { existsSync, mkdirSync } from 'fs'
import { renderFile } from 'ejs'
import path from 'path'
import { STORAGE_SERVER_CONFIG_KEY } from '@/lib/constants'
import { Storage } from '@/lib/storage'
import { ServerConfigInterface } from '@/lib/interfaces'

export default class VagrantSetup {
  private readonly dirPath = './Setup/Vagrant'
  private readonly templatePath = path.resolve('resources', 'templates', 'Vagrantfile.ejs')
  private context

  public async setup() {
    await this.readServerContext()
    this.ensureDirExists()
    await this.createVagrantFile()
    await this.vagrantUpOrReload()
  }

  // Read server context
  private async readServerContext() {
    // Storage instance
    const storage = new Storage()

    const serverConfig: ServerConfigInterface = await storage.getItem(STORAGE_SERVER_CONFIG_KEY)
    if (serverConfig && serverConfig.vagrant) {
      this.context = serverConfig.vagrant
    }
  }

  // Ensure directory exists
  private ensureDirExists() {
    if (!existsSync(this.dirPath)) {
      mkdirSync(this.dirPath, { recursive: true })
    }
  }

  // Create Vagrant File
  private async createVagrantFile() {
    const content = await renderFile(this.templatePath, this.context)

    const cwd = `${this.dirPath}`
    const cmd = `
cat << 'EOF' > Vagrantfile
${content}
EOF
  `.trim()

    const { stdout }: CommandResult = await runCommand(cmd, { cwd })
    return stdout
  }

  // Vagrant status checking
  private async getVagrantStatus(): Promise<'running' | 'poweroff' | 'not_created' | 'saved' | 'unknown'> {
    const { stdout } = await runCommand('vagrant status', { cwd: this.dirPath })
    if (/running/.test(stdout)) return 'running'
    if (/poweroff/.test(stdout)) return 'poweroff'
    if (/not created/.test(stdout)) return 'not_created'
    if (/saved/.test(stdout)) return 'saved'
    return 'unknown'
  }

  // Vagrant UP
  private async vagrantUp() {
    const cmd = `vagrant up`
    const { stdout }: CommandResult = await runCommand(cmd, { cwd: this.dirPath, timeout: 5 * 60 * 1000 })
    return stdout
  }

  // Vagrant Up or Reload
  private async vagrantUpOrReload() {
    const status = await this.getVagrantStatus()
    let cmd = 'vagrant up'

    if (status === 'running') {
      cmd = 'vagrant reload'
    }

    const { stdout }: CommandResult = await runCommand(cmd, {
      cwd: this.dirPath,
      timeout: 5 * 60 * 1000,
    })

    return stdout
  }
}
