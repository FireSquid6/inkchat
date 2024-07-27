import { getStoredSessions } from '@/lib/auth'
import { createFileRoute, Link } from '@tanstack/react-router'
import { unwrapOrDefault } from 'maybe'
import { FaPlus } from "react-icons/fa"


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const sessions = unwrapOrDefault(getStoredSessions(), [])
  const connections = sessions.map((session, i) => {
    return (
      <Connection key={i} to={`/server/${session.address}`} text={session.address} />
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
    </main>
  )
}


type ConnectionProps = {
  to: string
  text?: string
  children?: React.ReactNode
  className?: string
}

function Connection(props: ConnectionProps) {
  const max_length = 30

  let text = props.text
  if (props.text && props.text.length > max_length) {
    text = props.text.substring(0, max_length - 3) + '...'
  }

  return (
    <Link className={`btn ${props.className}`} to={props.to}>
      {
        props.text ? <p>{text}</p> : null
      }
      {props.children}
    </Link>
  )
}
