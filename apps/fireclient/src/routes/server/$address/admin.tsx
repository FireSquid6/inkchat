import { connectionStore, currentUserStore, channelStore } from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { ChannelRow } from "api"
import { useCallback, useRef, useState } from "react"
import { FaCopy } from "react-icons/fa"

export const Route = createFileRoute("/server/$address/admin")({
  component: () => <Admin />
})

function Admin() {
  const user = useStore(currentUserStore)

  if (user === null) {
    return <p>Not logged in</p>
  }

  if (!user.isAdmin) {
    return <p>Not an admin</p>
  }

  return (
    <div className="m-4">
      <JoincodeGenerator />
    </div>
  )
}

function JoincodeGenerator() {
  const [connection] = useStore(connectionStore)
  const [joincode, setJoincode] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [disabled, setDisabled] = useState<boolean>(false)
  const modalRef = useRef<HTMLDialogElement>(null)

  const onClick = async () => {
    setDisabled(true)
    const [joincode, error] = await connection?.makeJoincode() ?? [null, "No connection"]

    if (joincode === undefined) {
      console.error("Failed to make joincode")
      return
    }

    setJoincode(joincode ?? "")
    setError(error)
    setDisabled(false)

    modalRef.current?.showModal()
  }

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(joincode)
  }, [joincode])

  return (
    <>
      <div className="tooltip" data-tip="users need this to join">
        <button className="btn" disabled={disabled} onClick={onClick}>
          Generate Joincode
        </button>
      </div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">New Joincode</h3>
          <div className="flex flex-row my-8">
            <p className="text-3xl my-auto mr-6">{joincode}</p>
            <button className="btn rounded-full" onClick={onCopy}>
              <FaCopy />
            </button>
          </div>

          <p>Copy and send this to whoever needs to join. One time use.</p>
          <p className="text-error">{error}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" type="submit">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}


function ChannelCreator() {
  const channels = useStore(channelStore)
  const [connection] = useStore(connectionStore)

  const onDelete = useCallback((channel: ChannelRow) => {
    connection?.sendMessage

  }, [connection])


  return (
    <div>

    </div>
  )
}

type ChannelProps = {
  channel: ChannelRow
  onDelete?: (channel: ChannelRow) => void
}
function Channel(props: ChannelProps) {
  const [editing, setEditing] = useState<boolean>(false)
  const [channelName, setChannelName] = useState<string>(props.channel.name)

  return (
    <div className="flex flex-row">
      <input className="" />

    </div>
  )

}
