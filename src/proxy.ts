import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { errors, jwtVerify } from 'jose'

const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify']
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/learning']
const adminRoutes = ['/admin']

const matchRoute = (routes: string[], pathname: string) => {
    return routes.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value

    const { pathname } = request.nextUrl

    const isAuth = matchRoute(authRoutes, pathname)
    const isProtected = matchRoute(protectedRoutes, pathname)
    const isAdmin = matchRoute(adminRoutes, pathname)

    // if user not login, and visit protected or admin route => redirect to home page
    if (!token && (isProtected || isAdmin)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // if user login
    if (token) {
        //  visit auth route => redirect to home page
        if (isAuth) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // visit admin route => decoded JWT token, check role admin
        if (isAdmin) {
            try {
                const secretKey = process.env.JWT_SECRET

                // if JWT_SECRET is not defined => redirect to home page
                if (!secretKey) {
                    return NextResponse.redirect(new URL('/', request.url))
                }

                const secret = new TextEncoder().encode(process.env.JWT_SECRET)
                const { payload } = (await jwtVerify(token, secret)) as {
                    payload: {
                        role: 'admin' | 'user'
                        sub: string
                    }
                }

                if (payload.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url))
                }
            } catch (error) {
                /**
                 * if token is not valid => redirect to login page
                 * Don't redirect if token is expired, because user will refresh token
                 */
                if (error instanceof errors.JWTExpired) {
                    return NextResponse.next()
                }

                return NextResponse.redirect(new URL('/auth/login', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)'],
}
