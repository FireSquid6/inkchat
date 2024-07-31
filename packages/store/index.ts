
export type Observer<T> = (state: T) => void
export class ObserverStore<T> {
  private state: T
  private listeners: Observer<T>[] = []

  constructor(initialState: T) {
    this.state = initialState
  }

  snapshot(): T {
    return this.state
  }

  observe(observer: Observer<T>): () => void {
    const unsubscribe = () => {
      this.listeners = this.listeners.filter((listener) => listener !== observer)
    }

    this.listeners.push(observer)
    return unsubscribe
  }

  trigger(observer: Observer<T>) {
    const unsubscribe = this.observe((state) => {
      observer(state)
      unsubscribe()
    })
  }

  mutate(mutator: (state: T) => T) {
    this.state = mutator(this.state)

    for (const listener of this.listeners) {
      listener(this.state)
    }
  }
}
