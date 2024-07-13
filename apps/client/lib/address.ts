export function urlFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `http://${address}`
  }
  return `https://${address}`
}

export function socketFromAddress(address: string): string {
  if (address.startsWith("localhost")) {
    return `ws://${address}/socket`
  }
  return `wss://${address}/socket`
}
