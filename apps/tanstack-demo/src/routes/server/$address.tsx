import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$address')({
  component: () => <div>Hello /server/$address!</div>
})