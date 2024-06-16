export interface AppConfig {
  port?: number
  storeDir?: string
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
}
