import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from "@/components/auth-form"

export const Route = createFileRoute('/auth')({
  component: () => <AuthComponent />
})


function AuthComponent() {
  return (
    <main className="m-2 flex flex-col">
      <h1 className="text-4xl text-center mb-16 mt-64">Register a New or Existing Identity</h1>
      <AuthForm />
    </main>
  )
}
