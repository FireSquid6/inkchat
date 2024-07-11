import { useState } from "react"

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


// whenever the client needs to connect, a signal is sent that is processed in the ConnectionState context


export function connect(address: string, token: string) {
  connectSignal.publish({ address, token })
}


export function usePubsub<T>(pubsub: Pubsub<T>, initial: T) {
  const [state, setState] = useState<T>(initial)

  pubsub.subscribe((data: T) => {
    setState(data)
  })


  return state
}
