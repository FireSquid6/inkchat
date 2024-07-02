export function getSocketUrlForAddress(address: string) {
  if (address.startsWith("localhost")) return `ws://${address}/socket`
  return `wss://${address}/socket`
}

export function getUrlForAddress(address: string) {
  if (address.startsWith("localhost")) return `http://${address}`
  return `https://${address}`
}
