import { useStore } from "@tanstack/react-store"
import { Store } from "@tanstack/store"


// when something fails, we can store that message here
const errorsStore = new Store<Map<string, string>>(new Map())


// adds an error messsage to the store
// returns the key where it is stored. that error can later be "resolved" by removing it from the store
export function pushError(message: string): string {
  console.error(message) // we also print the error to the console to make debugging easier
  const key = Math.random().toString()
  errorsStore.setState((state) => {
    const newState = new Map(state)
    newState.set(key, message)
    return newState
  })

  return key
}


export function clearErrors() {
  errorsStore.setState(() => new Map())
}


export function resolveError(key: string) {
  errorsStore.setState((state) => {
    const newState = new Map(state)
    newState.delete(key)
    return newState
  })
}


export function useErrors() {
  const errors = useStore(errorsStore)
  return errors.values()
}