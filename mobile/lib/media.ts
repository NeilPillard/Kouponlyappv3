import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import type {StorageAsset} from '@/lib/cloud.types';

const extension=(name:string|undefined,mime:string)=>name?.split('.').pop()?.toLowerCase()??(mime.includes('video')?'mp4':mime.includes('png')?'png':'jpg');
const toAsset=(bucket:StorageAsset['bucket'],userId:string,picked:ImagePicker.ImagePickerAsset,campaignId?:string):StorageAsset=>{
  const id=Crypto.randomUUID();const mimeType=picked.mimeType??(picked.type==='video'?'video/mp4':'image/jpeg');const ext=extension(picked.fileName??undefined,mimeType);const path=bucket==='avatars'?`${userId}/avatar-${id}.${ext}`:`${userId}/${campaignId}/${id}.${ext}`;
  return{id,bucket,path,uri:picked.uri,mimeType,byteSize:picked.fileSize??1,mediaType:picked.type==='video'?'video':'image',progress:0,status:'selected'};
};
export async function pickAvatar(userId:string){const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],allowsEditing:true,aspect:[1,1],quality:.86});if(result.canceled)return null;const asset=toAsset('avatars',userId,result.assets[0]);if(asset.byteSize>5*1024*1024)throw new Error('Profile photos must be smaller than 5 MB.');return asset;}
export async function pickCampaignMedia(userId:string,campaignId:string,remaining:number){const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images','videos'],allowsMultipleSelection:true,selectionLimit:Math.max(1,remaining),quality:.9,videoMaxDuration:60});if(result.canceled)return[];return result.assets.slice(0,remaining).map(item=>toAsset('campaign-media',userId,item,campaignId)).map(asset=>{if(asset.byteSize>25*1024*1024)throw new Error(`${asset.mediaType==='video'?'Video':'Image'} must be smaller than 25 MB.`);return asset;});}
