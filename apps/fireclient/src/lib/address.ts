import { useLocation } from "@tanstack/react-router"

export function getAddressFromPathname(
  pathname: string
): [string, string] | [null, null] {
  const split = pathname.split("/")
  let address = ""
  for (let i = 0; i < split.length; i++) {
    if (split[i] === "server") {
      address = split.length > i + 1 ? split[i + 1] : ""
    }
  }

  if (address === "") {
    return [null, null]
  }

  const addressSplit = address.split("@")
  return addressSplit.length > 1
    ? [addressSplit[0], addressSplit.slice(1).join("@")]
    : [null, null] 
}


export function useAddress(): [string, string] | [null, null] {
  const pathname = useLocation().pathname
  return getAddressFromPathname(pathname) 
}
