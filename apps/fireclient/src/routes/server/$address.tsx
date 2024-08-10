import { getStoredSessions } from "@/lib/auth"
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router"
import { isNone } from "maybe"
import { connectionStore, connectTo } from "@/lib/store"
import { SidebarLayout } from "@/components/sidebar"
import { getAddressFromPathname } from "@/lib/address"

export const Route = createFileRoute("/server/$address")({
  beforeLoad: ({ location }) => {
    const [username, address] = getAddressFromPathname(location.pathname) 
    const maybe = getStoredSessions()

    if (isNone(maybe)) {
      throw redirect({
        to: "/auth",
        search: {
          address: address
        }
      })
    }

    const { data: sessions } = maybe

    const session = sessions.find(
      (session) => session.address === address && session.username === username
    )
    if (session === undefined) {
      throw redirect({
        to: "/auth",
        search: {
          address: address
        }
      })
    }

    const [connection] = connectionStore.state

    if (connection === null || connection.address !== address) {
      connectTo(session.address, session.token)
    }
  },
  component: () => {
    return (
      <SidebarLayout>
        <Outlet />
      </SidebarLayout>
    )
  }
})
