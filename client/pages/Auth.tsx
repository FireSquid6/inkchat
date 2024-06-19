import { TextInput, Button } from "../components/Forms";
import { client } from "../lib/client"

export function AuthPage(): JSX.Element {
  return (
    <>
      <h1>Sign into Server</h1>
      <div>
        <SignIn onSignIn={async (username, password, _) => {
          const connResult = await client.connect("http://localhost:3000", "ws://localhost:3000/socket")
          console.log(connResult)
          const signInResult = await client.signIn(username, password)
          console.log(signInResult)
        }} />

      </div>
    </>
  )
}

interface SignInProps {
  onSignIn: (username: string, password: string, address: string) => void;
}

export function SignIn(props: SignInProps): JSX.Element {
  return (
    <form>
      <input />
      <input />
      <input />
      <button onclick="props.onSignIn">
        Sign In
      </button>
    </form>
  )
}
