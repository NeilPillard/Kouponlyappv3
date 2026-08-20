import * as Crypto from 'expo-crypto';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { KouponlyState, RedemptionMode, RedemptionSession } from '@/lib/store';
import type { CampaignAttachment, EdgeResult, PendingMutation, StorageAsset } from '@/lib/cloud.types';
import { supabase } from '@/utils/supabase';

const time=(value:string|null)=>value?new Date(value).getTime():undefined;
export const makeMutationId=()=>Crypto.randomUUID();

export async function fetchCloudState():Promise<Partial<KouponlyState>|null>{
  const [profile,saved,offers,used,usage,campaigns,interests,redemptions,rewards,gifts,sent]=await Promise.all([
    supabase.from('profiles').select('points').maybeSingle(),supabase.from('saved_deals').select('deal_id'),supabase.from('saved_offers').select('offer_id'),
    supabase.from('used_deals').select('deal_id'),supabase.from('offer_usage').select('offer_id,use_count'),supabase.from('campaign_applications').select('campaign_id').neq('status','withdrawn'),
    supabase.from('user_interests').select('interest_id'),supabase.from('redemptions').select('*'),supabase.from('redeemed_rewards').select('reward_id'),
    supabase.from('accepted_gifts').select('gift_id'),supabase.from('sent_gifts').select('offer,recipient,sent_at').order('sent_at',{ascending:false}),
  ]);
  const failure=[profile,saved,offers,used,usage,campaigns,interests,redemptions,rewards,gifts,sent].find(result=>result.error);
  if(failure?.error)throw failure.error;
  return {points:profile.data?.points,saved:saved.data?.map(row=>row.deal_id),savedOffers:offers.data?.map(row=>row.offer_id),used:used.data?.map(row=>row.deal_id),
    offerUsage:Object.fromEntries((usage.data??[]).map(row=>[row.offer_id,row.use_count])),appliedCampaigns:campaigns.data?.map(row=>row.campaign_id),interests:interests.data?.map(row=>row.interest_id),
    redemptions:Object.fromEntries((redemptions.data??[]).map(row=>[row.redemption_id,{id:row.redemption_id,mode:row.mode as RedemptionMode,status:row.status as RedemptionSession['status'],code:row.code??undefined,expiresAt:time(row.expires_at),completedAt:time(row.completed_at),consumedAt:time(row.consumed_at)}])),
    redeemedRewards:rewards.data?.map(row=>row.reward_id),acceptedGifts:gifts.data?.map(row=>row.gift_id),sentGifts:sent.data?.map(row=>({offer:row.offer,recipient:row.recipient,sentAt:new Date(row.sent_at).getTime()}))};
}

export async function applyMutation(mutation:PendingMutation){
  const {kind,operation,entityId,payload,userId}=mutation; let queryError:unknown;
  if(kind==='save-deal'){const result=operation==='delete'?await supabase.from('saved_deals').delete().eq('deal_id',Number(entityId)):await supabase.from('saved_deals').upsert({user_id:userId,deal_id:Number(entityId)});queryError=result.error;}
  if(kind==='save-offer'){const result=operation==='delete'?await supabase.from('saved_offers').delete().eq('offer_id',entityId):await supabase.from('saved_offers').upsert({user_id:userId,offer_id:entityId});queryError=result.error;}
  if(kind==='interest'){const result=operation==='delete'?await supabase.from('user_interests').delete().eq('interest_id',entityId):await supabase.from('user_interests').upsert({user_id:userId,interest_id:entityId,note:String(payload.note??'')||null});queryError=result.error;}
  if(kind==='profile'){const result=await supabase.from('profiles').upsert({user_id:userId,...payload});queryError=result.error;}
  if(kind==='preferences'){const result=await supabase.from('user_preferences').upsert({user_id:userId,...payload});queryError=result.error;}
  if(queryError)throw queryError;
}

async function invoke<T>(name:string,body:Record<string,unknown>):Promise<T>{
  const {data,error}=await supabase.functions.invoke<EdgeResult<T>>(name,{body});
  if(error){let message=error.message;try{const payload=await (error as unknown as {context?:Response}).context?.clone().json() as {error?:{message?:string}}|undefined;message=payload?.error?.message??message}catch{}throw new Error(message);}
  if(!data?.data)throw new Error(`${name} returned no data`);
  return data.data;
}

export const validateRedemption=(id:string,mode:RedemptionMode,pin?:string,idempotencyKey=makeMutationId())=>invoke<{code:string|null;expiresAt:number|null;status:'code'|'success'}>('validate-redemption',{id,mode,pin,idempotencyKey});
export const submitCampaign=(campaignId:string,withdraw=false,note?:string,attachmentIds:string[]=[])=>invoke<{status:string;attachmentIds?:string[]}>('submit-campaign',{campaignId,withdraw,note,attachmentIds});
export const redeemRewardCloud=(rewardId:string,idempotencyKey=makeMutationId())=>invoke<{rewardId:string;points:number;cost:number}>('redeem-reward',{rewardId,idempotencyKey});
export const sendGiftCloud=(offer:string,recipient:string)=>invoke<{id:number;offer:string;recipient:string;sent_at:string}>('send-gift',{offer,recipient});
export const acceptGiftCloud=(giftId:string)=>invoke<{giftId:string;status:string}>('accept-gift',{giftId});
export const deleteAccountCloud=()=>invoke<{deleted:boolean}>('delete-account',{});

export async function updateProfile(profile:{full_name:string;email:string;city:string;mobile?:string}){
  const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Sign in to update your profile.');
  if(profile.email!==user.email){const {error}=await supabase.auth.updateUser({email:profile.email});if(error)throw error;}
  const {error}=await supabase.from('profiles').upsert({user_id:user.id,...profile});if(error)throw error;
}
export async function fetchProfile(){const {data,error}=await supabase.from('profiles').select('*').maybeSingle();if(error)throw error;return data;}
export async function updatePreferences(values:{offer_alerts:boolean;creator_updates:boolean;location:string;language:string}){const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error('Sign in to sync preferences.');const {error}=await supabase.from('user_preferences').upsert({user_id:user.id,...values});if(error)throw error;}
export async function fetchPreferences(){const {data,error}=await supabase.from('user_preferences').select('*').maybeSingle();if(error)throw error;return data;}
export async function sendFeedback(message:string){const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {error}=await supabase.from('feedback').insert({user_id:user.id,message:message.trim()});if(error)throw error;}

export function subscribeToUser(userId:string,onChange:()=>void):RealtimeChannel{
  let timer:ReturnType<typeof setTimeout>|undefined;const refresh=()=>{if(timer)clearTimeout(timer);timer=setTimeout(onChange,180)};
  const channel=supabase.channel(`user-state:${userId}`);for(const table of ['profiles','user_preferences','saved_deals','saved_offers','used_deals','offer_usage','campaign_applications','campaign_attachments','user_interests','redemptions','redeemed_rewards','accepted_gifts','sent_gifts','notifications'])channel.on('postgres_changes',{event:'*',schema:'public',table,filter:`user_id=eq.${userId}`},refresh);
  return channel.subscribe();
}
export function subscribeToCatalogue(onChange:()=>void):RealtimeChannel{let timer:ReturnType<typeof setTimeout>|undefined;const refresh=()=>{if(timer)clearTimeout(timer);timer=setTimeout(onChange,180)};const channel=supabase.channel('catalogue');for(const table of ['catalogue_deals','catalogue_offers','catalogue_partners','catalogue_categories','catalogue_hero_slides','catalogue_campaigns','catalogue_rewards'])channel.on('postgres_changes',{event:'*',schema:'public',table},refresh);return channel.subscribe();}

export async function signedUrl(bucket:'avatars'|'campaign-media',path:string,expiresIn=900){const {data,error}=await supabase.storage.from(bucket).createSignedUrl(path,expiresIn);if(error)throw error;return data.signedUrl;}
export async function removeStorageAsset(asset:Pick<StorageAsset,'bucket'|'path'>){const {error}=await supabase.storage.from(asset.bucket).remove([asset.path]);if(error)throw error;}
export async function removeCampaignAttachment(asset:Pick<StorageAsset,'id'|'bucket'|'path'>){await removeStorageAsset(asset);const{error}=await supabase.from('campaign_attachments').delete().eq('id',asset.id);if(error)throw error;}

export function uploadStorageAsset(asset:StorageAsset,userId:string,campaignId?:string,onProgress?:(value:number)=>void){
  let xhr:XMLHttpRequest|null=null;const promise=(async()=>{const {data:{session}}=await supabase.auth.getSession();if(!session)throw new Error('Sign in to upload media.');const blob=await (await fetch(asset.uri)).blob();
    await new Promise<void>((resolve,reject)=>{xhr=new XMLHttpRequest();xhr.open('POST',`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/${asset.bucket}/${asset.path}`);xhr.setRequestHeader('Authorization',`Bearer ${session.access_token}`);xhr.setRequestHeader('apikey',process.env.EXPO_PUBLIC_SUPABASE_KEY!);xhr.setRequestHeader('Content-Type',asset.mimeType);xhr.upload.onprogress=event=>event.lengthComputable&&onProgress?.(event.loaded/event.total);xhr.onerror=()=>reject(new Error('Upload failed. Check your connection and retry.'));xhr.onabort=()=>reject(new Error('Upload cancelled.'));xhr.onload=()=>xhr!.status>=200&&xhr!.status<300?resolve():reject(new Error(`Upload failed (${xhr!.status}).`));xhr.send(blob);});
    if(asset.bucket==='campaign-media'&&campaignId){const row:CampaignAttachment={...asset,campaignId,status:'uploaded',progress:1};const {error}=await supabase.from('campaign_attachments').insert({id:asset.id,user_id:userId,campaign_id:campaignId,storage_path:asset.path,media_type:asset.mediaType,mime_type:asset.mimeType,byte_size:asset.byteSize,status:'pending'});if(error){await supabase.storage.from(asset.bucket).remove([asset.path]);throw error;}return row;}
    if(asset.bucket==='avatars'){const {error}=await supabase.from('profiles').update({avatar_path:asset.path}).eq('user_id',userId);if(error)throw error;}
    return asset;
  })();return{promise,cancel:()=>xhr?.abort()};
}
