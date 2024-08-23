import { connectionStore, currentUserStore } from "@/lib/store"
import { useStore } from "@tanstack/react-store"


export function ProfileCard() {
  const currentUser = useStore(currentUserStore)
  const [connection] = useStore(connectionStore)



  if (connection === null || currentUser === null) {
    return <p>Not logged in</p>
  }

  return (
    <>

      <div className="m-4 p-4 bg-base-100">
      <object type="image/png" data={connection.getAvatarUrl(currentUser.id)} width={120} height={120}>
        <FallbackImage username={currentUser.username} />
      </object>
      </div>
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
