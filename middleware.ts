import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Pega o token do cookie
  const token = request.cookies.get('sb-access-token')?.value

  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (user) {
      // Usuário autenticado
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }
  }

  // Usuário não autenticado
  if (request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|lasy-bridge.js).*)'],
}
