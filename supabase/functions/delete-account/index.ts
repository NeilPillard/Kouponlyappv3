import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { createClient } from "@supabase/supabase-js";

export default { fetch:withSupabase({auth:"user"},async(_req,ctx)=>{
  const userId=ctx.userClaims!.id;
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const collect=async(bucket:string,prefix:string):Promise<string[]>=>{const{data}=await admin.storage.from(bucket).list(prefix,{limit:1000});const paths:string[]=[];for(const item of data??[]){const path=`${prefix}/${item.name}`;if(item.metadata)paths.push(path);else paths.push(...await collect(bucket,path))}return paths};
  for(const bucket of ["avatars","campaign-media"]){
    const paths=await collect(bucket,userId);if(paths.length)await admin.storage.from(bucket).remove(paths);
  }
  const {error}=await admin.auth.admin.deleteUser(userId);
  if(error)return Response.json({error:{code:"delete_failed",message:error.message}},{status:400});
  return Response.json({data:{deleted:true}});
})};
