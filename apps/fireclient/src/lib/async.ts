import { useEffect, useState } from "react"

export function useAsync<T>(func: () => Promise<T | null>) {
  const [state, setState] = useState<T | null>(null)

  useEffect(() => {
    const f = async () => {
      setState(await func())
    }
    f()
  }, [func, setState])

  return state
}
