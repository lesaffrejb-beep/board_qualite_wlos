import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    // Define CSP header
    // script-src: 'unsafe-eval' is required because libraries like react-pdf use eval() or new Function()
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:;
    worker-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_SUPABASE_URL};
    connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    `
    // Replace newlines with spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim()

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes: /dashboard, /audit, /quality
    const protectedPaths = ['/dashboard', '/audit', '/quality']
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user) {
        // Redirect to login if accessing protected route without auth
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname === '/login' && user) {
        // Redirect to dashboard if already logged in
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Set CSP header on the response
    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
