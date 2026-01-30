import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Clone headers pour éviter les problèmes de mutation
    const requestHeaders = new Headers(request.headers)
    
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
