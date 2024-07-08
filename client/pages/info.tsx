import { ErrorPage } from "@client/error"
import { useConnection, type ConnectionState } from "@client/lib/context"


export async function InfoPage() {
  const connection = useConnection()


  if (connection.active) {
    return (
      <>
        <div>Connection is active!</div>
        <ServerInfo connection={connection} />
      </>

    )
  }
  return (
    <ErrorPage />
  )

}


type ServerInfoProps = {
  connection: ConnectionState
}

async function ServerInfo(props: ServerInfoProps) {
  const res = await props.connection.api?.index.get()
  const [info, setInfo] = useState<ServerInfo | null>(null)

  if (res === undefined) {
    return (
      <p>Something went wrong...</p>
    )
  }


  if (info === null) {
    return (
      <p>Something went wrong...</p>
    )
  }

  return (
    <div>
      <h1>Server Information</h1>
      <p>Name: {info.name}</p>
    </div>

  )

}
