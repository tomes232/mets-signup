import { parseCookieHeader, createServerClient, serializeCookieHeader } from '@supabase/ssr'

export const createSupabaseClientForServer = (request: Request, headers: Headers) => {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({ name, value, options }) =>
                    headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
                )
            } catch (error) {
            }
        },
      }
    }
  )
}