import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    // 1. We create the response object first
    const response = NextResponse.redirect(`${origin}${next}`)
    
    // 2. Pass that specific response instance into the server client context
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set({ name, value, ...options })
            )
            // This is crucial: write the session cookies directly onto the redirect response
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set({ name, value, ...options })
            )
          },
        },
      }
    )

    // 3. Exchange the code (this triggers setAll behind the scenes)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Return the response instance that now carries your authentic session cookies
      return response
    }
  }

  // Fallback if auth fails
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}