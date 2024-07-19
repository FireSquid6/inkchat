import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server/$address/$channel')({
  component: () => <div>Hello /server/$address/$channel!</div>
})