import { getUrlsFromAddress } from "#/pages/auth"
import { describe, expect, test } from "bun:test"


describe("getUrlsFromAddress", () => {
  test("uses localhost properly", () => {
    expect(getUrlsFromAddress("localhost:3000")).toEqual({
      url: "http://localhost:3000",
      wsUrl: "ws://localhost:3000/socket",
    })
  })
  test("uses https properly", () => {
    expect(getUrlsFromAddress("example.com")).toEqual({
      url: "https://example.com",
      wsUrl: "wss://example.com/socket",
    })
  })
});

