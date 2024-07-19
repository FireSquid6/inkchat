import { getStoredSessions } from "@/lib/auth"

export function DevConsole() {
  // we don't want this to show up in production
  if (process.env.NODE_ENV === "production") {
    return <></>
  }

  const printInfo = () => {
    const { data: sessions } = getStoredSessions()

    if (sessions) {
      console.log("===============================================")
      console.log(`APPLICATION STATE AS OF ${new Date().toISOString()}`)
      console.log("===============================================")
      console.log("Stored Sessions:")
      console.table(sessions.map((session) => ({
        address: session.address,
        token: session.token,
      })))

    } else {
      console.log("getStoredSessions returned null")
    }
  }

  return (
    <button className="fixed bottom-0 right-0 m-2 text-sm btn btn-secondary" onClick={printInfo}>Application State</button>
  )
}
