import { STORAGE_SERVER_CONFIG_KEY } from '@/lib/constants'
import { ServerConfigInterface } from '@/lib/interfaces'
import { Storage } from '@/lib/storage'
import { CommandResult, runCommand } from '@/lib/window/commandRunner'
import { renderFile } from 'ejs'
import { existsSync, mkdirSync } from 'fs'
import path, { join } from 'path'

export default class InfrastructureSetup {
  private readonly dirPath = './Setup/Infrastructure'
  private readonly templatePath = path.resolve('resources', 'templates', 'inventory.yml.ejs')
  private readonly sshPrivateKeyFile = path.resolve(this.dirPath, '..', 'Vagrant/.keys/id_rsa_vagrant')
  private context

  public async setup() {
    this.loadAndFixInventoryContext()
    this.ensureDirExists()
    await this.cloneInfrastructure()
    await this.createInventoryFile()
    await this.runAnsiblePlaybook()
  }

  // Read and fix the inventory context
  private async loadAndFixInventoryContext() {
    // Storage instance
    const storage = new Storage()

    const serverConfig: ServerConfigInterface = await storage.getItem(STORAGE_SERVER_CONFIG_KEY)
    if (serverConfig && serverConfig.inventory) {
      this.context = serverConfig.inventory

      // Save changes
      serverConfig.inventory.server.sshPrivateKeyFile = this.sshPrivateKeyFile
      await storage.setItem(STORAGE_SERVER_CONFIG_KEY, serverConfig)
    }
  }

  // Ensure directory exists
  private ensureDirExists() {
    if (!existsSync(this.dirPath)) {
      mkdirSync(this.dirPath, { recursive: true })
    }
  }

  // Clone Infrastructure
  private async cloneInfrastructure() {
    const privateKeyPath = join(this.dirPath, 'oneclickteach-infrastructure')

    if (existsSync(privateKeyPath)) {
      return 'Project already exists.'
    }

    const cmd = `git clone https://github.com/oneclickteach/oneclickteach-infrastructure.git`
    const { stdout }: CommandResult = await runCommand(cmd, { cwd: this.dirPath })
    return stdout
  }

  // Create Inventory File
  private async createInventoryFile() {
    const content = await renderFile(this.templatePath, this.context)

    const cwd = `${this.dirPath}/oneclickteach-infrastructure`
    const cmd = `
cat << 'EOF' > inventory.yml
${content}
EOF
  `.trim()

    const { stdout }: CommandResult = await runCommand(cmd, { cwd })
    return stdout
  }

  // Run Ansible Playbook
  private async runAnsiblePlaybook() {
    const cwd = `${this.dirPath}/oneclickteach-infrastructure`
    const cmd = `ansible-playbook -i inventory.yml playbooks/site.yml`
    const { stdout }: CommandResult = await runCommand(cmd, { cwd, timeout: 20 * 60 * 1000 })
    return stdout
  }
}
