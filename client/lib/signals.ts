type PubsubListener<T> = (data: T) => void
export class Pubsub<T> {
  private listeners: PubsubListener<T>[] = []

  subscribe(listener: PubsubListener<T>) {
    this.listeners.push(listener)
  }

  unsubscribe(listener: PubsubListener<T>) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  once(listener: (data: T) => void) {
    const callback = (data: T) => {
      listener(data)
      this.unsubscribe(callback)
    }
    this.subscribe(callback)
  }

  publish(data: T) {
    this.listeners.forEach((listener) => listener(data))
  }
}

export const connectSignal = new Pubsub<{ address: string, token: string }>()
export const disconnectSignal =  new Pubsub<undefined>()


export function connect(address: string, token: string) {
  connectSignal.publish({ address, token })
}

export function disconnect() {
  disconnectSignal.publish(undefined)
}
