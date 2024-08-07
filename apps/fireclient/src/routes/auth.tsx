import { createFileRoute, Link } from "@tanstack/react-router"
import { AuthForm } from "@/components/auth-form"
import { FaArrowLeft } from "react-icons/fa"

export const Route = createFileRoute("/auth")({
  component: () => <AuthComponent />
})

function AuthComponent() {
  // const query = Route.useSearch()

  return (
    <main className="m-2 flex flex-col">
      <h1 className="text-4xl text-center mb-16 mt-64">
        Register a New or Existing Identity
      </h1>
      <AuthForm />
      <Link to="/" className="flex flex-row btn mx-auto mt-32">
        <FaArrowLeft />
        Back to Home
      </Link>
    </main>
  )
}
