import { google } from "googleapis"
import { createSupabaseClientForServer } from "./supabase"



export const getGoogleClient = async (request: Request) =>  {
    const requestUrl = new URL(request.url)
  
    const supabase = createSupabaseClientForServer(request, new Headers())

  
    const { data, error } = await supabase.auth.getSession()
  
    const token = data?.session?.access_token

    if (!token){
        return
    }
  
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URL
    )
  
    client.setCredentials({access_token: token})
  
    return client
  

   
  };