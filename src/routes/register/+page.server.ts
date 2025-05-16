import type { Actions } from './$types'
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
interface ReturnObject {
    success: boolean;
    errors: string[];
}
export const actions ={
    default: async ({request}) => {
        const formData= await request.formData();
        const name =formData.get("name") as string;
        const email =formData.get("email") as string;
        const password =formData.get("password") as string;
        const passwordConfirmation =formData.get("passwordConfirmation") as string;
        
        const returnObject: ReturnObject ={
            success:true,
            errors: [],
        }

        if(name.length < 2){
            returnObject.errors.push("Name has to be at least 3 characters long.");
        }
        if(!email.length){
            returnObject.errors.push("Email is required.");
        }
        if(!password.length){
            returnObject.errors.push("Email is required.");
        }
        if(password !== passwordConfirmation){
            returnObject.errors.push("Passwords do not match.");
        }
        if(returnObject.errors.length){
            returnObject.success=false;
            return returnObject;
        }
        const supabase =createClient(PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_ANON_KEY);
        const {data,error} = await supabase.auth.signUp({
            email,
            password,
        });
        if(error || !data.user){
            console.log("There has been an error");
            console.log(error);
            returnObject.success=true;
            return fail(400,returnObject as any);
        }
        redirect(303,"/private/dashboard");
        return returnObject;
    },
    
};