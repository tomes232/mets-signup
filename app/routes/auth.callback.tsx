import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, createBrowserClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { useLoaderData } from '@remix-run/react'
import { createSupabaseClientForServer } from '../utils/supabase'
import { createUserSession } from '../services/session.server'
import { useEffect } from 'react'

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'


  const headers = new Headers()




  if (code) {
    const supabase = createSupabaseClientForServer(request, headers)

    const { data,error } = await supabase.auth.exchangeCodeForSession(code)


    if (!error) {
      return createUserSession({
        request,
        userId: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        remember: false,
        redirectTo: next,
      })
      
    }
  }

  // return the user to an error page with instructions
  return redirect('/auth/auth-code-error', { headers })
}

