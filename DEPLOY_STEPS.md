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
