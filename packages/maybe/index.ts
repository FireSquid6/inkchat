

export type Failable<T> = [T, string] | [null, string]

export function Ok<T>(data: T): Failable<T> {
  return [data, ""]
}

export function Err<T>(error: string): Failable<T> {
  return [null, error]
}

export function isOk<T>(result: Failable<T>): result is [T, string] {
  return (result[0] === null)
}

export function isErr<T>(result: Failable<T>): result is [null, string] {
  return (result[0] === null)
}

export function unwrap<T>(result: Failable<T>): T {
  if (isOk(result)) {
    return result[0]
  } else {
    throw new Error(result[1])
  }
}

export function unwrapOr<T>(result: Failable<T>, fallback: T): T {
  if (isOk(result)) {
    return result[0]
  } else {
    return fallback
  }
}


// mabye is a legacy type. It shouldn't be used anymroe
// @deprecated
export type Maybe<T> = { data: T; error: null } | { data: null; error: string }

export type SomeMaybeHandler<T, R> = (some: T) => R
export type NoneMaybeHandler<R> = (error: string) => R

export type AsyncMaybe<T> = Promise<Maybe<T>>

// handles a maybe of type T
// @deprecated
export function handleMaybe<T, Return>(
  maybe: Maybe<T>,
  some: SomeMaybeHandler<T, Return>,
  none: NoneMaybeHandler<Return>
) {
  if (maybe.data) {
    return some(maybe.data!)
  } else {
    return none(maybe.error!)
  }
}

// @deprecated
export function Some<T>(value: T): Maybe<T> {
  return {
    data: value,
    error: null
  }
}

// @deprecated
export function None<T>(error: string): Maybe<T> {
  return {
    data: null,
    error: error
  }
}

// @deprecated
export function isSome<T>(maybe: Maybe<T>): maybe is { data: T; error: null } {
  return maybe.data !== null
}

// @deprecated
export function isNone<T>(
  maybe: Maybe<T>
): maybe is { data: null; error: string } {
  return maybe.data === null
}

// @deprecated
export function unwrapOrDefault<T>(maybe: Maybe<T>, fallback: T): T {
  if (isSome(maybe)) {
    return maybe.data
  } else {
    return fallback
  }
}

// @deprecated
export function unwrapOrThrow<T>(maybe: Maybe<T>): T {
  if (isSome(maybe)) {
    return maybe.data
  } else {
    throw new Error(maybe.error)
  }
}

// @deprecated
export function isSomeUnwrapped<T>(
  data: T | null,
  error: string | null
): data is T {
  return data !== null
}
