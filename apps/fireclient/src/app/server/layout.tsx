"use client"
import { SidebarLayout } from "@/components/sidebar-layout"
import { getStoredSessions } from "@/lib/auth"
import { sdk } from "api"
import { isSome, isNone } from "maybe"
import { resetStores } from "@/lib/store"
import { usePathname, useRouter } from "next/navigation"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const res = getStoredSessions()
  const router = useRouter()
  const pathname = usePathname()
  console.log(pathname)

  if (isNone(res)) {
    // TODO: include a query for the address when redirecting back to auth
    router.push("/auth")
  }


  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  )
}
