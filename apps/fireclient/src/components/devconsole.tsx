import { printDebug } from "@/lib/debug"

export function DevConsole() {
  // we don't want this to show up in production
  if (process.env.NODE_ENV === "production") {
    return <></>
  }

  return (
    <button className="fixed bottom-0 right-0 m-2 text-sm btn btn-secondary" onClick={printDebug}>Application State</button>
  )
}
