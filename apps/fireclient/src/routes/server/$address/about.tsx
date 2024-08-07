import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/server/$address/about")({
  component: () => <div>Hello /server/$address/!</div>
})
