import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { connectionStore } from "@/lib/store"
import useSWR from "swr"

export const Route = createFileRoute('/server/$address/settings')({
  component: () => Settings
})


function Settings() {
  // TODO - make this a `useUser` hook
  const connection = useStore(connectionStore)
  const { data, error, isLoading } = useSWR("current-user", () => {
    if (connection === null) {
      throw new Error("No connection")
    }
  })


  return (
    <p></p>
  )
}
