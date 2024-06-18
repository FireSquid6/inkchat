import { TextInput, Button } from "../components/Forms";
import { useState } from "react"

export function AuthPage() {
  return (
    <>
      <h1>Sign into Server</h1>
      <div>
        <SignIn onSignIn={(username, password, address) => {
          console.log(username, password, address)
        }} />

      </div>
    </>
  )
}

interface SignInProps {
  onSignIn: (username: string, password: string, address: string) => void;
}

export function SignIn(props: SignInProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')


  return (
    <form>
      <TextInput label="Username" value={username} onChange={(value) => setUsername(value)} />
      <TextInput label="Password" type="password" value={password} onChange={(value) => setPassword(value)} />
      <TextInput label="Server URL" value={address} onChange={(value) => setAddress(value)} />
      <Button onClick={() => {
        props.onSignIn(username, password, address)
      }}>

      </Button>
    </form>
  )
}
