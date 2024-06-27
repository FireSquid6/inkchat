import { getDb } from "./db";
import { getAuth } from "./db/auth";
import { app } from "./api";
import { Config, type AppConfig } from "@/config";


// this kit is in the context for every api request
// it contains the database, auth, logger, etc.
export interface Kit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: Config 
}

export function startApp(appConfig: AppConfig, db: ReturnType<typeof getDb>): Kit {
  const config = new Config(appConfig)
  const auth = getAuth(db)

  const kit: Kit = {
    db,
    auth,
    config,
  }

  app.store.kit = kit


  app.listen(config.port(), () => {
    console.log(`🚀 Server launched at ${config.port()}`)
  })
  return kit
}

// the maybe type wraps a values that may or may not exist. It's used lots of times when a function could fail 
export type Maybe<T> = { data: T, error: null } | { data: null, error: string }

export type SomeMaybeHandler<T, R> = (some: T) => R
export type NoneMaybeHandler<R> = (error: string) => R


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

export type App = typeof app;
