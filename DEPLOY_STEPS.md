# CRM deployment steps

## Step 1. Prepare Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy these values from Project Settings -> API:
   - Project URL
   - anon public key

The current schema is intentionally simple for the prototype: one shared JSON document in `crm_state`.
For production access control, add Supabase Auth and stricter RLS policies later.

## Step 1.1. Supabase Auth users

Create these users in Supabase Authentication -> Users:

- `admin@fashion-crm.local` / `admin`
- `owner@fashion-crm.local` / `owner`
- `workshop@fashion-crm.local` / `workshop`
- `constructor@fashion-crm.local` / `constructor`

After these users can log in, run `supabase/auth-schema.sql` to restrict CRM data to authenticated users only.

When adding a new person later:

1. Add them in CRM -> Доступы with the right role and email.
2. Add the same email in Supabase Authentication -> Users.
3. Set their Supabase password there.

The CRM role record and Supabase Auth user are separate on purpose.

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
