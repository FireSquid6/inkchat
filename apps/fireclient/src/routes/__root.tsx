import { createRootRoute, Outlet } from '@tanstack/react-router'
import React, { Suspense } from "react"
import { DevConsole } from "@/components/devconsole"

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      )

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <DevConsole />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
})

