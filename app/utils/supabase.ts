import { parseCookieHeader, createServerClient, serializeCookieHeader } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import {  UploadHandler } from '@remix-run/node'


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
              console.error('Error setting cookies', error)
            }
        },
      }
    }
  )
}

export const supabaseUploadHandler =
  (path: string, supabase: SupabaseClient): UploadHandler =>
  async ({ data, filename }) => {
    const chunks = [];
    for await (const chunk of data) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    // If there's no filename, it's a text field and we can return the value directly
    if (!filename) {
      const textDecoder = new TextDecoder();
      return textDecoder.decode(buffer);
    }
    // Otherwise, it's an image and we'll save it to Supabase
    const { data: image, error } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, { upsert: true });
    
    if (error || !image) {
      // TODO Add error handling
      return null;
    }
    return image.path;
  };