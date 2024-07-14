import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest ) {
  const pathname = request.nextUrl.pathname
  const split = pathname.split('/')

  if (split.length < 3) {
    console.log(`No redicret. What happened here? ${pathname}`)
    return
  }

  const address = split[2]

  // TODO: check if we have a valid connection for this address
  // if not, redirect to the connect page
  if (true) {
    const queryParams = new URLSearchParams({
      address,
    })
    return NextResponse.redirect(new URL(`/auth?${queryParams.toString()}`, request.url))
  }
}

export const config = {
  matcher: '/server/:address*',
}
