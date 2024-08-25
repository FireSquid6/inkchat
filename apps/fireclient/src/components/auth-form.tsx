import { useState } from "react"
import { type Failable, Err } from "maybe"
import { sdk } from "api"
import { storeSession } from "@/lib/auth"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"

export type AuthFormProps = {
  address?: string
  joincode?: string
}

export function AuthForm(props: AuthFormProps) {
  const [newAccount, setNewAccount] = useState(props.address !== undefined && props.joincode !== undefined)
  const navigate = useNavigate()
  const [error, setError] = useState<string>("")
  const form = useForm({
    defaultValues: {
      address: props.address ?? "",
      joincode: props.joincode ?? "",
      username: "",
      password: "",
    },
    // TODO - make this code not awful
    onSubmit: async ({ value: { joincode, username, password, address } }) => {
      let res: Failable<string> = Err("Not done yet")

      if (newAccount) {
        res = await sdk.signUp(address, username, password, joincode)
      } else {
        res = await sdk.signIn(address, username, password)
      }

      const [token, error] = res

      if (token !== null) {
        setError("")
        // TODO - check if there is already a session and ask the user if they want to overwrite it
        storeSession({
          token: token,
          address: address,
          username: username,
          found: true,
          valid: true
        })
        navigate({ to: `/server/${username}@${address}` })
      } else {
        setError(error)
      }
    }
  })

  return (
    <form className="my-8 mx-auto max-w-[36rem] flex flex-col p-2 bg-base-100 rounded-lg" onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}>
      <form.Field name="address" children={(field) => (
        <Input
          id="address"
          label="Address"
          placeholder="chat.somewhere.com"
          value={field.state.value}
          onChange={field.handleChange}
        />
      )} />
      <form.Field name="username" children={(field) => (
        <Input
          id="username"
          label="Username"
          placeholder="someone"
          value={field.state.value}
          onChange={field.handleChange}
        />
      )} />
      <form.Field name="password" children={(field) => (
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="something secret"
          value={field.state.value}
          onChange={field.handleChange}
        />
      )} />

      <div className="flex flex-row m-4">
        <input
          type="checkbox"
          onChange={() => {
            setNewAccount(!newAccount)
          }}
          className="toggle ml-2"
          value="toggle"
          checked={newAccount}
        />
        <label htmlFor="toggle" className="ml-4">
          Create a New Account
        </label>
      </div>
      <form.Field name="joincode" children={(field) => (
        <Input
          id="joincode"
          disabled={!newAccount}
          label="Joincode"
          placeholder="123456"
          value={field.state.value}
          onChange={field.handleChange}
        />
      )} />
      <p className="text-red-500 text-center">{error}</p>
      <button
        className="btn btn-primary mx-auto m-4"
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}

type InputProps = {
  label: string
  placeholder?: string
  id: string
  value?: string
  onChange?: (value: string) => void
  type?: string
  className?: string
  disabled?: boolean
  accpet?: string
}

export function Input(props: InputProps) {
  return (
    <label
      className={`input input-bordered flex items-center gap-2 m-4 ${props.className}`}
    >
      <span className="font-bold">{props.label}</span>
      <input
        type={props.type ?? "text"}
        accept={props.accpet}
        disabled={props.disabled ?? false}
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e.target.value)
          }
        }}
      />
    </label>
  )
}
