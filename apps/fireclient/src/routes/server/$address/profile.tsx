import { connectionStore, currentUserStore } from "@/lib/store"
import { createFileRoute } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"

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


  if (connection === null || currentUser === null) {
    return <p>Not logged in</p>
  }

  return (
    <>
      <object type="image/png" data={connection.getAvatarUrl(currentUser.id)} width={480} height={480}>
        <p>Fallback image</p>
      </object>
    </>
  )
}
