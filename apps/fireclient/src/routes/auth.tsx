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
      <Link to="/" className="flex flex-row btn ml-4 mr-auto mt-4">
        <FaArrowLeft />
        Back to Home
      </Link>
      <h1 className="text-4xl text-center mb-16 mt-16">
        Register a New or Existing Identity
      </h1>
      <AuthForm />

    </main>
  )
}
