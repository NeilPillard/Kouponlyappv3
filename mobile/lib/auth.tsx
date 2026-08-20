import type {Session,User} from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {AppState} from 'react-native';
import {deleteAccountCloud} from '@/lib/backend';
import {supabase} from '@/utils/supabase';

type AuthResult={error?:string;confirmationRequired?:boolean};
type AuthValue={session:Session|null;user:User|null;loading:boolean;isGuest:boolean;recoveryMode:boolean;signIn:(email:string,password:string)=>Promise<AuthResult>;signUp:(name:string,email:string,password:string)=>Promise<AuthResult>;sendReset:(email:string)=>Promise<AuthResult>;updatePassword:(password:string)=>Promise<AuthResult>;updateEmail:(email:string)=>Promise<AuthResult>;refreshSession:()=>Promise<AuthResult>;signOut:()=>Promise<void>;deleteAccount:()=>Promise<AuthResult>;clearRecovery:()=>void};
const unavailable=async():Promise<AuthResult>=>({error:'Authentication is unavailable.'});
const AuthContext=createContext<AuthValue>({session:null,user:null,loading:false,isGuest:true,recoveryMode:false,signIn:unavailable,signUp:unavailable,sendReset:unavailable,updatePassword:unavailable,updateEmail:unavailable,refreshSession:unavailable,signOut:async()=>{},deleteAccount:unavailable,clearRecovery:()=>{}});

async function consumeAuthUrl(url:string){
  const parsed=new URL(url);const code=parsed.searchParams.get('code');if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(error)throw error;}
  const fragment=new URLSearchParams(parsed.hash.replace(/^#/,''));const accessToken=fragment.get('access_token');const refreshToken=fragment.get('refresh_token');if(accessToken&&refreshToken){const {error}=await supabase.auth.setSession({access_token:accessToken,refresh_token:refreshToken});if(error)throw error;}
  return parsed.searchParams.get('type')==='recovery'||fragment.get('type')==='recovery';
}

export function AuthProvider({children}:{children:React.ReactNode}){
  const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const [recoveryMode,setRecoveryMode]=useState(false);
  useEffect(()=>{let active=true;supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);setLoading(false)}});const {data}=supabase.auth.onAuthStateChange((event,next)=>{setSession(next);setLoading(false);if(event==='PASSWORD_RECOVERY')setRecoveryMode(true)});const appState=AppState.addEventListener('change',state=>state==='active'?supabase.auth.startAutoRefresh():supabase.auth.stopAutoRefresh());
    const handle=({url}:{url:string})=>void consumeAuthUrl(url).then(setRecoveryMode).catch(()=>{});const link=Linking.addEventListener('url',handle);void Linking.getInitialURL().then(url=>url&&handle({url}));return()=>{active=false;data.subscription.unsubscribe();appState.remove();link.remove();};},[]);
  const signIn=useCallback(async(email:string,password:string)=>{const{error}=await supabase.auth.signInWithPassword({email:email.trim(),password});return error?{error:error.message}:{}},[]);
  const signUp=useCallback(async(name:string,email:string,password:string)=>{const{data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim()},emailRedirectTo:Linking.createURL('/auth')}});return error?{error:error.message}:{confirmationRequired:!data.session}},[]);
  const sendReset=useCallback(async(email:string)=>{const{error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:Linking.createURL('/auth')});return error?{error:error.message}:{}},[]);
  const updatePassword=useCallback(async(password:string)=>{const{error}=await supabase.auth.updateUser({password});if(!error)setRecoveryMode(false);return error?{error:error.message}:{}},[]);
  const updateEmail=useCallback(async(email:string)=>{const{error}=await supabase.auth.updateUser({email:email.trim()});return error?{error:error.message}:{}},[]);
  const refreshSession=useCallback(async()=>{const{error}=await supabase.auth.refreshSession();return error?{error:error.message}:{}},[]);
  const signOut=useCallback(async()=>{await supabase.auth.signOut({scope:'local'});setRecoveryMode(false)},[]);
  const deleteAccount=useCallback(async()=>{try{await deleteAccountCloud();await supabase.auth.signOut({scope:'local'});return{}}catch(error){return{error:error instanceof Error?error.message:'Could not delete the account.'}}},[]);
  const value=useMemo<AuthValue>(()=>({session,user:session?.user??null,loading,isGuest:!session,recoveryMode,signIn,signUp,sendReset,updatePassword,updateEmail,refreshSession,signOut,deleteAccount,clearRecovery:()=>setRecoveryMode(false)}),[session,loading,recoveryMode,signIn,signUp,sendReset,updatePassword,updateEmail,refreshSession,signOut,deleteAccount]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
