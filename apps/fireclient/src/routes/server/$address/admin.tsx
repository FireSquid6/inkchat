import { connectionStore, currentUserStore, channelStore, useConnectionState } from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { ChannelRow } from "api"
import { useCallback, useRef, useState } from "react"
import { FaCopy, FaTrash, FaPen } from "react-icons/fa"

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
      <ChannelEditor />
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


function ChannelEditor() {
  const channels = useStore(channelStore)
  const [connection] = useStore(connectionStore)
  const [focusedChannel, setFocusedChannel] = useState<ChannelRow | null>(null)
  const deleteModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)

  if (connection === null) {
    return <p>No connection</p>
  }

  const onDelete = useCallback((channel: ChannelRow) => {
    setFocusedChannel(channel)
    deleteModalRef.current?.showModal()
  }, [connection, setFocusedChannel])
  const onEdit = useCallback((channel: ChannelRow) => {
    setFocusedChannel(channel)
    editModalRef.current?.showModal()
  }, [connection, setFocusedChannel])

  const deleteChannel = useCallback(() => {
    deleteModalRef.current?.close()
    if (focusedChannel === null) {
      console.error("No channel to delete")
      return
    }
    connection.deleteChannel(focusedChannel.id)
  }, [connection, focusedChannel])

  return (
    <>
      <h1 className="my-16 m-4 text-4xl">Modify Channels</h1>
      <div className="flex flex-col">
        {
          channels.map((channel) => (
            <Channel key={channel.id} channel={channel} onEdit={onEdit} onDelete={onDelete} />
          ))
        }
      </div>
      <ChannelCreator />
      <dialog id="delete-modal" ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h2 className="font-bold text-lg">
            Are you sure you want to delete the channel "{focusedChannel?.name}"
          </h2>
          <div className="flex flex-row modal-action">
            <button className="btn mr-4" onClick={() => deleteModalRef.current?.close()}>
              No
            </button>
            <button className="btn btn-error" onClick={deleteChannel}>
              Yes
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="edit-modal" className="modal" ref={editModalRef}>
        <div className="modal-box">
          <h2 className="font-bold text-lg">Under construction!</h2>
          <div className="modal-action">
            <button className="btn">Ok</button>
          </div>
        </div>
      </dialog>
    </>
  )
}

type ChannelProps = {
  channel: ChannelRow
  onDelete?: (channel: ChannelRow) => void
  onEdit?: (channel: ChannelRow) => void
}
function Channel(props: ChannelProps) {
  // TODO - shorten channel name
  // TODO - drag and drop channels to sort position
  return (
    <div className="flex flex-row m-2 p-2 rounded-lg bg-base-200 w-full">
      <p className="text-lg font-bold w-full my-auto ml-4">{props.channel.name}</p>
      <button className="btn btn-info mx-1" onClick={() => props.onEdit?.(props.channel)}>
        <FaPen />
      </button>
      <button className="btn btn-error mx-1" onClick={() => props.onDelete?.(props.channel)}>
        <FaTrash />
      </button>
    </div>
  )
}


function ChannelCreator() {
  const [channelName, setChannelName] = useState<string>("")
  const [connection] = useStore(connectionStore)

  const onClick = () => {
    if (channelName === "") {
      return
    }

    // TODO - check if name is already taken
    // TODO - validate channel name

    connection?.createChannel(channelName, "")
  }

  return (
    <div className="flex flex-row">
      <input value={channelName} onChange={(e) => setChannelName(e.target.value)} type="text" placeholder="Enter channel name..." className="input input-bordered w-full mr-4" />
      <button className="btn" onClick={onClick}>Create Channel</button>
    </div>
  )
}
