import { ErrorPage } from "@client/error"
import { useConnection, type ConnectionState } from "@client/lib/context"
import { useCallback } from "react"
import { useAsync, Until } from "@client/lib/async"
import { None, Some, type Maybe } from "@/maybe"
import type { ServerInformation } from "@/config"


export function InfoPage() {
  const connection = useConnection()
  const getInfo = useCallback(async (): Promise<Maybe<ServerInformation>> => {
    const res = await connection.api?.index.get()

    if (!res) {
      return None("No response")
    }

    if (!res.data) {
      return None("No data")
    }

    if (res.status !== 200) {
      return None("bad response")
    }

    return Some(res.data.info)

  }, [])
  const { state: { data: info }, loading
  } = useAsync(getInfo)

  if (connection.active) {
    return (
      <Until condition={!loading} fallback={
        <div>Loading server info...</div>
      }>
        <div>
          {info?.name}
          
        </div>
      </Until>

    )
  }
  return (
    <ErrorPage />
  )

}


type ServerInfoProps = {
  connection: ConnectionState
}

// async function ServerInfo(props: ServerInfoProps) {
//   const res = await props.connection.api?.index.get()
//   const [info, setInfo] = useState<ServerInfo | null>(null)
//
//   if (res === undefined) {
//     return (
//       <p>Something went wrong...</p>
//     )
//   }
//
//
//   if (info === null) {
//     return (
//       <p>Something went wrong...</p>
//     )
//   }
//
//   return (
//     <div>
//       <h1>Server Information</h1>
//       <p>Name: {info.name}</p>
//     </div>
//
//   )
//
// }
