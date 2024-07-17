import { getStoredSessions } from '@/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { isNone } from 'maybe'

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

    if (sessions.find((session) => session.address === address) === undefined) {
      throw redirect({
        to: "/auth",
        search: {
          address: address
        },
      })
    }

  },
  component: () => <div>Hello /server/$address!</div>
})

function getAddressFromPathname(pathname: string): string | undefined {
  const split = pathname.split('/')
  for (let i = 0; i < split.length; i++) {
    if (split[i] === 'server') {
      return split.length > i + 1 ? split[i + 1] : undefined
    }
  }
}
