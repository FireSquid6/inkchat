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

  if (currentUser === null) {
    return <p>Not logged in</p>
  }

  return (
    <div className="m-4">
      <h1 className="text-4xl my-16 m-4">Profile</h1>
      <h2 className="text-3xl my-8 m-4">Profile Card</h2>
      <ProfileCard />
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
      console.error("Shouldn't be here at all. Grep for this text.")
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

function FallbackImage({ username }: { username: string }) {
  return (
    <div className="bg-green-700 w-full h-full flex items-center justify-center rounded-full">
      <p className="text-4xl text-white">{username[0]}</p>
    </div>
  )
}
