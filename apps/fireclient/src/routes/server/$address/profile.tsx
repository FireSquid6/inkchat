import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$address/profile')({
  component: () => <div>Hello /server/$address/profile!</div>
})