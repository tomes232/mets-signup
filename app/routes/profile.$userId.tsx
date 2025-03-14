
import { ActionFunctionArgs, LoaderFunctionArgs, UploadHandler, data, redirect, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/node'
import { createSupabaseClientForServer, supabaseUploadHandler } from '~/utils/supabase'
import { useLoaderData, useActionData, Form, Outlet } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useRef } from "react";




export const loader = async ({request, params}: LoaderFunctionArgs ) =>{
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers)

    const userId = params.userId;


    const {data: profileData, error: profileError }  = await supabase.from('profiles')
                                                                      .select("*")
                                                                      .eq('id', userId)

    if(profileError){
        throw new Error("Failed to profile")
    }

    return profileData[0]

}

  




export const action = async ({request,  params }: ActionFunctionArgs ) => {
    
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers)

    const contentType = request.headers.get("Content-Type") || "";


    const userId = params.userId;

    let formData
    const imgPath = `public/${userId}-${Math.floor((Math.random() * 100) + 1)}.jpg`


    if (contentType.includes("multipart/form-data")) {
      formData = await unstable_parseMultipartFormData(
        request,
        supabaseUploadHandler(imgPath, supabase)
      );     
    } 
    else {
      formData = await request.formData();
    }

  

    if (!formData){
      throw new Error("Did not recieve form data")
    }
    const actionType = formData.get("_action");

    
    if (actionType === "updateAvatar") {
    
     const imagePath = formData.get('image')

    if (imagePath){
        const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(imgPath)

        const {data: profileData, error: profileError }  = await supabase.from('profiles')
        .update({'avatar_url': data.publicUrl })
        .eq('id', userId )
        .single()

        if(profileError){
          throw new Error("Unable to update profile")
        }
        

    }
  }
  else if (actionType === "updateName"){
    const newName = formData.get("name")

    const {data: profileData, error: profileError }  = await supabase.from('profiles')
    .update({'name': newName })
    .eq('id', userId )
    .single()

    if(profileError){
      throw new Error("unable to update profile")
    }
    
  }

 
    
  return redirect(`/profile/${userId}`,{headers})



}




export default function profilePage() {
    const profileData = useLoaderData<typeof loader>()
    const inputRef = useRef<HTMLInputElement>(null);


    return (
    <div>
      <div className="flex flex-col items-center">

<Avatar onClick={() => inputRef.current?.click()} className="w-20 h-20" >
    <AvatarImage src={profileData?.avatar_url } />
    <AvatarFallback>
      {profileData?.name?.charAt(0)}
    </AvatarFallback>
  </Avatar>

  <Form onChange={e => e.currentTarget.submit()} encType="multipart/form-data" method="post" > 
<input type="hidden" name="_action" value="updateAvatar" />
<input type="hidden" name="userId" value={profileData.id} />
<input style={{ display: "none" }} name="image" ref={inputRef} type="file" />
</Form>
<button onClick={() => inputRef.current?.click()}>Upload Image</button>

</div>
    <Form className="space-y-6 max-w-md mx-auto p-4" method="post">
    <input type="hidden" name="_action" value="updateName" />
    <input type="hidden" name="userId" value={profileData.id} />
      <div className="grid gap-1">
        <Label htmlFor="name" className="text-sm font-medium">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={profileData.name}
          className="w-full"
        />
      </div>
      {/* TODO: ADD CHANGE EMAIL TO THE PROFILE FORM */}
      {/* <div className="grid gap-1">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full"
        />
      </div> */}
      <Button type="submit" className="w-full">
        Update Profile
      </Button>
    </Form>
        </div>
    )

}