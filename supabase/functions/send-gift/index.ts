import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default { fetch: withSupabase({auth:"user"},async(req,ctx)=>{
  const body=await req.json() as {offer?:string;recipient?:string};
  if(!body.offer?.trim()||!body.recipient?.trim())return Response.json({error:{code:"invalid_request",message:"Offer and recipient are required."}},{status:400});
  const {data,error}=await ctx.supabase.from("sent_gifts").insert({user_id:ctx.userClaims!.id,offer:body.offer.trim(),recipient:body.recipient.trim()}).select("id,offer,recipient,sent_at").single();
  if(error)return Response.json({error:{code:"send_failed",message:error.message}},{status:400});
  return Response.json({data});
})};
