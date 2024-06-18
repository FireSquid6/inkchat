export interface AppConfig {
  port?: number  // the port to serve the app on. Default 3000
  storeDir?: string  // the directory to store files and the database in. Default ./store
  maxMessages?: number  // the maximum amount of messages a client can request at once. Default 200
  serverInformation?: ServerInformation  // information on the server presented to the public
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
    return this.givenConfig.serverInformation || {
      name: "A cool server",
      iconPath: ""
    }
  }
}
