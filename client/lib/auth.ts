import { getUrlForAddress } from "."


export async function signIn(username: string, password: string, address: string) {
  const url = getUrlForAddress(address)
  const response = await fetch(`${url}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
}


export function singUp(username: string, password: string, code: string, address: string) {

}

