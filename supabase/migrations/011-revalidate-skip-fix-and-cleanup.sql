-- 010 shipped with the wrong GUC name (`request.jwt.claim.role`, which
-- this project's PostgREST doesn't populate — confirmed by a live debug
-- trigger, see docs/DECISIONS.md) so the skip never actually fired.
-- Real signal, confirmed by that same debug run: `current_setting('role',
-- true)` — the actual Postgres role PostgREST SET-ROLE'd to for this
-- request. Simpler than parsing the request.jwt.claims JSON blob, and
-- unlike current_user (masked to the function owner by SECURITY DEFINER)
-- or session_user (fixed at the pooler's login role for every request
-- regardless of caller), it directly reflects who's actually calling.
--
-- Also drops the scratch debug table + restores the function to a clean
-- (non-logging) version — the diagnostic insert from the live debug
-- session is not meant to ship.
CREATE OR REPLACE FUNCTION public.trigger_revalidate()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  secret text;
begin
  if current_setting('role', true) = 'service_role' then
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

drop table if exists public._debug_trigger_context;
