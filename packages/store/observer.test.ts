import { ObserverStore } from "./"
import { test, expect, mock } from "bun:test"


test("ObserverStore", () => {
  let seen = 0
  const store = new ObserverStore(0)
  const listener = mock((i: number) => {
    seen += 1
    expect(i).toBe(1)
  })

  store.observe(listener)
  store.observe(listener)

  store.mutate((i) => i + 1)
  expect(seen).toBe(2)
})
