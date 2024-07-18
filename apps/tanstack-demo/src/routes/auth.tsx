import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from "@/components/auth-form"

export const Route = createFileRoute('/auth')({
  component: () => <AuthComponent />
})


function AuthComponent() {
  return (
    <main>
      <AuthForm />
    </main>
  )

}
