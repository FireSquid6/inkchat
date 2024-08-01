import { useSyncExternalStore } from "react"
import { ObserverStore } from "./"

export function useStore<T>(store: ObserverStore<T>) {
  return useSyncExternalStore(store.observe, store.snapshot)
}
