import { useState } from "react"

export function AuthPage() {
  const [newAccount, setNewAccount] = useState(false)
  return (
    <div>
      <form className="my-8 mx-auto max-w-[36rem] flex flex-col p-2 bg-base-100 rounded-lg">
        <h1 className="text-2xl font-bold text-center m-4">Create a New Identity</h1>
        <Input label="Address" placeholder="chat.somewhere.org" id="address" />
        <Input label="Username" placeholder="someone" id="username" />
        <Input label="Password" placeholder="something secret" id="password" type="password" />
        <div className="flex flex-row m-4">
          <input type="checkbox" onChange={() => {
            setNewAccount(!newAccount)
          }} className="toggle ml-2" />
          <label htmlFor="toggle" className="ml-4">Create a New Account</label>
        </div>
        <div className={`${newAccount ? "scale-y-100" : "scale-y-0"} transition-all`}>
          <Input label="Joincode" placeholder="123456" id="joincode" />
        </div>
        <button className="btn btn-primary mx-auto m-4" type="button">Submit</button>
      </form>
    </div>
  )
}


type InputProps = {
  label: string
  placeholder: string
  id: string
  type?: string
}

function Input(props: InputProps) {
  return (
    <label className="input input-bordered flex items-center gap-2 m-4">
      {props.label}
      <input type={props.type ?? "text"} id={props.id} placeholder={props.placeholder} />
    </label>
  )
}
