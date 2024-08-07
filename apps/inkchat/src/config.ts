import yaml from "yaml"
import fs from "fs"

export interface AppConfig {
  port?: number // the port to serve the app on. Default 3000
  storeDir?: string // the directory to store files and the database in. Default ./store
  maxMessages?: number // the maximum amount of messages a client can request at once. Default 200
  serverInformation?: ServerInformation // information on the server presented to the public
  doInitialization?: boolean // whether to create a default channel and joincode if no users or channels exist
  allowedOrigins?: string[] // a list of origins that are allowed to connect to the server. If empty, all origins are allowed
  redirectForDisallowed?: string // the URL to redirect to if the origin is not allowed. Defaults to the rickroll lol
}

export interface ServerInformation {
  name: string
  iconPath: string
}

export class Config {
  private givenConfig: AppConfig

  constructor(config: AppConfig) {
    this.givenConfig = config
  }

  port(): number {
    return this.givenConfig.port || 3000
  }

  storeDir(): string {
    return this.givenConfig.storeDir || "./store"
  }

  maxMessages(): number {
    return this.givenConfig.maxMessages || 200
  }

  serverInformation(): ServerInformation {
    return (
      this.givenConfig.serverInformation || {
        name: "A cool server",
        iconPath: ""
      }
    )
  }

  doInitialization(): boolean {
    return this.givenConfig.doInitialization ?? true
  }

  allowedOrigins(): string[] {
    return this.givenConfig.allowedOrigins || []
  }

  redirectForDisallowed(): string {
    return (
      this.givenConfig.redirectForDisallowed ||
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    )
  }
}

export function configFromFile(filepath: string): AppConfig {
  if (!fs.existsSync(filepath)) {
    return {}
  }

  const text = fs.readFileSync(filepath, "utf-8")
  const config: AppConfig = yaml.parse(text)

  return config
}
