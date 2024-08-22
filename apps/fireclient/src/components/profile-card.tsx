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
