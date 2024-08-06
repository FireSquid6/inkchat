export function getAddressFromPathname(pathname: string): [string, string] | null {
  const split = pathname.split('/')
  let address = ""
  for (let i = 0; i < split.length; i++) {
    if (split[i] === 'server') {
      address = split.length > i + 1 ? split[i + 1] : ""
    }
  }

  if (address === "") {
    return null
  }

  const addressSplit = address.split('@')
  return addressSplit.length > 1 ? [addressSplit[0], addressSplit.slice(1).join('@')] : null
}
