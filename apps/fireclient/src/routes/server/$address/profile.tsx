import { connectionStore, currentUserStore } from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"
import { Input } from "@/components/auth-form"
import { ProfileCard } from "@/components/profile-card"

export const Route = createFileRoute("/server/$address/profile")({
  component: () => <Profile />
})


function Profile() {
  const currentUser = useStore(currentUserStore)
  const [connection] = useStore(connectionStore)

  if (currentUser === null || connection === null) {
    return <p>Not logged in</p>
  }

  // TODO - make getAvatarUrl not depend on the connection
  const avatarUrl = connection.getAvatarUrl(currentUser.id)

  return (
    <div className="m-4">
      <h1 className="text-4xl my-16 m-4">Profile</h1>
      <h2 className="text-3xl my-8 m-4">Profile Card</h2>
      <ProfileCard avatarUrl={avatarUrl} {...currentUser} />
      <ProfileEditor />
    </div>
  )
}


function ProfileEditor() {
  const [connection] = useStore(connectionStore)
  const currentUser = useStore(currentUserStore)
  const [username, setUsername] = useState(currentUser?.displayName ?? currentUser?.username ?? "")

  const onClick = () => {
    if (connection === null) {
      console.error("No code should be here at all. Grep for this text.")
      return
    }
  }

  return (
    <>
      <h2 className="text-3xl my-8 m-4">Update Profile</h2>
      <form className="flex flex-col">
        <div>
          <Input type="text" label="Display Name" value={username} onChange={setUsername} id="username" />
          <label htmlFor="avatar" className="flex flex-row align-middle m-4 p-1 input input-bordered h-auto">
            <span className="align-middle my-auto mx-3 font-bold">Avatar</span>
            <input type="file" id="avatar" className="file-input w-full max-w-xs" />
          </label>
          <button onClick={onClick} type="button" className="btn btn-primary m-4">Save</button>
        </div>
      </form>
    </>
  )
}


