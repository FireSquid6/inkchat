import { useEffect, useState } from "react"
import { None, isSome, type Maybe } from "@/maybe"

type UntilProps = {
  fallback: React.ReactNode,
  children: React.ReactNode,
  condition: boolean,
}

export function Until(props: UntilProps) {
  return props.condition ? <>{props.children}</> : <>{props.fallback}</>
}

type MaybeProps<T> = {
  value: Maybe<T>,
  some: (value: T) => React.ReactNode,
  none: (error: string) => React.ReactNode,
}
export function Maybe<T>(props: MaybeProps<T>) {
  if (isSome(props.value)) {
    return props.some(props.value.data)
  } else {
    return props.none(props.value.error)
  }
}

type AsyncFunction<T> = () => Promise<Maybe<T>>
export function useAsync<T>(fn: AsyncFunction<T>) {
  const [state, setState] = useState<Maybe<T>>(None("still loading"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await fn()
      setState(res)
      setLoading(false)

    }
    fetchData()
  }, [fn, setLoading, setState])


  return {
    state,
    loading,
  }

}
