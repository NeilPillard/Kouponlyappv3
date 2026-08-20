import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default { fetch:withSupabase({auth:"user"},async(req,ctx)=>{
  const body=await req.json() as {giftId?:string};
  if(!body.giftId)return Response.json({error:{code:"invalid_request",message:"Gift id is required."}},{status:400});
  const {error}=await ctx.supabase.from("accepted_gifts").upsert({user_id:ctx.userClaims!.id,gift_id:body.giftId},{onConflict:"user_id,gift_id"});
  if(error)return Response.json({error:{code:"accept_failed",message:error.message}},{status:400});
  return Response.json({data:{giftId:body.giftId,status:"accepted"}});
})};
