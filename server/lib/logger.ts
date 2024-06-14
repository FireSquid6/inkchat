import type { AppConfig } from ".."

// the appConfig will be used later at some point
export function makeLoggerManager(_: AppConfig) {
  const loggerManager = new LoggerManager()
  loggerManager.addLogger(consoleLogger)
  return loggerManager
}

export class LoggerManager {
  loggers: Logger[] = []

  addLogger(logger: Logger) {
    this.loggers.push(logger)
  }

  log(message: string) {
    for (const logger of this.loggers) {
      logger.log(message)
    }
  }

  error(message: string) {
    for (const logger of this.loggers) {
      logger.error(message)
    }
  }
}


export interface Logger {
  name: string
  log(message: string): void
  error(message: string): void
}


export const consoleLogger: Logger = {
  name: "console",
  log(message: string) {
    console.log(message)
  },
  error(message: string) {
    console.error(message)
  },
}
