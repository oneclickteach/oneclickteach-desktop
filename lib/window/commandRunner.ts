import { spawn, exec, ChildProcess, SpawnOptions, ExecOptions } from 'child_process'
import * as path from 'path'
import * as os from 'os'

// Type definitions
interface CommandResult {
  command: string
  exitCode: number
  stdout: string
  stderr: string
  success: boolean
}

interface CommandOptions {
  cwd?: string
  timeout?: number
  shell?: boolean
  env?: Record<string, string>
  logOutput?: boolean
  stopOnError?: boolean
  onOutput?: (data: string, type: 'stdout' | 'stderr') => void
  onError?: (data: string, type: 'stderr') => void
}

interface CommandRunnerOptions {
  env?: Record<string, string>
}

interface SequenceResult {
  error?: string
  command: string
  result?: CommandResult
}

/**
 * Enhanced runCommand function for Electron applications
 * Supports streaming output, different execution modes, and proper error handling
 */
export class CommandRunner {
  private defaultOptions: Required<Pick<CommandOptions, 'cwd' | 'timeout' | 'shell'>> & {
    env: Record<string, string>
  }

  constructor(options: CommandRunnerOptions = {}) {
    this.defaultOptions = {
      cwd: process.cwd(),
      timeout: 30000, // 30 seconds default timeout
      shell: true,
      env: { ...process.env, ...options.env } as Record<string, string>,
    }
  }

  /**
   * Run a command with real-time output streaming
   */
  async runCommand(command: string, options: CommandOptions = {}): Promise<CommandResult> {
    const opts = { ...this.defaultOptions, ...options }

    return new Promise<CommandResult>((resolve, reject) => {
      const spawnOptions: SpawnOptions = {
        cwd: opts.cwd,
        shell: opts.shell,
        env: opts.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      }

      const child: ChildProcess = spawn(command, [], spawnOptions)

      let stdout = ''
      let stderr = ''
      let hasTimedOut = false

      // Set up timeout
      const timeoutId = setTimeout(() => {
        hasTimedOut = true
        child.kill('SIGTERM')
        reject(new Error(`Command timed out after ${opts.timeout}ms: ${command}`))
      }, opts.timeout)

      // Handle stdout
      child.stdout?.on('data', (data: Buffer) => {
        const output = data.toString()
        stdout += output

        // Real-time output callback
        if (options.onOutput) {
          options.onOutput(output, 'stdout')
        }

        // Log to console if enabled
        if (options.logOutput !== false) {
          process.stdout.write(output)
        }
      })

      // Handle stderr
      child.stderr?.on('data', (data: Buffer) => {
        const output = data.toString()
        stderr += output

        // Real-time error callback
        if (options.onError) {
          options.onError(output, 'stderr')
        }

        // Log to console if enabled
        if (options.logOutput !== false) {
          process.stderr.write(output)
        }
      })

      // Handle process completion
      child.on('close', (code: number | null) => {
        clearTimeout(timeoutId)

        if (hasTimedOut) return // Already handled by timeout

        const exitCode = code ?? -1
        const result: CommandResult = {
          command,
          exitCode,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          success: exitCode === 0,
        }

        if (exitCode === 0) {
          resolve(result)
        } else {
          const error = new Error(`Command failed with exit code ${exitCode}: ${command}`) as Error & {
            result: CommandResult
          }
          error.result = result
          reject(error)
        }
      })

      // Handle process errors
      child.on('error', (error: Error) => {
        clearTimeout(timeoutId)
        reject(new Error(`Failed to start command: ${error.message}`))
      })
    })
  }

  /**
   * Run a simple command and return the output
   */
  async runSimple(command: string, options: CommandOptions = {}): Promise<string> {
    const opts = { ...this.defaultOptions, ...options }

    return new Promise<string>((resolve, reject) => {
      const execOptions: ExecOptions = {
        cwd: opts.cwd,
        timeout: opts.timeout,
        env: opts.env,
      }

      exec(command, execOptions, (error, stdout, stderr) => {
        if (error) {
          const enhancedError = error as Error & { stdout: string; stderr: string }
          enhancedError.stdout = stdout
          enhancedError.stderr = stderr
          reject(enhancedError)
          return
        }
        resolve(stdout.trim())
      })
    })
  }

  /**
   * Change directory and run a command
   */
  async runInDirectory(directory: string, command: string, options: CommandOptions = {}): Promise<CommandResult> {
    const resolvedPath = path.resolve(directory)
    return this.runCommand(command, { ...options, cwd: resolvedPath })
  }

  /**
   * Run multiple commands in sequence
   */
  async runSequence(commands: string[], options: CommandOptions = {}): Promise<(CommandResult | SequenceResult)[]> {
    const results: (CommandResult | SequenceResult)[] = []

    for (const command of commands) {
      try {
        const result = await this.runCommand(command, options)
        results.push(result)
      } catch (error) {
        if (options.stopOnError !== false) {
          throw error
        }
        results.push({
          error: error instanceof Error ? error.message : String(error),
          command,
        })
      }
    }

    return results
  }

  /**
   * Check if a command exists
   */
  async commandExists(command: string): Promise<boolean> {
    const checkCommand = os.platform() === 'win32' ? `where ${command}` : `which ${command}`

    try {
      await this.runSimple(checkCommand)
      return true
    } catch (error) {
      return false
    }
  }
}

// Create a default instance
const runner = new CommandRunner()

// Convenience functions using default instance
export const runCommand = (command: string, options?: CommandOptions): Promise<CommandResult> =>
  runner.runCommand(command, options)

export const runSimple = (command: string, options?: CommandOptions): Promise<string> =>
  runner.runSimple(command, options)

export const runInDirectory = (directory: string, command: string, options?: CommandOptions): Promise<CommandResult> =>
  runner.runInDirectory(directory, command, options)

export const runSequence = (
  commands: string[],
  options?: CommandOptions
): Promise<(CommandResult | SequenceResult)[]> => runner.runSequence(commands, options)

export const commandExists = (command: string): Promise<boolean> => runner.commandExists(command)

// Example usage functions for your specific commands
export async function runAnsiblePlaybook(playbookPath: string, options: CommandOptions = {}): Promise<CommandResult> {
  const command = `ansible-playbook ${playbookPath}`
  return runner.runCommand(command, {
    timeout: 300000, // 5 minutes for ansible
    ...options,
  })
}

export async function runVagrantUp(options: CommandOptions = {}): Promise<CommandResult> {
  return runner.runCommand('vagrant up', {
    timeout: 600000, // 10 minutes for vagrant
    ...options,
  })
}

export async function runVagrantCommand(subcommand: string, options: CommandOptions = {}): Promise<CommandResult> {
  return runner.runCommand(`vagrant ${subcommand}`, {
    timeout: 300000, // 5 minutes default
    ...options,
  })
}

// Export types
export type { CommandResult, CommandOptions, CommandRunnerOptions, SequenceResult }

// Example usage:
/*
import { runCommand, runAnsiblePlaybook, runVagrantUp, runInDirectory, CommandResult } from './runCommand';
*/
