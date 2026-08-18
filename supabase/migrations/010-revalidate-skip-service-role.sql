-- Gate the D-21 revalidation trigger so service-role-key writes (content
-- scripts, bulk content-authoring — the pattern every scripts/create-*-
-- content.mjs run uses) don't fire the production revalidate webhook.
-- Only genuinely interactive admin-panel edits (authenticated as a real
-- admin user, JWT role='authenticated') still do. Scripts already
-- revalidate deliberately when it's actually wanted; the automatic
-- fire-on-every-row-write was the confirmed dominant driver of the
-- 2026-08 ISR-write growth (see docs/DECISIONS.md).
--
-- This function was never previously saved as a migration in this repo
-- (D-21 was written and applied directly via SQL Editor) — fetched the
-- live definition first via
--   SELECT pg_get_functiondef('public.trigger_revalidate'::regproc);
-- and this migration is byte-identical to that except for the one `if`
-- block added at the top. Not a reconstruction from memory/prose.
--
-- request.jwt.claim.role is the GUC PostgREST sets per-request from the
-- decoded JWT's role claim — the same mechanism Supabase's own
-- auth.role() helper reads, and it works correctly here despite this
-- function being SECURITY DEFINER (that only affects current_user/
-- privilege context, not this session-scoped GUC). Read with the `true`
-- (missing_ok) second arg since a direct SQL Editor session (superuser,
-- no PostgREST/JWT involved at all) has no such GUC set — NULL !=
-- 'service_role', so a manual dashboard edit is correctly NOT skipped
-- either, only an actual service-role-key REST request is.
CREATE OR REPLACE FUNCTION public.trigger_revalidate()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  secret text;
begin
  if current_setting('request.jwt.claim.role', true) = 'service_role' then
    return coalesce(NEW, OLD);
  end if;

  select decrypted_secret into secret
  from vault.decrypted_secrets
  where name = 'revalidate_secret';

  perform net.http_post(
    url := 'https://lca-docs.vercel.app/api/revalidate',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-revalidate-secret', secret
    ),
    body := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record', to_jsonb(NEW),
      'old_record', to_jsonb(OLD)
    )
  );
  return coalesce(NEW, OLD);
end;
$function$;
