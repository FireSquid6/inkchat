import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { getAddressFromPathname } from "@/lib/address"

export const Route = createFileRoute('/server/$address/')({
  beforeLoad: ({ location }) => {
    const [username, address] = getAddressFromPathname(location.pathname) ?? [null, null]

    if (username === null || address === null) {
      throw redirect({
        to: '/auth',
        search: {
          address
        }
      })
    }

    throw redirect({
      to: `/server/${username}@${address}/about`
    })

  }
})
