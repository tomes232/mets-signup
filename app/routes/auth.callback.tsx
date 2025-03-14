import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { createSupabaseClientForServer } from '../utils/supabase'
import { serializeCookieHeader } from '@supabase/ssr'

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'


  const headers = new Headers()


  if (code) {
    const supabase = createSupabaseClientForServer(request, headers)

    const { data,error } = await supabase.auth.exchangeCodeForSession(code)

  //TODO: ACCESS THE PROVIDER REFRESH TOKEN TO CONNECT TO THE GOOGLE API
  // if(data.session){

  //   headers.append('Set-Cookie', serializeCookieHeader("provider_token", data.session.provider_token || "", { path: '/', sameSite: 'lax', httpOnly: false, maxAge: 34560000 } ))
  //   headers.append('Set-Cookie', serializeCookieHeader("refresh_provider_token", data.session.provider_token || "", { path: '/', sameSite: 'lax', httpOnly: false, maxAge: 34560000 } ))

  // }

    if (!error) {
      return redirect(next, { headers })
    }
  }

  // return the user to an error page with instructions
  return redirect('/auth/auth-code-error', { headers })
}

