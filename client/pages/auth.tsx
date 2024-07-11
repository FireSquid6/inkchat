import { useCallback, useState } from "react"
import { None, isSome, type Maybe } from "@/maybe"
import { signIn, signUp, storeSession } from "@client/lib/auth"
import { connect } from "@client/lib/signals"
import { useNavigate } from "react-router-dom"

export function AuthPage() {
  const [newAccount, setNewAccount] = useState(false)
  const [address, setAddress] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [joincode, setJoincode] = useState("")
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()
  const handleSubmit = useCallback(async () => {
    let res: Maybe<string> = None("Not done yet")
    
    if (newAccount) {
      res = await signUp(address, username, password, joincode)
    } else {
      res = await signIn(address, username, password)
    }

    if (isSome(res)) {
      setError("")
      storeSession({
        token: res.data,
        address: address,
      })
      navigate(`/${address}`) 
    } else {
      setError(res.error)
    }
  }, [address, username, password, joincode, newAccount, setError])

  return (
    <div>
      <form className="my-8 mx-auto max-w-[36rem] flex flex-col p-2 bg-base-100 rounded-lg">
        <h1 className="text-2xl font-bold text-center m-4">Register a New or Existing Identity</h1>
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
      <p>TODO: list all sessions here and allow the user to delete them</p>
    </div>
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
