import { Store } from "@tanstack/store"
import { useEffect, useState } from "react"


// when something fails, we can store that message here
const errorsStore = new Store<Map<string, string>>(new Map())


// adds an error messsage to the store
// returns the key where it is stored. that error can later be "resolved" by removing it from the store
export function pushError(message: string): string {
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
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    return errorsStore.subscribe(() => {
      setErrors(errorsStore.state)
    })
  }, [setErrors])

  return errors

}
