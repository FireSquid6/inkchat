import { removeSession, useSessions } from '@/lib/auth'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FaPlus, FaTrash } from "react-icons/fa"
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const sessions = useSessions()
  const [deleting, setDeleting] = useState(false)
  const connections = sessions.map((session, i) => {
    return (
      <Connection key={i} deleting={deleting} onDelete={() => {
        removeSession(session)
      }} to={`/server/${session.address}`} text={session.address} />
    )
  })

  connections.push(
    <Connection key="new" className="btn-primary" to="/auth">
      <FaPlus /> New Connection
    </Connection>
  )

  return (
    <main className="m-2 flex flex-col">
      <h1 className="text-4xl text-center mb-16 mt-64">Welcome back!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
        {connections}
      </div>
      <div className="flex flex-col mt-32 mx-auto border p-4 rounded-lg border-text">
        <label className="label cursor-pointer mb-4">
          <span className="label-text text-lg mr-4">Manange Saved Connections</span>
          <input type="checkbox" onChange={(e) => {
            setDeleting(e.target.checked)
          }} className="toggle toggle-primary" />
        </label>
        <button className="btn mx-auto">Revalidate Sessions</button>
      </div>
    </main>
  )
}


type ConnectionProps = {
  to: string
  deleting?: boolean
  text?: string
  children?: React.ReactNode
  className?: string
  onDelete?: () => void
}

function Connection(props: ConnectionProps) {
  const max_length = 30

  let text = props.text
  if (props.text && props.text.length > max_length) {
    text = props.text.substring(0, max_length - 3) + '...'
  }

  return (
    <div className="indicator">
      <button onClick={props.onDelete} className={`${props.deleting ? "" : "opacity-0"} indicator-item badge badge-error lighter-hover`}>
        <FaTrash />
      </button>
      <Link className={`btn ${props.deleting ? "animate-shake" : ""} ${props.className}`} to={props.to}>
        {
          props.text ? <p>{text}</p> : null
        }
        {props.children}
      </Link>
    </div>
  )
}
