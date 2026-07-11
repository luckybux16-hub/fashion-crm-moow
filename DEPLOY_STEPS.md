# CRM deployment steps

## Step 1. Prepare Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy these values from Project Settings -> API:
   - Project URL
   - anon public key

The current schema is intentionally simple for the prototype: one shared JSON document in `crm_state`.

## Step 1.1. CRM-managed access

This CRM uses access records created inside CRM -> Доступы.

When adding a new person:

1. Add them in CRM -> Доступы.
2. Set login/email, password, role, and active status there.
3. They can immediately log in with those credentials.

Do not run `supabase/auth-schema.sql` for this mode. If it was already run, run `supabase/crm-managed-auth-schema.sql` to restore CRM-managed access.

## Step 2. Configure Vercel

Add environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN` (optional, for Telegram notifications)

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```

## Step 3. GitHub and Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Deploy.

## Step 4. Telegram notifications

1. Create a bot in Telegram via `@BotFather`.
2. Copy the bot token to Vercel -> Project -> Settings -> Environment Variables as `TELEGRAM_BOT_TOKEN`.
3. Each CRM user must open the bot and send `/start`.
4. Add that user's Telegram chat ID in CRM -> Доступы.
5. Set Telegram notifications to `Вкл`.
6. Use the `Тест` button in CRM -> Доступы to verify delivery.
