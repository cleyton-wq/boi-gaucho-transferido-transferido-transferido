import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verifica se tem usuário autenticado no localStorage
  // Como middleware roda no servidor, vamos permitir acesso e verificar no cliente
  const { pathname } = request.nextUrl

  // Permite acesso à página de login
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Para outras rotas, deixa o cliente verificar autenticação
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json|icon-192.png|icon-512.png).*)'],
}
