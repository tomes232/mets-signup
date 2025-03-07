// app/routes/auth.google.tsx
import { LoaderFunctionArgs, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { createSupabaseClientForServer } from '../utils/supabase';


export const loader = async ({ request }: LoaderFunctionArgs) => {
    const headers = new Headers();
    
    const supabase = createSupabaseClientForServer(request, headers)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
      },
    });


  
    if (error) {
      throw new Error(error.message);
    }
  
    // This will redirect to Google's authentication page
    return redirect(data.url, { headers });
  };

