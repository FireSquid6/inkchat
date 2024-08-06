import { getAddressFromPathname } from "../src/lib/address"
import { test, expect } from "bun:test"



test("getAddressFromPathname", () => {
  expect(getAddressFromPathname("/")).toBe(null)
  expect(getAddressFromPathname("/server/firesquid@localhost:3000")).toEqual(["firesquid", "localhost:3000"])
  expect(getAddressFromPathname("/server/firesquid@somewhere-else.com")).toEqual(["firesquid", "somewhere-else.com"])
})
