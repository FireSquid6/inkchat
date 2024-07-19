import { getStoredSessions } from '@/lib/auth'
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { isNone } from 'maybe'
import { connectionStore, connectTo } from "@/lib/store"
import { SidebarLayout } from '@/components/sidebar'

export const Route = createFileRoute('/server/$address')({
  beforeLoad: ({ location }) => {
    const address = getAddressFromPathname(location.pathname)
    const maybe = getStoredSessions()

    if (isNone(maybe)) {
      throw redirect({
        to: "/auth",
        search: {
          address: address
        },
      })
    }

    const { data: sessions } = maybe

    const session = sessions.find((session) => session.address === address)
    if (session === undefined) {
      throw redirect({
        to: "/auth",
        search: {
          address: address
        },
      })
    }

    const connectionMaybe = connectionStore.state

    if (isNone(connectionMaybe) || connectionMaybe.data.address !== address) {
      connectTo(session.address, session.token)
    }

  },
  component: () => {
    return (
      <SidebarLayout>
        <Outlet />
      </SidebarLayout>
    )
  }})

function getAddressFromPathname(pathname: string): string | undefined {
  const split = pathname.split('/')
  for (let i = 0; i < split.length; i++) {
    if (split[i] === 'server') {
      return split.length > i + 1 ? split[i + 1] : undefined
    }
  }
}
