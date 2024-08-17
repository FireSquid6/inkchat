import { createFileRoute, Link } from "@tanstack/react-router"
import { AuthForm } from "@/components/auth-form"
import { FaArrowLeft } from "react-icons/fa"
import type { AuthFormProps } from "@/components/auth-form"

export const Route = createFileRoute("/auth")({
  component: () => <AuthComponent />
})

function AuthComponent() {
  const query: AuthFormProps = Route.useSearch()

  return (
    <main className="m-2 flex flex-col">
      <Link to="/" className="flex flex-row btn ml-4 mr-auto mt-4">
        <FaArrowLeft />
        Back to Home
      </Link>
      <h1 className="text-4xl text-center mb-16 mt-16">
        Register a New or Existing Identity
      </h1>
      <AuthForm address={query.address} joincode={query.joincode} />
    </main>
  )
}
