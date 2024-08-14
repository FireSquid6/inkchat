import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/server/$address/about")({
  component: () => <About />
})



function About() {

  // const [connection] = useStore(connectionStore)
  // const info = useAsync<ServerInformation>(async () => {
  //   if (!connection) return null
  //   const [state, error] = await connection.info()
  //   if (error) {
  //     pushError(error)
  //     return null
  //   }
  //   return state
  // })
  //

  return (
    <div>
      <h1 className="text-3xl text-center mx-auto w-full mb-8 mt-24">Server Information</h1>
      <p>Not implemented yet. See a channel page!</p>
    </div>
  )
}
