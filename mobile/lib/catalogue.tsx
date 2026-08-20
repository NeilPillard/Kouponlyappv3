import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {AppState} from 'react-native';
import {applyCataloguePatch,campaigns,categories,deals,directoryItems,heroSlides,rewards,type Campaign,type Category,type Deal,type DirectoryItem,type HeroSlide,type Reward} from '@/lib/data';
import {subscribeToCatalogue} from '@/lib/backend';
import {useAuth} from '@/lib/auth';
import {supabase} from '@/utils/supabase';

type CatalogueStatus='bundled'|'loading'|'cloud'|'offline';
type Value={status:CatalogueStatus;revision:number;refresh:()=>Promise<void>};
const Context=createContext<Value>({status:'bundled',revision:0,refresh:async()=>{}});
const merge=<T extends {id?:string|number}>(base:T[],incoming:T[])=>{const byId=new Map(base.map(item=>[String(item.id),item]));return incoming.map(item=>({...byId.get(String(item.id)),...item} as T)).concat(base.filter(item=>!incoming.some(next=>String(next.id)===String(item.id))));};
const rows=<T,>(value:{id:string;payload:unknown}[]|null)=>((value??[]).map(row=>typeof row.payload==='object'&&row.payload?{...(row.payload as Record<string,unknown>),id:(row.payload as Record<string,unknown>).id??row.id}:row.payload).filter(Boolean) as T[]);

export function CatalogueProvider({children}:{children:React.ReactNode}){
  const {user}=useAuth();const [status,setStatus]=useState<CatalogueStatus>('bundled');const [revision,setRevision]=useState(0);
  const refresh=useCallback(async()=>{if(!user){setStatus('bundled');return;}setStatus('loading');try{
    const names=['catalogue_deals','catalogue_offers','catalogue_partners','catalogue_categories','catalogue_hero_slides','catalogue_campaigns','catalogue_rewards'] as const;
    const result=await Promise.all(names.map(name=>supabase.from(name).select('id,payload').eq('published',true).order('sort_order')));const failure=result.find(item=>item.error);if(failure?.error)throw failure.error;
    const [cloudDeals,cloudOffers,cloudPartners,cloudCategories,cloudHeroes,cloudCampaigns,cloudRewards]=result;
    const nextDeals=merge(deals,rows<Deal>(cloudDeals.data));const nextDirectory=merge(directoryItems,[...rows<DirectoryItem>(cloudPartners.data),...rows<DirectoryItem>(cloudOffers.data)]);
    const hydratedCampaigns=rows<Campaign>(cloudCampaigns.data).map(item=>({...campaigns.find(base=>base.id===item.id),...item} as Campaign));
    const hydratedRewards=rows<Reward>(cloudRewards.data).map(item=>({...rewards.find(base=>base.id===item.id),...item} as Reward));
    const incomingCategories=rows<Category>(cloudCategories.data);const nextCategories=incomingCategories.length?[...incomingCategories,...categories.filter(item=>!incomingCategories.some(next=>next.name===item.name))]:categories;
    applyCataloguePatch({deals:nextDeals,directoryItems:nextDirectory,categories:nextCategories,heroSlides:merge(heroSlides.map((item,index)=>({...item,id:String(index)})),rows<HeroSlide&{id:string}>(cloudHeroes.data)).map(({id:_id,...item})=>item as HeroSlide),campaigns:hydratedCampaigns,rewards:hydratedRewards});
    setRevision(value=>value+1);setStatus('cloud');
  }catch{setStatus('offline');}},[user?.id]);
  useEffect(()=>{void refresh();if(!user)return;const channel=subscribeToCatalogue(()=>void refresh());const app=AppState.addEventListener('change',state=>state==='active'&&void refresh());return()=>{void supabase.removeChannel(channel);app.remove();}},[user?.id,refresh]);
  const value=useMemo(()=>({status,revision,refresh}),[status,revision,refresh]);return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useCatalogue=()=>useContext(Context);
