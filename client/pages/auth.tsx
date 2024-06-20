import Html from "@kitajs/html"
import { Button, TextInput } from "#/components/form"
import { setPage } from "#/lib/ui"
import { client, ok } from "#/lib/client"


export function setAuthPage() {
  setPage(Auth())

  setupSignInForm()
  setupSignUpForm()
}


function Auth() {
  return (
    <main>
      <div class="bg-base-200 p-4 m-4 rounded-xl">
        <h1 class="text-3xl text-center font-bold m-4">Add New Server</h1>
        <AuthForm />
      </div>

    </main>
  )
}

function AuthForm() {
  return (
    <form id="authform">
      <div class="bg-base-300 p-4 my-4 rounded-xl">
        <TextInput id="username" label="Username" placeholder="your username" />
        <TextInput id="password" type="password" label="Password" placeholder="your password" />
        <TextInput id="address" label="Address" placeholder="chat.example.com" />
      </div>
      <div class="flex flex-col w-full border-opacity-50">
        <div class="grid h-20 card bg-base-300 rounded-box place-items-center">
          <Button type="button" class="btn-primary w-[90%]" id="signinbutton">Sign Into Existing Account</Button>
        </div>
        <div class="divider">OR</div>
        <div class="grid h-20 card bg-base-300 rounded-box place-items-center">
          <div class="flex flex-row w-[90%]">
            <TextInput class="w-[40%] mx-0" id="code" label="Code" placeholder="Your signup code" />
            <Button type="button" class="btn-secondary w-[60%]" id="signupbutton">Create New Account</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function setupSignInForm() {
  const signInButton = document.getElementById('signinbutton')
  signInButton?.addEventListener('click', async () => {
    // TODO: input validation
    const form = document.getElementById('authform')
    const username = (form?.querySelector('#username') as HTMLInputElement).value
    const password = (form?.querySelector('#password') as HTMLInputElement).value
    const address = (form?.querySelector('#address') as HTMLInputElement).value

    const { url, wsUrl } = getUrlsFromAddress(address)

    const connectStatus = await client.connect(url, wsUrl)

    if (connectStatus !== ok) {
      console.error('Failed to connect to server:', connectStatus)
      return
    }

    const authStatus = await client.signIn(username, password)
    if (authStatus !== ok) {
      console.error('Failed to sign in: ', authStatus)
      return
    }
  })

  const signUpButton = document.getElementById('signupbutton')
  signUpButton?.addEventListener('click', async () => {
    const form = document.getElementById('authform')
    const username = (form?.querySelector('#username') as HTMLInputElement).value
    const password = (form?.querySelector('#password') as HTMLInputElement).value
    const address = (form?.querySelector('#address') as HTMLInputElement).value
    const code = (form?.querySelector('#code') as HTMLInputElement).value

    // TODO: connect and create account on server

  })
}

function setupSignUpForm() {

}


export function getUrlsFromAddress(address: string): { url: string, wsUrl: string } {
  let http = "https://"
  let ws = "wss://"

  if (address.startsWith('localhost')) {
    http = "http://"
    ws = "ws://"
  }

  return {
    url: `${http}${address}`,
    wsUrl: `${ws}${address}/socket`
  }
}


