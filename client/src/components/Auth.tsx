import { useState } from "react"

export function AuthPage() {
  return (
    <>
      <h1>Sign into Server</h1>
      <div>
        <SignIn onSignIn={(email, password, address) => {
          console.log(email, password, address)
        }} />

      </div>
    </>
  )
}

interface SignInProps {
  onSignIn: (email: string, password: string, address: string) => void;
}

export function SignIn(props: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')


  return (
    <form>
      <input type="text" placeholder="email" value={email} onChange={e => setEmail((e.target as HTMLInputElement).value)} />
      <input type="password" placeholder="password" value={password} onChange={e => setPassword((e.target as HTMLInputElement).value)} />
      <input type="text" placeholder="address" value={address} onChange={e => setAddress((e.target as HTMLInputElement).value)} />
      <button type="button" onClick={() => props.onSignIn(email, password, address)}>Sign In</button>
    </form>
  )
}
