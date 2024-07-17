import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

export function SidebarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <main className="drawer-content h-screen">
        <Topbar />

        {children}
      </main>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
