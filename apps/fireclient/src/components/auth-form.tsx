import { useCallback, useState } from "react"
import { None, isSome, type Maybe } from "maybe"
import { sdk } from "api"
import { storeSession } from "@/lib/auth"
import { useNavigate } from "@tanstack/react-router"

type AuthFormProps = {
  signup?: boolean
  address?: string
  joincode?: string
}

export function AuthForm(props: AuthFormProps) {
  // TODO - change this to using tanstack form
  const [newAccount, setNewAccount] = useState(props.signup ?? false)
  const [address, setAddress] = useState(props.address ?? "")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [joincode, setJoincode] = useState(props.joincode ?? "")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  // TODO - make this not the worst code ever
  // TODO - do proper validation here to make sure the user is inputting the right stuff
  const handleSubmit = useCallback(async () => {
    let res: Maybe<string> = None("Not done yet")

    if (newAccount) {
      res = await sdk.signUp(address, username, password, joincode)
    } else {
      res = await sdk.signIn(address, username, password)
    }

    if (isSome(res)) {
      setError("")
      storeSession({
        token: res.data,
        address: address,
        username: username,
        found: true,
        valid: true,
      })
      navigate({ to: `/server/${address}` })
    } else {
      setError(res.error)
    }
  }, [address, username, password, joincode, newAccount, setError])

  return (
      <form className="my-8 mx-auto max-w-[36rem] flex flex-col p-2 bg-base-100 rounded-lg">
        <Input label="Address" value={address} onChange={setAddress} placeholder="chat.somewhere.org" id="address" />
        <Input label="Username" value={username} onChange={setUsername} placeholder="someone" id="username" />
        <Input label="Password" placeholder="something secret" value={password} onChange={setPassword} id="password" type="password" />
        <div className="flex flex-row m-4">
          <input type="checkbox" onChange={() => {
            setNewAccount(!newAccount)
          }} className="toggle ml-2" />
          <label htmlFor="toggle" className="ml-4">Create a New Account</label>
        </div>
        <Input label="Joincode" placeholder="123456" id="joincode" onChange={setJoincode} value={joincode} disabled={!newAccount} />
        <p className="text-red-500 text-center">{error}</p>
        <button className="btn btn-primary mx-auto m-4" onClick={handleSubmit
        } type="button">Submit</button>
      </form>
  )
}


type InputProps = {
  label: string
  placeholder: string
  id: string
  value?: string
  onChange?: (value: string) => void
  type?: string
  className?: string
  disabled?: boolean
}

function Input(props: InputProps) {
  return (
    <label className={`input input-bordered flex items-center gap-2 m-4 ${props.className}`}>
      {props.label}
      <input type={props.type ?? "text"} disabled={props.disabled ?? false} id={props.id} placeholder={props.placeholder} value={props.value} onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value)
        }
      }} />
    </label>
  )
}
