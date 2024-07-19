export type Maybe<T> = { data: T, error: null } | { data: null, error: string }

export type SomeMaybeHandler<T, R> = (some: T) => R
export type NoneMaybeHandler<R> = (error: string) => R

export type AsyncMaybe<T> = Promise<Maybe<T>>

// handles a maybe of type T
export function handleMaybe<T, Return>(maybe: Maybe<T>, some: SomeMaybeHandler<T, Return>, none: NoneMaybeHandler<Return>) {
  if (maybe.data) {
    return some(maybe.data!)
  } else {
    return none(maybe.error!)
  }
}

export function Some<T>(value: T): Maybe<T> {
  return {
    data: value,
    error: null,
  }
}

export function None<T>(error: string): Maybe<T> {
  return {
    data: null,
    error: error,
  }
}

export function isSome<T>(maybe: Maybe<T>): maybe is { data: T, error: null } {
  return maybe.data !== null
}
export function isNone<T>(maybe: Maybe<T>): maybe is { data: null, error: string } {
  return maybe.data === null
}


export function unwrapOrDefault<T>(maybe: Maybe<T>, fallback: T): T {
  if (isSome(maybe)) {
    return maybe.data
  } else {
    return fallback
  }
}

export function unwrapOrThrow<T>(maybe: Maybe<T>): T {
  if (isSome(maybe)) {
    return maybe.data
  } else {
    throw new Error(maybe.error)
  }
}
