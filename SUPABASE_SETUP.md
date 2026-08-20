# Kouponly Supabase setup

The mobile app is local-first. Guests use an isolated bundled catalogue and AsyncStorage profile. Signed-in users load cloud state into a separate per-user cache, receive Realtime changes, and queue safe row-level writes while offline. Trusted redemptions, rewards, gifts, campaign submissions, uploads, and account deletion require the hosted backend.

## Hosted deployment

Authenticate the CLI, link the existing project, then apply the database and functions:

```sh
npx supabase login
npx supabase link --project-ref gwgvhteqmmcfsdpjeokp
npx supabase db push --linked
npx supabase functions deploy validate-redemption
npx supabase functions deploy submit-campaign
npx supabase functions deploy redeem-reward
npx supabase functions deploy send-gift
npx supabase functions deploy accept-gift
npx supabase functions deploy delete-account
```

In hosted Auth URL configuration, allow `kouponly://auth` and the development Expo redirect. Email/password sign-up, confirmation, recovery, password/email updates, refresh, and deletion are implemented. Configure production SMTP before enabling mandatory confirmation.

Private `avatars` and `campaign-media` buckets, their owner-folder policies, catalogue seed records, and Realtime publication are created by migrations. Regenerate catalogue SQL with `npm run supabase:catalogue`, and refresh mobile types from the linked cloud schema with `npx supabase gen types typescript --linked`.

## Optional local backend verification

A Docker-compatible runtime is required only for the optional local Supabase stack. The mobile app and deployed cloud project do not use Docker at runtime.

```sh
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
```

The publishable key is safe for the mobile client because every user-owned table has Row Level Security. Never place a Supabase secret key in `mobile/.env.local` or any Expo public variable.
