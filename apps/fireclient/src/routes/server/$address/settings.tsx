import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$address/settings')({
  component: () => <div>Hello /server/$address/settings!</div>
})