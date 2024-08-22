import { connectionStore, currentUserStore } from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { useState } from "react"
import { Input } from "@/components/auth-form"

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
      <ProfileCard />
    </div>
  )
}


function ProfileCard() {
  const currentUser = useStore(currentUserStore)
  const [connection] = useStore(connectionStore)
  const [username, setUsername] = useState(currentUser?.username || "")


  if (connection === null || currentUser === null) {
    return <p>Not logged in</p>
  }

  return (
    <>
      <object type="image/png" data={connection.getAvatarUrl(currentUser.id)} width={480} height={480}>
        <FallbackImage username={currentUser.username} />
      </object>
      <form className="flex flex-col">
        <h2 className="text-3xl my-8">Update Profile</h2>
        <div>
          <Input type="text" label="Username" value={username} onChange={setUsername} id="username" />

          <label htmlFor="avatar" className="flex flex-col m-4 p-1 border border-neutral-600 ">
            <span>Avatar</span>
            <input type="file" id="avatar" className="file-input w-full max-w-xs" />
          </label>
        </div>
      </form>
    </>
  )
}

function ProfileEditor() {

}

function FallbackImage({ username }: { username: string }) {
  return (
    <div className="bg-green-700 w-48 h-48 flex items-center justify-center rounded-full">
      <p className="text-4xl text-white">{username[0]}</p>
    </div>
  )
}
