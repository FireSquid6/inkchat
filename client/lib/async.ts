import { useEffect, useState } from "react"


export function useAsync<T>(fn: () => Promise<T>): AsyncStatus<T> {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<T | null>(null)

  useEffect(() => {
    // fuck react
    const fetchData = async () => {
      setLoading(true)
      const res = await fn()
      setState(res)
      setLoading(false)
    }
    fetchData()
  })

  return loading ? { loading: true, state: null } : { loading: false, state: state as T }
}


type AsyncStatus<T> = {
  loading: true,
  state: null,
} | {
  loading: false,
  state: T,
}
