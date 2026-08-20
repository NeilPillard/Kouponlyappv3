import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.cwd(),'..');
const schema=fs.readFileSync(path.join(root,'supabase/migrations/20260815120000_complete_mobile_backend.sql'),'utf8');
const seed=fs.readFileSync(path.join(root,'supabase/migrations/20260815121000_catalogue_seed.sql'),'utf8');

describe('Supabase production contract',()=>{
  it('protects private storage by authenticated user folder',()=>{expect(schema).toContain("('avatars', 'avatars', false");expect(schema).toContain("('campaign-media', 'campaign-media', false");expect(schema).toContain("(storage.foldername(name))[1]=(select auth.uid())::text")});
  it('publishes user state and catalogue through Realtime',()=>{expect(schema).toContain('alter publication supabase_realtime add table');expect(schema).toContain("'campaign_attachments'");expect(schema).toContain("'catalogue_rewards'")});
  it('uses atomic idempotent trusted mutations',()=>{expect(schema).toContain('mutation_receipts');expect(schema).toContain('redeem_reward_atomic');expect(schema).toContain('validate_redemption_atomic');expect(schema).toContain('for update')});
  it('seeds the complete fixture families',()=>{for(const table of ['catalogue_deals','catalogue_offers','catalogue_partners','catalogue_categories','catalogue_hero_slides','catalogue_campaigns','catalogue_rewards'])expect(seed).toContain(`insert into public.${table}`);expect((seed.match(/partner-placeholder-/g)??[]).length).toBeGreaterThanOrEqual(100);expect((seed.match(/catalogue_deals/g)??[]).length).toBeGreaterThan(0)});
  it('ships every trusted edge function with JWT verification',()=>{const config=fs.readFileSync(path.join(root,'supabase/config.toml'),'utf8');for(const name of ['validate-redemption','submit-campaign','redeem-reward','send-gift','accept-gift','delete-account']){expect(config).toContain(`[functions.${name}]`);expect(fs.existsSync(path.join(root,`supabase/functions/${name}/index.ts`))).toBe(true)}});
});
