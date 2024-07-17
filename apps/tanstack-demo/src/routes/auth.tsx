import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ location }) => {
    if (true) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href
        }
      })
    }

  },
  component: () => <AuthComponent />
})


function AuthComponent() {
  return (
    <div>
      <p>This is the auth page</p>
    </div>
  )

}
