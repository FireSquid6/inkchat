import { connectionStore, currentUserStore } from '@/lib/store'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

export const Route = createFileRoute('/server/$address/admin')({
  component: () => <p>Hello!</p>
})


function Admin() {
  const { data: connection } = useStore(connectionStore)
  const user = useStore(currentUserStore)

  if (connection === null || user === null) {
    console.log(connection)
    console.log(user)
    return <p>Not logged in</p>
  }

  if (!user.isAdmin) {
    return <p>Not an admin</p>
  }


  return (
    <div>
      <p>Hello world!</p>

    </div>
  )

}
