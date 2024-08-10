import { printDebug } from "@/lib/debug"
import { FaTerminal } from "react-icons/fa6"

export function DevConsole() {
  // we don't want this to show up in production
  if (process.env.NODE_ENV === "production") {
    return <></>
  }

  return (
    <button
      className="fixed top-0 right-0 m-2 text-sm btn btn-secondary rounded-full"
      onClick={printDebug}
    >
      <FaTerminal />
    </button>
  )
}
