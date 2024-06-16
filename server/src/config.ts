export interface AppConfig {
  port?: number  // the port to serve the app on. Default 3000
  storeDir?: string  // the directory to store files and the database in. Default ./store
  maxMessages?: number  // the maximum amount of messages a client can request at once. Default 200
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
}
