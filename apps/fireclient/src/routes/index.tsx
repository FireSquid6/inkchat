import { removeSession, revalidateSessions, useSessions } from "@/lib/auth"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FaPlus, FaTrash } from "react-icons/fa"
import { useState } from "react"

export const Route = createFileRoute("/")({
  component: Index
})

function Index() {
  const sessions = useSessions()
  const [deleting, setDeleting] = useState(false)
  const connections = sessions.map((session, i) => {
    let errMessage = undefined

    if (!session.found) {
      errMessage = "Server not found. Is it online?"
    } else if (!session.valid) {
      errMessage =
        "Session is invalid. You probably want to delete this session and create a new one."
    }

    return (
      <Connection
        key={i}
        deleting={deleting}
        disabled={!session.valid || !session.found}
        errMessage={errMessage}
        onDelete={() => {
          removeSession(session)
        }}
        to={`/server/${session.username}@${session.address}`}
        text={`${session.username}@${session.address}`}
      />
    )
  })

  connections.push(
    <Connection key="new" className="btn-primary" to="/auth">
      <FaPlus /> New Connection
    </Connection>
  )

  return (
    <main className="m-2 flex flex-col">
      <h1 className="text-4xl text-center mb-16 mt-32">Welcome back!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
        {connections}
      </div>
      <div className="flex flex-col mt-32 mx-auto border p-4 rounded-lg border-text">
        <label className="label cursor-pointer mb-4">
          <span className="label-text text-lg mr-4">
            Manange Saved Connections
          </span>
          <input
            type="checkbox"
            onChange={(e) => {
              setDeleting(e.target.checked)
            }}
            className="toggle toggle-primary"
          />
        </label>
        <RevalidateButton />
      </div>
    </main>
  )
}

function RevalidateButton() {
  const [revalidating, setRevalidating] = useState(false)
  const onClick = async () => {
    setRevalidating(true)
    await revalidateSessions()
    setRevalidating(false)
  }

  return (
    <button disabled={revalidating} onClick={onClick} className="btn mx-auto">
      Refresh Sessions
    </button>
  )
}

type ConnectionProps = {
  to: string
  deleting?: boolean
  text?: string
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  errMessage?: string
  onDelete?: () => void
}

function Connection(props: ConnectionProps) {
  const max_length = 30

  let text = props.text
  if (props.text && props.text.length > max_length) {
    text = props.text.substring(0, max_length - 3) + "..."
  }

  return (
    <div className="indicator tooltip mx-auto" data-tip={props.errMessage}>
      <button
        onClick={props.onDelete}
        className={`${props.deleting ? "" : "opacity-0"} indicator-item badge badge-error lighter-hover`}
      >
        <FaTrash />
      </button>
      <Link
        disabled={props.disabled ?? false}
        className={`btn w-64 ${props.disabled ? "btn-disabled" : ""} ${props.deleting ? "animate-shake" : ""} ${props.className}`}
        to={props.to}
      >
        {props.text ? <p>{text}</p> : null}
        {props.children}
      </Link>
    </div>
  )
}
