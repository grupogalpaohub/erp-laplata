--
-- PostgreSQL database dump
--

\restrict FqJhdNF4pBnc4YQQRYuDQLvZkPYfi6dvAJrjay0BNRuzJaZQKtlshcCSbVBFlBR

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-19 11:16:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 29 (class 2615 OID 16494)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 23 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 34 (class 2615 OID 16624)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 33 (class 2615 OID 16613)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 12 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 9 (class 2615 OID 16605)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 30 (class 2615 OID 16542)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 31 (class 2615 OID 20101)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- TOC entry 32 (class 2615 OID 16653)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 6 (class 3079 OID 16689)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 16443)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16654)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1200 (class 1247 OID 16782)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1224 (class 1247 OID 16923)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1197 (class 1247 OID 16776)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1194 (class 1247 OID 16771)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1236 (class 1247 OID 17004)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1230 (class 1247 OID 16965)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1440 (class 1247 OID 42356)
-- Name: account_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_type AS ENUM (
    'caixa',
    'banco'
);


ALTER TYPE public.account_type OWNER TO postgres;

--
-- TOC entry 1434 (class 1247 OID 42340)
-- Name: customer_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_type AS ENUM (
    'PF',
    'PJ'
);


ALTER TYPE public.customer_type OWNER TO postgres;

--
-- TOC entry 1428 (class 1247 OID 42312)
-- Name: material_class; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.material_class AS ENUM (
    'prata',
    'ouro',
    'acabamento',
    'embalagem',
    'Amuletos',
    'Elementar',
    'Ciclos',
    'Ancestral'
);


ALTER TYPE public.material_class OWNER TO postgres;

--
-- TOC entry 1425 (class 1247 OID 42302)
-- Name: material_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.material_type AS ENUM (
    'raw_material',
    'finished_good',
    'component',
    'service',
    'Brinco',
    'Choker',
    'Gargantilha',
    'Kit',
    'Pulseira'
);


ALTER TYPE public.material_type OWNER TO postgres;

--
-- TOC entry 1446 (class 1247 OID 42368)
-- Name: movement_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.movement_type AS ENUM (
    'IN',
    'OUT',
    'RESERVE',
    'RELEASE',
    'ADJUST'
);


ALTER TYPE public.movement_type OWNER TO postgres;

--
-- TOC entry 1431 (class 1247 OID 42322)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'draft',
    'pending',
    'approved',
    'received',
    'cancelled',
    'shipped',
    'delivered',
    'invoiced'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 1437 (class 1247 OID 42346)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'pix',
    'cartao',
    'boleto',
    'transferencia'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- TOC entry 1443 (class 1247 OID 42362)
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_type AS ENUM (
    'credito',
    'debito'
);


ALTER TYPE public.transaction_type OWNER TO postgres;

--
-- TOC entry 1422 (class 1247 OID 42292)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'manager',
    'user',
    'viewer'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 1251 (class 1247 OID 17158)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1252 (class 1247 OID 17115)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1255 (class 1247 OID 17133)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1320 (class 1247 OID 17201)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1317 (class 1247 OID 17171)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1381 (class 1247 OID 20081)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 473 (class 1255 OID 16540)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 473
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 492 (class 1255 OID 16753)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 472 (class 1255 OID 16539)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 471 (class 1255 OID 16538)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 474 (class 1255 OID 16597)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 478 (class 1255 OID 16618)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 478
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 475 (class 1255 OID 16599)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 476 (class 1255 OID 16609)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 477 (class 1255 OID 16610)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 479 (class 1255 OID 16620)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 421 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 530 (class 1255 OID 43073)
-- Name: calculate_po_item_totals(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_po_item_totals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.line_total_cents := NEW.mm_qtt * NEW.unit_cost_cents;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_po_item_totals() OWNER TO postgres;

--
-- TOC entry 531 (class 1255 OID 43075)
-- Name: calculate_so_item_totals(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_so_item_totals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.line_total_cents := NEW.quantity * NEW.unit_price_cents;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_so_item_totals() OWNER TO postgres;

--
-- TOC entry 533 (class 1255 OID 43079)
-- Name: create_audit_log(text, text, text, text, jsonb, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit_log (tenant_id, table_name, record_pk, action, diff_json, actor_user)
    VALUES (p_tenant_id, p_table_name, p_record_pk, p_action, p_diff_json, p_actor_user);
END;
$$;


ALTER FUNCTION public.create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid) OWNER TO postgres;

--
-- TOC entry 535 (class 1255 OID 43109)
-- Name: next_doc_number(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.next_doc_number(p_tenant text, p_doc_type text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_prefix text;
  v_format text;
  v_next integer;
  v_num text;
BEGIN
  UPDATE doc_numbering
     SET next_seq = next_seq + 1
   WHERE tenant_id = p_tenant AND doc_type = p_doc_type AND is_active = true
  RETURNING prefix, format, next_seq INTO v_prefix, v_format, v_next;

  IF v_prefix IS NULL THEN
    RAISE EXCEPTION 'doc_numbering missing for tenant=% and type=%', p_tenant, p_doc_type;
  END IF;

  -- Suporta formato 'YYYYMM-SEQ6'
  v_num := to_char(now(), 'YYYYMM') || '-' || lpad(v_next::text, 6, '0');
  RETURN v_prefix || v_num;
END $$;


ALTER FUNCTION public.next_doc_number(p_tenant text, p_doc_type text) OWNER TO postgres;

--
-- TOC entry 534 (class 1255 OID 43080)
-- Name: refresh_kpi_snapshots(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.refresh_kpi_snapshots(p_tenant_id text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_orders_today INTEGER;
    v_month_revenue_cents INTEGER;
    v_active_leads INTEGER;
    v_stock_critical_count INTEGER;
    v_snapshot_at TIMESTAMPTZ := NOW();
BEGIN
    -- Orders today
    SELECT COUNT(*)
    INTO v_orders_today
    FROM sd_sales_order
    WHERE tenant_id = p_tenant_id
      AND order_date = CURRENT_DATE;
    
    -- Month revenue
    SELECT COALESCE(SUM(total_cents), 0)
    INTO v_month_revenue_cents
    FROM sd_sales_order
    WHERE tenant_id = p_tenant_id
      AND order_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND order_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
    
    -- Active leads (last 7 days)
    SELECT COUNT(*)
    INTO v_active_leads
    FROM crm_lead
    WHERE tenant_id = p_tenant_id
      AND created_date >= CURRENT_DATE - INTERVAL '7 days'
      AND status != 'convertido';
    
    -- Stock critical count (assuming critical = on_hand_qty < 10)
    SELECT COUNT(*)
    INTO v_stock_critical_count
    FROM wh_inventory_balance
    WHERE tenant_id = p_tenant_id
      AND on_hand_qty < 10;
    
    -- Insert/update KPI snapshots
    INSERT INTO co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number)
    VALUES 
        (p_tenant_id, 'kpi_orders_today', v_snapshot_at, v_orders_today),
        (p_tenant_id, 'kpi_month_revenue_cents', v_snapshot_at, v_month_revenue_cents),
        (p_tenant_id, 'kpi_active_leads', v_snapshot_at, v_active_leads),
        (p_tenant_id, 'kpi_stock_critical_count', v_snapshot_at, v_stock_critical_count)
    ON CONFLICT (tenant_id, kpi_key, snapshot_at) DO UPDATE SET
        value_number = EXCLUDED.value_number;
END;
$$;


ALTER FUNCTION public.refresh_kpi_snapshots(p_tenant_id text) OWNER TO postgres;

--
-- TOC entry 536 (class 1255 OID 43110)
-- Name: trg_update_po_total(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_update_po_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE mm_purchase_order 
  SET total_amount = (
    SELECT COALESCE(SUM(line_total_cents), 0)
    FROM mm_purchase_order_item 
    WHERE tenant_id = NEW.tenant_id
      AND mm_order  = NEW.mm_order
  )
  WHERE tenant_id = NEW.tenant_id
    AND mm_order  = NEW.mm_order;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trg_update_po_total() OWNER TO postgres;

--
-- TOC entry 538 (class 1255 OID 43450)
-- Name: trg_update_po_total_on_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_update_po_total_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE mm_purchase_order 
  SET total_amount = (
    SELECT COALESCE(SUM(line_total_cents), 0)
    FROM mm_purchase_order_item 
    WHERE tenant_id = OLD.tenant_id
      AND mm_order  = OLD.mm_order
  )
  WHERE tenant_id = OLD.tenant_id
    AND mm_order  = OLD.mm_order;

  RETURN OLD;
END;
$$;


ALTER FUNCTION public.trg_update_po_total_on_delete() OWNER TO postgres;

--
-- TOC entry 537 (class 1255 OID 43353)
-- Name: trg_validate_warehouse_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_validate_warehouse_default() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  pk_name text;
  pk_val  text;
  sql     text;
BEGIN
  -- Só atua quando a nova linha estiver marcando como default
  IF NEW.is_default IS DISTINCT FROM TRUE THEN
    RETURN NEW;
  END IF;

  -- Descobre o nome da coluna que é PK da tabela wh_warehouse
  SELECT a.attname
    INTO pk_name
  FROM pg_index i
  JOIN pg_attribute a
    ON a.attrelid = i.indrelid
   AND a.attnum  = ANY(i.indkey)
  WHERE i.indrelid = 'public.wh_warehouse'::regclass
    AND i.indisprimary
  LIMIT 1;

  IF pk_name IS NULL THEN
    RAISE EXCEPTION 'Primary key not found for table %', 'public.wh_warehouse';
  END IF;

  -- Lê dinamicamente o valor da PK da linha NEW
  EXECUTE format('SELECT ($1).%I::text', pk_name) INTO pk_val USING NEW;

  -- Desmarca os outros "default" do mesmo tenant
  sql := format($f$
      UPDATE public.wh_warehouse
         SET is_default = FALSE
       WHERE tenant_id = $1
         AND %I <> $2
  $f$, pk_name);

  EXECUTE sql USING NEW.tenant_id, pk_val;

  RETURN NEW;
END;
$_$;


ALTER FUNCTION public.trg_validate_warehouse_default() OWNER TO postgres;

--
-- TOC entry 528 (class 1255 OID 43070)
-- Name: update_inventory_balance(text, text, text, numeric, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update or insert inventory balance
    INSERT INTO wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty)
    VALUES (p_tenant_id, p_plant_id, p_mm_material, 
            CASE WHEN p_movement_type = 'IN' THEN p_qty_change ELSE 0 END,
            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change ELSE 0 END)
    ON CONFLICT (tenant_id, plant_id, mm_material) DO UPDATE SET
        on_hand_qty = wh_inventory_balance.on_hand_qty + 
            CASE WHEN p_movement_type = 'IN' THEN p_qty_change
                 WHEN p_movement_type = 'OUT' THEN -p_qty_change
                 ELSE 0 END,
        reserved_qty = wh_inventory_balance.reserved_qty + 
            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change
                 WHEN p_movement_type = 'RELEASE' THEN -p_qty_change
                 ELSE 0 END;
    
    -- Insert ledger entry
    INSERT INTO wh_inventory_ledger (tenant_id, plant_id, mm_material, movement, qty, ref_type, ref_id)
    VALUES (p_tenant_id, p_plant_id, p_mm_material, p_movement_type::movement_type, p_qty_change, 'MANUAL', 'SYSTEM');
END;
$$;


ALTER FUNCTION public.update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text) OWNER TO postgres;

--
-- TOC entry 532 (class 1255 OID 43077)
-- Name: update_sales_order_total(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_sales_order_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_total_cents INTEGER;
BEGIN
    -- Calculate total from all items
    SELECT COALESCE(SUM(line_total_cents), 0)
    INTO v_total_cents
    FROM sd_sales_order_item
    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);
    
    -- Update the sales order total
    UPDATE sd_sales_order
    SET total_cents = v_total_cents
    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION public.update_sales_order_total() OWNER TO postgres;

--
-- TOC entry 529 (class 1255 OID 43071)
-- Name: validate_warehouse_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_warehouse_default() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If setting is_default to true, ensure no other warehouse for this tenant is default
    IF NEW.is_default = TRUE THEN
        UPDATE wh_warehouse 
        SET is_default = FALSE 
        WHERE tenant_id = NEW.tenant_id 
          AND plant_id != NEW.plant_id 
          AND is_default = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.validate_warehouse_default() OWNER TO postgres;

--
-- TOC entry 507 (class 1255 OID 17194)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 513 (class 1255 OID 17274)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 509 (class 1255 OID 17206)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 505 (class 1255 OID 17155)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 504 (class 1255 OID 17150)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 508 (class 1255 OID 17202)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 510 (class 1255 OID 17214)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 503 (class 1255 OID 17149)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 512 (class 1255 OID 17273)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 502 (class 1255 OID 17147)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 506 (class 1255 OID 17183)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 511 (class 1255 OID 17267)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 517 (class 1255 OID 20059)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 498 (class 1255 OID 17058)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 518 (class 1255 OID 20060)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 521 (class 1255 OID 20063)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 527 (class 1255 OID 20078)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 495 (class 1255 OID 17032)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 494 (class 1255 OID 17029)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 493 (class 1255 OID 17028)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 514 (class 1255 OID 20041)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 515 (class 1255 OID 20057)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 516 (class 1255 OID 20058)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 525 (class 1255 OID 20076)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 500 (class 1255 OID 17097)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 499 (class 1255 OID 17060)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 520 (class 1255 OID 20062)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 526 (class 1255 OID 20077)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 501 (class 1255 OID 17113)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 519 (class 1255 OID 20061)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 496 (class 1255 OID 17047)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 524 (class 1255 OID 20074)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 523 (class 1255 OID 20073)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 522 (class 1255 OID 20068)
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 497 (class 1255 OID 17048)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 313 (class 1259 OID 16525)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 330 (class 1259 OID 16927)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 321 (class 1259 OID 16725)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 321
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 321
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 312 (class 1259 OID 16518)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 325 (class 1259 OID 16814)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 325
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 324 (class 1259 OID 16802)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 323 (class 1259 OID 16789)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 323
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 332 (class 1259 OID 17009)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 331 (class 1259 OID 16977)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 311 (class 1259 OID 16507)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 311
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 310 (class 1259 OID 16506)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 310
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 328 (class 1259 OID 16856)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 329 (class 1259 OID 16874)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 314 (class 1259 OID 16533)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 322 (class 1259 OID 16755)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 322
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 327 (class 1259 OID 16841)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 326 (class 1259 OID 16832)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 326
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 309 (class 1259 OID 16495)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 309
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 349 (class 1259 OID 42407)
-- Name: app_setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_setting (
    tenant_id text NOT NULL,
    key text NOT NULL,
    value text,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.app_setting OWNER TO postgres;

--
-- TOC entry 352 (class 1259 OID 42425)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    audit_id bigint NOT NULL,
    tenant_id text NOT NULL,
    table_name text NOT NULL,
    record_pk text NOT NULL,
    action text NOT NULL,
    diff_json jsonb,
    actor_user uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- TOC entry 351 (class 1259 OID 42424)
-- Name: audit_log_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_log_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_log_audit_id_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 351
-- Name: audit_log_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_log_audit_id_seq OWNED BY public.audit_log.audit_id;


--
-- TOC entry 377 (class 1259 OID 42721)
-- Name: co_cost_center; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_cost_center (
    tenant_id text NOT NULL,
    cc_id text NOT NULL,
    name text NOT NULL,
    parent_cc_id text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.co_cost_center OWNER TO postgres;

--
-- TOC entry 381 (class 1259 OID 42764)
-- Name: co_dashboard_tile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_dashboard_tile (
    tenant_id text NOT NULL,
    tile_id text NOT NULL,
    kpi_key text NOT NULL,
    title text NOT NULL,
    subtitle text,
    order_index integer DEFAULT 0,
    color text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.co_dashboard_tile OWNER TO postgres;

--
-- TOC entry 378 (class 1259 OID 42735)
-- Name: co_fiscal_period; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_fiscal_period (
    tenant_id text NOT NULL,
    period_id text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text DEFAULT 'open'::text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.co_fiscal_period OWNER TO postgres;

--
-- TOC entry 379 (class 1259 OID 42744)
-- Name: co_kpi_definition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_kpi_definition (
    tenant_id text NOT NULL,
    kpi_key text NOT NULL,
    name text NOT NULL,
    unit text,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.co_kpi_definition OWNER TO postgres;

--
-- TOC entry 380 (class 1259 OID 42752)
-- Name: co_kpi_snapshot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_kpi_snapshot (
    tenant_id text NOT NULL,
    kpi_key text NOT NULL,
    snapshot_at timestamp with time zone NOT NULL,
    value_number numeric,
    meta_json text
);


ALTER TABLE public.co_kpi_snapshot OWNER TO postgres;

--
-- TOC entry 404 (class 1259 OID 42974)
-- Name: co_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_setup (
    tenant_id text NOT NULL,
    timezone text DEFAULT 'America/Sao_Paulo'::text,
    kpi_refresh_cron text DEFAULT '0 */15 * * * *'::text
);


ALTER TABLE public.co_setup OWNER TO postgres;

--
-- TOC entry 364 (class 1259 OID 42544)
-- Name: crm_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_customer (
    tenant_id text NOT NULL,
    customer_id text NOT NULL,
    name text NOT NULL,
    email text,
    telefone text,
    customer_type public.customer_type DEFAULT 'PF'::public.customer_type,
    status text DEFAULT 'active'::text,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.crm_customer OWNER TO postgres;

--
-- TOC entry 372 (class 1259 OID 42641)
-- Name: crm_interaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_interaction (
    tenant_id text NOT NULL,
    interaction_id bigint NOT NULL,
    lead_id text NOT NULL,
    channel text NOT NULL,
    content text NOT NULL,
    sentiment text,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.crm_interaction OWNER TO postgres;

--
-- TOC entry 371 (class 1259 OID 42640)
-- Name: crm_interaction_interaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crm_interaction_interaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crm_interaction_interaction_id_seq OWNER TO postgres;

--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 371
-- Name: crm_interaction_interaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crm_interaction_interaction_id_seq OWNED BY public.crm_interaction.interaction_id;


--
-- TOC entry 369 (class 1259 OID 42616)
-- Name: crm_lead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_lead (
    tenant_id text NOT NULL,
    lead_id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    source text,
    status text DEFAULT 'novo'::text,
    score integer,
    owner_user uuid,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.crm_lead OWNER TO postgres;

--
-- TOC entry 398 (class 1259 OID 42922)
-- Name: crm_lead_status_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_lead_status_def (
    tenant_id text NOT NULL,
    status text NOT NULL,
    description text,
    order_index integer DEFAULT 0,
    is_final boolean DEFAULT false
);


ALTER TABLE public.crm_lead_status_def OWNER TO postgres;

--
-- TOC entry 399 (class 1259 OID 42931)
-- Name: crm_opp_stage_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_opp_stage_def (
    tenant_id text NOT NULL,
    stage text NOT NULL,
    description text,
    order_index integer DEFAULT 0,
    is_final boolean DEFAULT false
);


ALTER TABLE public.crm_opp_stage_def OWNER TO postgres;

--
-- TOC entry 370 (class 1259 OID 42625)
-- Name: crm_opportunity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_opportunity (
    tenant_id text NOT NULL,
    opp_id text NOT NULL,
    lead_id text NOT NULL,
    stage text DEFAULT 'discovery'::text,
    est_value_cents integer,
    probability integer,
    next_action_at date,
    status text DEFAULT 'active'::text,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.crm_opportunity OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 42905)
-- Name: crm_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_setup (
    tenant_id text NOT NULL,
    require_contact_info boolean DEFAULT true,
    auto_convert_on_first_order boolean DEFAULT false
);


ALTER TABLE public.crm_setup OWNER TO postgres;

--
-- TOC entry 397 (class 1259 OID 42914)
-- Name: crm_source_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_source_def (
    tenant_id text NOT NULL,
    source text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.crm_source_def OWNER TO postgres;

--
-- TOC entry 350 (class 1259 OID 42415)
-- Name: doc_numbering; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doc_numbering (
    tenant_id text NOT NULL,
    doc_type text NOT NULL,
    prefix text NOT NULL,
    format text NOT NULL,
    next_seq integer DEFAULT 1,
    is_active boolean DEFAULT true
);


ALTER TABLE public.doc_numbering OWNER TO postgres;

--
-- TOC entry 373 (class 1259 OID 42655)
-- Name: fi_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_account (
    tenant_id text NOT NULL,
    account_id text NOT NULL,
    name text NOT NULL,
    type public.account_type NOT NULL,
    currency text DEFAULT 'BRL'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fi_account OWNER TO postgres;

--
-- TOC entry 374 (class 1259 OID 42665)
-- Name: fi_invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_invoice (
    tenant_id text NOT NULL,
    invoice_id text NOT NULL,
    source_type text NOT NULL,
    source_id text NOT NULL,
    customer_id text,
    vendor_id text,
    amount_cents integer DEFAULT 0 NOT NULL,
    due_date date,
    status public.order_status DEFAULT 'pending'::public.order_status,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.fi_invoice OWNER TO postgres;

--
-- TOC entry 375 (class 1259 OID 42685)
-- Name: fi_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_payment (
    tenant_id text NOT NULL,
    payment_id text NOT NULL,
    invoice_id text NOT NULL,
    account_id text NOT NULL,
    amount_cents integer DEFAULT 0 NOT NULL,
    payment_date date DEFAULT CURRENT_DATE,
    method public.payment_method NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fi_payment OWNER TO postgres;

--
-- TOC entry 401 (class 1259 OID 42950)
-- Name: fi_payment_method_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_payment_method_def (
    tenant_id text NOT NULL,
    method text NOT NULL,
    display_name text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.fi_payment_method_def OWNER TO postgres;

--
-- TOC entry 402 (class 1259 OID 42958)
-- Name: fi_payment_terms_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_payment_terms_def (
    tenant_id text NOT NULL,
    terms_code text NOT NULL,
    description text,
    days integer NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.fi_payment_terms_def OWNER TO postgres;

--
-- TOC entry 400 (class 1259 OID 42940)
-- Name: fi_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_setup (
    tenant_id text NOT NULL,
    currency text DEFAULT 'BRL'::text,
    tax_inclusive boolean DEFAULT false,
    default_ar_account_id text,
    default_ap_account_id text,
    rounding_policy text DEFAULT 'bankers'::text
);


ALTER TABLE public.fi_setup OWNER TO postgres;

--
-- TOC entry 403 (class 1259 OID 42966)
-- Name: fi_tax_code_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_tax_code_def (
    tenant_id text NOT NULL,
    tax_code text NOT NULL,
    description text,
    rate_bp integer DEFAULT 0
);


ALTER TABLE public.fi_tax_code_def OWNER TO postgres;

--
-- TOC entry 376 (class 1259 OID 42706)
-- Name: fi_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fi_transaction (
    tenant_id text NOT NULL,
    transaction_id text NOT NULL,
    account_id text NOT NULL,
    type public.transaction_type NOT NULL,
    amount_cents integer DEFAULT 0 NOT NULL,
    ref_type text,
    ref_id text,
    date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fi_transaction OWNER TO postgres;

--
-- TOC entry 406 (class 1259 OID 42984)
-- Name: import_job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_job (
    tenant_id text NOT NULL,
    job_id bigint NOT NULL,
    job_type text NOT NULL,
    status text DEFAULT 'pending'::text,
    total_records integer DEFAULT 0,
    processed_records integer DEFAULT 0,
    error_records integer DEFAULT 0,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.import_job OWNER TO postgres;

--
-- TOC entry 405 (class 1259 OID 42983)
-- Name: import_job_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.import_job_job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_job_job_id_seq OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 405
-- Name: import_job_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.import_job_job_id_seq OWNED BY public.import_job.job_id;


--
-- TOC entry 408 (class 1259 OID 42998)
-- Name: import_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_log (
    tenant_id text NOT NULL,
    log_id bigint NOT NULL,
    job_id bigint NOT NULL,
    record_number integer,
    status text NOT NULL,
    error_message text,
    data_json jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.import_log OWNER TO postgres;

--
-- TOC entry 407 (class 1259 OID 42997)
-- Name: import_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.import_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_log_log_id_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 407
-- Name: import_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.import_log_log_id_seq OWNED BY public.import_log.log_id;


--
-- TOC entry 383 (class 1259 OID 42793)
-- Name: mm_category_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_category_def (
    tenant_id text NOT NULL,
    category text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.mm_category_def OWNER TO postgres;

--
-- TOC entry 384 (class 1259 OID 42801)
-- Name: mm_classification_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_classification_def (
    tenant_id text NOT NULL,
    classification text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.mm_classification_def OWNER TO postgres;

--
-- TOC entry 386 (class 1259 OID 42817)
-- Name: mm_currency_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_currency_def (
    tenant_id text NOT NULL,
    currency text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.mm_currency_def OWNER TO postgres;

--
-- TOC entry 354 (class 1259 OID 42442)
-- Name: mm_material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_material (
    tenant_id text NOT NULL,
    mm_material text NOT NULL,
    mm_comercial text,
    mm_desc text NOT NULL,
    mm_mat_type public.material_type,
    mm_mat_class public.material_class,
    mm_price_cents integer DEFAULT 0,
    barcode text,
    weight_grams integer,
    status text DEFAULT 'active'::text,
    mm_pur_link text,
    mm_vendor_id text,
    created_at timestamp with time zone DEFAULT now(),
    commercial_name text,
    unit_of_measure text DEFAULT 'unidade'::text,
    dimensions text,
    purity text,
    color text,
    finish text,
    min_stock integer DEFAULT 0,
    max_stock integer DEFAULT 1000,
    lead_time_days integer DEFAULT 7
);


ALTER TABLE public.mm_material OWNER TO postgres;

--
-- TOC entry 385 (class 1259 OID 42809)
-- Name: mm_price_channel_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_price_channel_def (
    tenant_id text NOT NULL,
    channel text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.mm_price_channel_def OWNER TO postgres;

--
-- TOC entry 355 (class 1259 OID 42457)
-- Name: mm_purchase_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_purchase_order (
    tenant_id text NOT NULL,
    mm_order text NOT NULL,
    vendor_id text NOT NULL,
    status public.order_status DEFAULT 'draft'::public.order_status,
    po_date date DEFAULT CURRENT_DATE,
    expected_delivery date,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    total_amount bigint DEFAULT 0,
    currency text DEFAULT 'BRL'::text
);


ALTER TABLE public.mm_purchase_order OWNER TO postgres;

--
-- TOC entry 357 (class 1259 OID 42473)
-- Name: mm_purchase_order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_purchase_order_item (
    tenant_id text NOT NULL,
    po_item_id bigint NOT NULL,
    mm_order text NOT NULL,
    plant_id text NOT NULL,
    mm_material text NOT NULL,
    mm_qtt numeric DEFAULT 0 NOT NULL,
    unit_cost_cents integer DEFAULT 0 NOT NULL,
    line_total_cents integer DEFAULT 0 NOT NULL,
    notes text,
    currency text DEFAULT 'BRL'::text
);


ALTER TABLE public.mm_purchase_order_item OWNER TO postgres;

--
-- TOC entry 356 (class 1259 OID 42472)
-- Name: mm_purchase_order_item_po_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mm_purchase_order_item_po_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mm_purchase_order_item_po_item_id_seq OWNER TO postgres;

--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 356
-- Name: mm_purchase_order_item_po_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mm_purchase_order_item_po_item_id_seq OWNED BY public.mm_purchase_order_item.po_item_id;


--
-- TOC entry 359 (class 1259 OID 42495)
-- Name: mm_receiving; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_receiving (
    tenant_id text NOT NULL,
    recv_id bigint NOT NULL,
    mm_order text NOT NULL,
    plant_id text NOT NULL,
    mm_material text NOT NULL,
    qty_received numeric DEFAULT 0 NOT NULL,
    received_at timestamp with time zone DEFAULT now(),
    received_by text,
    status text DEFAULT 'received'::text,
    notes text
);


ALTER TABLE public.mm_receiving OWNER TO postgres;

--
-- TOC entry 358 (class 1259 OID 42494)
-- Name: mm_receiving_recv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mm_receiving_recv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mm_receiving_recv_id_seq OWNER TO postgres;

--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 358
-- Name: mm_receiving_recv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mm_receiving_recv_id_seq OWNED BY public.mm_receiving.recv_id;


--
-- TOC entry 382 (class 1259 OID 42780)
-- Name: mm_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_setup (
    tenant_id text NOT NULL,
    default_payment_terms integer DEFAULT 30,
    default_currency text DEFAULT 'BRL'::text,
    default_wh_id text,
    require_mat_type boolean DEFAULT true,
    require_mat_class boolean DEFAULT true,
    allow_zero_price boolean DEFAULT false,
    default_uom text DEFAULT 'UN'::text
);


ALTER TABLE public.mm_setup OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 42833)
-- Name: mm_status_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_status_def (
    tenant_id text NOT NULL,
    object_type text NOT NULL,
    status text NOT NULL,
    description text,
    is_final boolean DEFAULT false,
    order_index integer DEFAULT 0
);


ALTER TABLE public.mm_status_def OWNER TO postgres;

--
-- TOC entry 353 (class 1259 OID 42434)
-- Name: mm_vendor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_vendor (
    tenant_id text NOT NULL,
    vendor_id text NOT NULL,
    vendor_name text NOT NULL,
    email text,
    telefone text,
    cidade text,
    estado text,
    vendor_rating text,
    created_at timestamp with time zone DEFAULT now(),
    contact_person text,
    address text,
    city text,
    state text,
    zip_code text,
    country text DEFAULT 'Brasil'::text,
    tax_id text,
    payment_terms integer DEFAULT 30,
    rating text DEFAULT 'B'::text,
    status text DEFAULT 'active'::text
);


ALTER TABLE public.mm_vendor OWNER TO postgres;

--
-- TOC entry 387 (class 1259 OID 42825)
-- Name: mm_vendor_rating_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mm_vendor_rating_def (
    tenant_id text NOT NULL,
    rating text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.mm_vendor_rating_def OWNER TO postgres;

--
-- TOC entry 348 (class 1259 OID 42399)
-- Name: role_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permission (
    tenant_id text NOT NULL,
    role public.user_role NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    allowed boolean DEFAULT false
);


ALTER TABLE public.role_permission OWNER TO postgres;

--
-- TOC entry 394 (class 1259 OID 42889)
-- Name: sd_carrier_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_carrier_def (
    tenant_id text NOT NULL,
    carrier_code text NOT NULL,
    carrier_name text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.sd_carrier_def OWNER TO postgres;

--
-- TOC entry 395 (class 1259 OID 42897)
-- Name: sd_channel_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_channel_def (
    tenant_id text NOT NULL,
    channel text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.sd_channel_def OWNER TO postgres;

--
-- TOC entry 392 (class 1259 OID 42871)
-- Name: sd_order_status_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_order_status_def (
    tenant_id text NOT NULL,
    status text NOT NULL,
    description text,
    is_final boolean DEFAULT false,
    order_index integer DEFAULT 0
);


ALTER TABLE public.sd_order_status_def OWNER TO postgres;

--
-- TOC entry 368 (class 1259 OID 42600)
-- Name: sd_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_payment (
    tenant_id text NOT NULL,
    payment_id text NOT NULL,
    so_id text NOT NULL,
    amount_cents integer DEFAULT 0 NOT NULL,
    payment_date date DEFAULT CURRENT_DATE,
    payment_method public.payment_method NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sd_payment OWNER TO postgres;

--
-- TOC entry 365 (class 1259 OID 42554)
-- Name: sd_sales_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_sales_order (
    tenant_id text NOT NULL,
    so_id text NOT NULL,
    customer_id text NOT NULL,
    status public.order_status DEFAULT 'draft'::public.order_status,
    order_date date DEFAULT CURRENT_DATE,
    expected_ship date,
    total_cents integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sd_sales_order OWNER TO postgres;

--
-- TOC entry 366 (class 1259 OID 42570)
-- Name: sd_sales_order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_sales_order_item (
    tenant_id text NOT NULL,
    so_id text NOT NULL,
    sku text NOT NULL,
    quantity numeric DEFAULT 0 NOT NULL,
    unit_price_cents integer DEFAULT 0 NOT NULL,
    line_total_cents integer DEFAULT 0 NOT NULL,
    row_no integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.sd_sales_order_item OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 42860)
-- Name: sd_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_setup (
    tenant_id text NOT NULL,
    backorder_policy text DEFAULT 'block'::text,
    pricing_mode text DEFAULT 'material'::text,
    default_channel text DEFAULT 'site'::text,
    auto_reserve_on_confirm boolean DEFAULT true
);


ALTER TABLE public.sd_setup OWNER TO postgres;

--
-- TOC entry 367 (class 1259 OID 42586)
-- Name: sd_shipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_shipment (
    tenant_id text NOT NULL,
    shipment_id text NOT NULL,
    so_id text NOT NULL,
    warehouse_id text NOT NULL,
    ship_date date,
    status public.order_status DEFAULT 'pending'::public.order_status,
    carrier text,
    tracking_code text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sd_shipment OWNER TO postgres;

--
-- TOC entry 393 (class 1259 OID 42880)
-- Name: sd_shipment_status_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_shipment_status_def (
    tenant_id text NOT NULL,
    status text NOT NULL,
    description text,
    is_final boolean DEFAULT false,
    order_index integer DEFAULT 0
);


ALTER TABLE public.sd_shipment_status_def OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 42379)
-- Name: tenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant (
    tenant_id text NOT NULL,
    display_name text NOT NULL,
    locale text DEFAULT 'pt-BR'::text,
    timezone text DEFAULT 'America/Sao_Paulo'::text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tenant OWNER TO postgres;

--
-- TOC entry 347 (class 1259 OID 42389)
-- Name: user_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profile (
    tenant_id text NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_profile OWNER TO postgres;

--
-- TOC entry 361 (class 1259 OID 42525)
-- Name: wh_inventory_balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_inventory_balance (
    tenant_id text NOT NULL,
    plant_id text NOT NULL,
    mm_material text NOT NULL,
    on_hand_qty numeric DEFAULT 0,
    reserved_qty numeric DEFAULT 0,
    last_count_date date,
    status text DEFAULT 'active'::text
);


ALTER TABLE public.wh_inventory_balance OWNER TO postgres;

--
-- TOC entry 409 (class 1259 OID 43536)
-- Name: v_material_overview; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_material_overview AS
 WITH po_items AS (
         SELECT mm_purchase_order_item.tenant_id,
            mm_purchase_order_item.mm_material,
            sum(mm_purchase_order_item.mm_qtt) AS total_qty_ordered,
            sum(mm_purchase_order_item.line_total_cents) AS total_cost_cents,
            (round(((NULLIF(sum(mm_purchase_order_item.line_total_cents), 0))::numeric / NULLIF(sum(mm_purchase_order_item.mm_qtt), (0)::numeric)), 0))::integer AS avg_unit_cost_cents,
            max(mm_purchase_order_item.unit_cost_cents) AS latest_unit_cost_guess
           FROM public.mm_purchase_order_item
          GROUP BY mm_purchase_order_item.tenant_id, mm_purchase_order_item.mm_material
        ), recv AS (
         SELECT mm_receiving.tenant_id,
            mm_receiving.mm_material,
            sum(mm_receiving.qty_received) AS total_qty_received,
            max(mm_receiving.received_at) AS last_received_at
           FROM public.mm_receiving
          GROUP BY mm_receiving.tenant_id, mm_receiving.mm_material
        ), stock AS (
         SELECT wh_inventory_balance.tenant_id,
            wh_inventory_balance.mm_material,
            sum(wh_inventory_balance.on_hand_qty) AS on_hand_qty
           FROM public.wh_inventory_balance
          GROUP BY wh_inventory_balance.tenant_id, wh_inventory_balance.mm_material
        )
 SELECT m.tenant_id,
    m.mm_material AS sku,
    m.mm_comercial,
    m.mm_mat_type,
    m.mm_mat_class,
    m.mm_price_cents AS sales_price_cents,
    p.avg_unit_cost_cents,
    p.latest_unit_cost_guess,
    p.total_qty_ordered,
    r.total_qty_received,
    s.on_hand_qty,
    r.last_received_at
   FROM (((public.mm_material m
     LEFT JOIN po_items p USING (tenant_id, mm_material))
     LEFT JOIN recv r USING (tenant_id, mm_material))
     LEFT JOIN stock s USING (tenant_id, mm_material));


ALTER VIEW public.v_material_overview OWNER TO postgres;

--
-- TOC entry 363 (class 1259 OID 42535)
-- Name: wh_inventory_ledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_inventory_ledger (
    ledger_id bigint NOT NULL,
    tenant_id text NOT NULL,
    plant_id text NOT NULL,
    mm_material text NOT NULL,
    movement public.movement_type NOT NULL,
    qty numeric NOT NULL,
    ref_type text,
    ref_id text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.wh_inventory_ledger OWNER TO postgres;

--
-- TOC entry 362 (class 1259 OID 42534)
-- Name: wh_inventory_ledger_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wh_inventory_ledger_ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wh_inventory_ledger_ledger_id_seq OWNER TO postgres;

--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 362
-- Name: wh_inventory_ledger_ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wh_inventory_ledger_ledger_id_seq OWNED BY public.wh_inventory_ledger.ledger_id;


--
-- TOC entry 390 (class 1259 OID 42852)
-- Name: wh_inventory_status_def; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_inventory_status_def (
    tenant_id text NOT NULL,
    status text NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.wh_inventory_status_def OWNER TO postgres;

--
-- TOC entry 389 (class 1259 OID 42842)
-- Name: wh_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_setup (
    tenant_id text NOT NULL,
    default_plant_id text,
    reserve_policy text DEFAULT 'no_backorder'::text,
    negative_stock_allowed boolean DEFAULT false,
    picking_strategy text DEFAULT 'fifo'::text
);


ALTER TABLE public.wh_setup OWNER TO postgres;

--
-- TOC entry 360 (class 1259 OID 42515)
-- Name: wh_warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_warehouse (
    tenant_id text NOT NULL,
    plant_id text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    address text,
    city text,
    state text,
    zip_code text,
    country text DEFAULT 'Brasil'::text,
    contact_person text,
    phone text,
    email text
);


ALTER TABLE public.wh_warehouse OWNER TO postgres;

--
-- TOC entry 341 (class 1259 OID 17277)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 333 (class 1259 OID 17025)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 338 (class 1259 OID 17135)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 337 (class 1259 OID 17134)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 315 (class 1259 OID 16546)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 315
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 343 (class 1259 OID 20086)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 317 (class 1259 OID 16588)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 316 (class 1259 OID 16561)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 316
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 342 (class 1259 OID 20042)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- TOC entry 334 (class 1259 OID 17062)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 335 (class 1259 OID 17076)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 344 (class 1259 OID 20102)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- TOC entry 345 (class 1259 OID 20109)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- TOC entry 3886 (class 2604 OID 16510)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3939 (class 2604 OID 42428)
-- Name: audit_log audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_log_audit_id_seq'::regclass);


--
-- TOC entry 3997 (class 2604 OID 42644)
-- Name: crm_interaction interaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_interaction ALTER COLUMN interaction_id SET DEFAULT nextval('public.crm_interaction_interaction_id_seq'::regclass);


--
-- TOC entry 4062 (class 2604 OID 42987)
-- Name: import_job job_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_job ALTER COLUMN job_id SET DEFAULT nextval('public.import_job_job_id_seq'::regclass);


--
-- TOC entry 4068 (class 2604 OID 43001)
-- Name: import_log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log ALTER COLUMN log_id SET DEFAULT nextval('public.import_log_log_id_seq'::regclass);


--
-- TOC entry 3958 (class 2604 OID 42476)
-- Name: mm_purchase_order_item po_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order_item ALTER COLUMN po_item_id SET DEFAULT nextval('public.mm_purchase_order_item_po_item_id_seq'::regclass);


--
-- TOC entry 3963 (class 2604 OID 42498)
-- Name: mm_receiving recv_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_receiving ALTER COLUMN recv_id SET DEFAULT nextval('public.mm_receiving_recv_id_seq'::regclass);


--
-- TOC entry 3973 (class 2604 OID 42538)
-- Name: wh_inventory_ledger ledger_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_inventory_ledger ALTER COLUMN ledger_id SET DEFAULT nextval('public.wh_inventory_ledger_ledger_id_seq'::regclass);


--
-- TOC entry 4900 (class 0 OID 16525)
-- Dependencies: 313
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	5be6bb6f-ccb4-4175-b10b-1127678ccd66	{"action":"user_signedup","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-09-17 16:42:01.675109+00	
00000000-0000-0000-0000-000000000000	39c3572a-b497-4d86-a65a-d013db446c55	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 18:32:56.356224+00	
00000000-0000-0000-0000-000000000000	8558790a-ef3e-4345-ad39-cfdb5f7a7916	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 18:32:56.377106+00	
00000000-0000-0000-0000-000000000000	8ea2b88f-f37f-464f-bffb-a8f1df6a8edd	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 20:42:06.927741+00	
00000000-0000-0000-0000-000000000000	9a67a2b5-19f6-4682-998f-4e5bd86c81ee	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 20:42:06.940714+00	
00000000-0000-0000-0000-000000000000	3976e61e-ceb7-4987-bc9f-d2e3da3ec891	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 06:16:20.923212+00	
00000000-0000-0000-0000-000000000000	8d5a29dd-de3a-45ca-8fff-3fa87e766809	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 06:16:20.960084+00	
00000000-0000-0000-0000-000000000000	c9bb3687-def1-4657-883e-4272c3b605d4	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 07:22:02.295275+00	
00000000-0000-0000-0000-000000000000	624b8839-1fa5-44e5-ae46-974b6b290256	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 07:22:02.302862+00	
00000000-0000-0000-0000-000000000000	4291e1bf-abac-4a3b-b308-9d6978d65340	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 08:34:03.76009+00	
00000000-0000-0000-0000-000000000000	d023763e-d4f2-4c96-8d96-f189b606ff0a	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 08:34:03.786675+00	
00000000-0000-0000-0000-000000000000	78e2bb28-4bba-4aa0-bec6-27ecab9b23c1	{"action":"token_refreshed","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 09:36:26.737577+00	
00000000-0000-0000-0000-000000000000	3078bcad-dfd0-4ea2-8b1c-068815487c60	{"action":"token_revoked","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-18 09:36:26.755552+00	
00000000-0000-0000-0000-000000000000	3bcdba70-951e-477d-b491-5c38ac623d9f	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 19:25:30.328745+00	
00000000-0000-0000-0000-000000000000	95f2ae69-6b46-46bd-9829-2ec54b581878	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 19:26:39.625453+00	
00000000-0000-0000-0000-000000000000	5e4aff8c-8523-44c4-a92b-ace88e9d56b4	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 19:27:53.631885+00	
00000000-0000-0000-0000-000000000000	148a6b07-66c0-4e28-b6b7-66d772941230	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 20:15:08.524303+00	
00000000-0000-0000-0000-000000000000	336dc173-213d-4657-9903-9cac87146867	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 20:27:40.139267+00	
00000000-0000-0000-0000-000000000000	04df343a-0faf-4d01-b7c7-f5ad73060ef0	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-18 20:28:28.444749+00	
00000000-0000-0000-0000-000000000000	85173b76-d4f3-422e-bf8f-f17b54f5da75	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 05:27:57.861177+00	
00000000-0000-0000-0000-000000000000	951c3121-8a41-46fd-8487-070aa7834faf	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 06:05:37.364465+00	
00000000-0000-0000-0000-000000000000	12819266-92ad-4c11-9693-7e78f8e55b2d	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 06:07:56.490468+00	
00000000-0000-0000-0000-000000000000	dc9ce61b-f5c5-4c6b-a039-537886433455	{"action":"user_signedup","actor_id":"d95b59ee-d2e9-4beb-b280-acb47271caa6","actor_name":"La Plata Lunaria","actor_username":"laplatalunaria@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-09-19 06:09:03.40593+00	
00000000-0000-0000-0000-000000000000	e9da659a-c636-4fc8-969a-f19a21fa3968	{"action":"login","actor_id":"d95b59ee-d2e9-4beb-b280-acb47271caa6","actor_name":"La Plata Lunaria","actor_username":"laplatalunaria@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 06:09:11.891193+00	
00000000-0000-0000-0000-000000000000	7a186835-4603-4192-889b-6d9e13c3a689	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 06:22:34.118496+00	
00000000-0000-0000-0000-000000000000	974265cc-d61f-47d0-8c70-721fa591a6be	{"action":"user_signedup","actor_id":"41d9c9b3-1160-4d1c-b984-a87efbe9b1b3","actor_name":"Rodrigo Gomes","actor_username":"rodrigo.g.seabra@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}	2025-09-19 06:26:00.484252+00	
00000000-0000-0000-0000-000000000000	7b92b240-8c66-4577-ac0f-239127be7d1c	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 07:52:56.766207+00	
00000000-0000-0000-0000-000000000000	8c12ec94-cd97-4eb3-8608-9a1092ce67a6	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 08:36:46.540559+00	
00000000-0000-0000-0000-000000000000	9751adca-6b4f-40df-86fc-90fd3d18af8b	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 08:44:24.669571+00	
00000000-0000-0000-0000-000000000000	53f8022d-e8cb-47bd-b1ec-b9b05aadc14e	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 08:51:55.467562+00	
00000000-0000-0000-0000-000000000000	110589ed-7ab3-499c-a26b-6cef7a1da39c	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 08:53:05.890276+00	
00000000-0000-0000-0000-000000000000	01838937-2df8-46b2-aca8-89f2cc79d062	{"action":"login","actor_id":"d95b59ee-d2e9-4beb-b280-acb47271caa6","actor_name":"La Plata Lunaria","actor_username":"laplatalunaria@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 08:56:43.472435+00	
00000000-0000-0000-0000-000000000000	c3b8001b-9188-4cc2-b9e4-6bcb361afba1	{"action":"logout","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-19 09:03:25.446643+00	
00000000-0000-0000-0000-000000000000	7574abc0-9434-4266-8743-56afc61683fc	{"action":"login","actor_id":"469e7d8c-3439-4423-82df-d89a8b80f1ee","actor_name":"Grupo Galpão Hub","actor_username":"grupogalpaohub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}	2025-09-19 09:03:32.604345+00	
\.


--
-- TOC entry 4914 (class 0 OID 16927)
-- Dependencies: 330
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
789d27e9-d16c-457c-ae24-bf6388e023a7	469e7d8c-3439-4423-82df-d89a8b80f1ee	29910286-b4bd-456e-9cd5-4bf977127fa6	s256	cVgZCUexCn3TU4y2k7cm5-2ooDwPFaGJu-yevE_WuWA	google	ya29.a0AQQ_BDQoYY8kXzm_DyOsAQOdTwMLKBV1XTSS7DPYv8gQvgVe1b3Bj7i-aZuWFFxOZLW6SNe0RE0MG_kNH6KmgeNe7H7z1TEu0pqznIhA3HZkxFNPihbiFoEsCmnqojjOg7AbAk4n5eo4mE0SZVTjKxThLwkA7UlvFTsf2XrKw9PKNvTNYKwrDE9G2kqqR4fxDiTaX8_VaCgYKAUcSARYSFQHGX2MiKwyRRdfohvrIU8yenCg-vw0207		2025-09-19 05:27:54.462655+00	2025-09-19 05:27:57.874349+00	oauth	2025-09-19 05:27:57.874286+00
c42f0f02-8069-4d4a-af73-dfbef583316b	469e7d8c-3439-4423-82df-d89a8b80f1ee	d5cfcee1-6645-4875-82bb-17b38c925853	s256	y-VlXYYjw9fU1Bk3KNzf04FvFAgCnC94qWNbzZ1AC1c	google	ya29.a0AQQ_BDRGmyaFqR5CS7S7_sN6629J12J6ESV9YnVTk6aLMj2k6EEhXRAz6IenPkbW6oStUS9GwF6GM8_5C3BPNGul6qYrU4ecZnA0seXMMmqCswkIEVrBESsAxzkQDmx-lp7z6h0t7SZUEov_qgbr-YhbMfp1LfiK5AYn37Z2AsRngTpUdzy2sQ8rsW5dlUvpkyFqmqlTaCgYKAVMSARYSFQHGX2MiSpPltcEv_enVxTnQubJKiQ0207		2025-09-19 06:22:30.739568+00	2025-09-19 06:22:34.121708+00	oauth	2025-09-19 06:22:34.121653+00
85a87e09-44c8-48d1-af68-3eabb0cae204	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	72b7d997-e2ee-4dc7-ade3-4962d7caf043	s256	zRw8n-o9U8T2oZYKer2PurhVNdd-_TZclsW-ih4cnus	google	ya29.a0AQQ_BDSx4P6Ka2JQN7HKVz5863sSo2zfrseR8VOL_mI8460LeIHc-YuTYzVS-H9kH7q-oVy6njXfZ0udB052T-sgOLHsdsefGr141r21WEKQqspqB2ct0FygWnQB3Difc9Sbo6gz4d4EF9oAbxoOupT3pgNbdx6v90IabRc08a-ZXSlJHp0iFroNoSP7B6G6CBUuGNcaCgYKAWASARISFQHGX2MiMRYg2xMhHPwkWIO3hLAIAQ0206		2025-09-19 06:25:33.180085+00	2025-09-19 06:26:00.493687+00	oauth	2025-09-19 06:26:00.49364+00
\.


--
-- TOC entry 4905 (class 0 OID 16725)
-- Dependencies: 321
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
101048769697429146013	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	{"iss": "https://accounts.google.com", "sub": "101048769697429146013", "name": "Rodrigo Gomes", "email": "rodrigo.g.seabra@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "full_name": "Rodrigo Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "provider_id": "101048769697429146013", "email_verified": true, "phone_verified": false}	google	2025-09-19 06:26:00.470924+00	2025-09-19 06:26:00.470982+00	2025-09-19 06:26:00.470982+00	0cb5ed10-0817-487c-80b6-afb14f24486e
112328035603960513181	d95b59ee-d2e9-4beb-b280-acb47271caa6	{"iss": "https://accounts.google.com", "sub": "112328035603960513181", "name": "La Plata Lunaria", "email": "laplatalunaria@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "full_name": "La Plata Lunaria", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "provider_id": "112328035603960513181", "email_verified": true, "phone_verified": false}	google	2025-09-19 06:09:03.402496+00	2025-09-19 06:09:03.402548+00	2025-09-19 08:56:43.469086+00	98c821a1-ecc4-4748-b96a-2155d92aefee
112058218087376291100	469e7d8c-3439-4423-82df-d89a8b80f1ee	{"iss": "https://accounts.google.com", "sub": "112058218087376291100", "name": "Grupo Galpão Hub", "email": "grupogalpaohub@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "full_name": "Grupo Galpão Hub", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "provider_id": "112058218087376291100", "email_verified": true, "phone_verified": false}	google	2025-09-17 16:42:01.662653+00	2025-09-17 16:42:01.662713+00	2025-09-19 09:03:32.598945+00	6f01b0cf-90a0-4d85-8fa4-3228000875c3
\.


--
-- TOC entry 4899 (class 0 OID 16518)
-- Dependencies: 312
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4909 (class 0 OID 16814)
-- Dependencies: 325
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
c1b46232-8ef2-44a3-9098-005786510a22	2025-09-19 06:09:03.419832+00	2025-09-19 06:09:03.419832+00	oauth	5f85fd88-8c08-4db9-8489-31d431125a69
aa2ae3fa-44ad-48c2-8875-7761f48e28f6	2025-09-19 06:09:11.893874+00	2025-09-19 06:09:11.893874+00	oauth	121d465a-3b57-4e21-b655-ed572bb79a30
c525c3f4-920f-4468-846b-40b102129ca0	2025-09-19 08:56:43.47799+00	2025-09-19 08:56:43.47799+00	oauth	596ca9aa-9015-4f23-a9b1-e3597a23c948
e63a2a4b-4947-4da4-9f91-a04b09d955de	2025-09-19 09:03:32.612248+00	2025-09-19 09:03:32.612248+00	oauth	024b4ef2-3398-46fa-a4a4-00b5ab6cba3a
\.


--
-- TOC entry 4908 (class 0 OID 16802)
-- Dependencies: 324
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4907 (class 0 OID 16789)
-- Dependencies: 323
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- TOC entry 4916 (class 0 OID 17009)
-- Dependencies: 332
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4915 (class 0 OID 16977)
-- Dependencies: 331
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4898 (class 0 OID 16507)
-- Dependencies: 311
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	17	6pjns5eibtnl	d95b59ee-d2e9-4beb-b280-acb47271caa6	f	2025-09-19 06:09:03.417828+00	2025-09-19 06:09:03.417828+00	\N	c1b46232-8ef2-44a3-9098-005786510a22
00000000-0000-0000-0000-000000000000	18	67f4iuoo74je	d95b59ee-d2e9-4beb-b280-acb47271caa6	f	2025-09-19 06:09:11.892646+00	2025-09-19 06:09:11.892646+00	\N	aa2ae3fa-44ad-48c2-8875-7761f48e28f6
00000000-0000-0000-0000-000000000000	24	p5kfse4ka3hi	d95b59ee-d2e9-4beb-b280-acb47271caa6	f	2025-09-19 08:56:43.474954+00	2025-09-19 08:56:43.474954+00	\N	c525c3f4-920f-4468-846b-40b102129ca0
00000000-0000-0000-0000-000000000000	25	add4sru2yvia	469e7d8c-3439-4423-82df-d89a8b80f1ee	f	2025-09-19 09:03:32.607643+00	2025-09-19 09:03:32.607643+00	\N	e63a2a4b-4947-4da4-9f91-a04b09d955de
\.


--
-- TOC entry 4912 (class 0 OID 16856)
-- Dependencies: 328
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4913 (class 0 OID 16874)
-- Dependencies: 329
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4901 (class 0 OID 16533)
-- Dependencies: 314
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- TOC entry 4906 (class 0 OID 16755)
-- Dependencies: 322
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
c1b46232-8ef2-44a3-9098-005786510a22	d95b59ee-d2e9-4beb-b280-acb47271caa6	2025-09-19 06:09:03.415543+00	2025-09-19 06:09:03.415543+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	194.156.44.62	\N
aa2ae3fa-44ad-48c2-8875-7761f48e28f6	d95b59ee-d2e9-4beb-b280-acb47271caa6	2025-09-19 06:09:11.891978+00	2025-09-19 06:09:11.891978+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	194.156.44.62	\N
c525c3f4-920f-4468-846b-40b102129ca0	d95b59ee-d2e9-4beb-b280-acb47271caa6	2025-09-19 08:56:43.473326+00	2025-09-19 08:56:43.473326+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	194.156.44.62	\N
e63a2a4b-4947-4da4-9f91-a04b09d955de	469e7d8c-3439-4423-82df-d89a8b80f1ee	2025-09-19 09:03:32.604992+00	2025-09-19 09:03:32.604992+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	194.156.44.62	\N
\.


--
-- TOC entry 4911 (class 0 OID 16841)
-- Dependencies: 327
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4910 (class 0 OID 16832)
-- Dependencies: 326
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4896 (class 0 OID 16495)
-- Dependencies: 309
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	469e7d8c-3439-4423-82df-d89a8b80f1ee	authenticated	authenticated	grupogalpaohub@gmail.com	\N	2025-09-17 16:42:01.684878+00	\N		\N		\N			\N	2025-09-19 09:03:32.604924+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112058218087376291100", "name": "Grupo Galpão Hub", "email": "grupogalpaohub@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "full_name": "Grupo Galpão Hub", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "provider_id": "112058218087376291100", "email_verified": true, "phone_verified": false}	\N	2025-09-17 16:42:01.608625+00	2025-09-19 09:03:32.611671+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	authenticated	authenticated	rodrigo.g.seabra@gmail.com	\N	2025-09-19 06:26:00.487785+00	\N		\N		\N			\N	\N	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "101048769697429146013", "name": "Rodrigo Gomes", "email": "rodrigo.g.seabra@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "full_name": "Rodrigo Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "provider_id": "101048769697429146013", "email_verified": true, "phone_verified": false}	\N	2025-09-19 06:26:00.450462+00	2025-09-19 06:26:00.489273+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d95b59ee-d2e9-4beb-b280-acb47271caa6	authenticated	authenticated	laplatalunaria@gmail.com	\N	2025-09-19 06:09:03.408074+00	\N		\N		\N			\N	2025-09-19 08:56:43.473254+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112328035603960513181", "name": "La Plata Lunaria", "email": "laplatalunaria@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "full_name": "La Plata Lunaria", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "provider_id": "112328035603960513181", "email_verified": true, "phone_verified": false}	\N	2025-09-19 06:09:03.384287+00	2025-09-19 08:56:43.477474+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4929 (class 0 OID 42407)
-- Dependencies: 349
-- Data for Name: app_setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_setting (tenant_id, key, value, updated_at) FROM stdin;
\.


--
-- TOC entry 4932 (class 0 OID 42425)
-- Dependencies: 352
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (audit_id, tenant_id, table_name, record_pk, action, diff_json, actor_user, created_at) FROM stdin;
\.


--
-- TOC entry 4957 (class 0 OID 42721)
-- Dependencies: 377
-- Data for Name: co_cost_center; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_cost_center (tenant_id, cc_id, name, parent_cc_id, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4961 (class 0 OID 42764)
-- Dependencies: 381
-- Data for Name: co_dashboard_tile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_dashboard_tile (tenant_id, tile_id, kpi_key, title, subtitle, order_index, color, is_active, created_at) FROM stdin;
LaplataLunaria	TILE01	SALES_TODAY	Vendas Hoje	Resumo diário	1	#4CAF50	t	2025-09-18 06:25:50.843452+00
LaplataLunaria	TILE02	ORDERS_OPEN	Pedidos Abertos	Situação comercial	2	#2196F3	t	2025-09-18 06:25:50.843452+00
LaplataLunaria	TILE03	INVENTORY_VALUE	Valor do Estoque	Resumo logístico	3	#FFC107	t	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4958 (class 0 OID 42735)
-- Dependencies: 378
-- Data for Name: co_fiscal_period; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_fiscal_period (tenant_id, period_id, start_date, end_date, status, created_at) FROM stdin;
\.


--
-- TOC entry 4959 (class 0 OID 42744)
-- Dependencies: 379
-- Data for Name: co_kpi_definition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_kpi_definition (tenant_id, kpi_key, name, unit, description, created_at) FROM stdin;
LaplataLunaria	SALES_TODAY	Vendas Hoje	BRL	Total de vendas do dia	2025-09-18 06:25:50.843452+00
LaplataLunaria	ORDERS_OPEN	Pedidos Abertos	Qtd	Número de pedidos em aberto	2025-09-18 06:25:50.843452+00
LaplataLunaria	INVENTORY_VALUE	Valor do Estoque	BRL	Valor total dos materiais em estoque	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4960 (class 0 OID 42752)
-- Dependencies: 380
-- Data for Name: co_kpi_snapshot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number, meta_json) FROM stdin;
\.


--
-- TOC entry 4984 (class 0 OID 42974)
-- Dependencies: 404
-- Data for Name: co_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_setup (tenant_id, timezone, kpi_refresh_cron) FROM stdin;
LaplataLunaria	America/Sao_Paulo	0 */15 * * * *
\.


--
-- TOC entry 4944 (class 0 OID 42544)
-- Dependencies: 364
-- Data for Name: crm_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_customer (tenant_id, customer_id, name, email, telefone, customer_type, status, created_date) FROM stdin;
\.


--
-- TOC entry 4952 (class 0 OID 42641)
-- Dependencies: 372
-- Data for Name: crm_interaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_interaction (tenant_id, interaction_id, lead_id, channel, content, sentiment, created_date) FROM stdin;
\.


--
-- TOC entry 4949 (class 0 OID 42616)
-- Dependencies: 369
-- Data for Name: crm_lead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_lead (tenant_id, lead_id, name, email, phone, source, status, score, owner_user, created_date) FROM stdin;
\.


--
-- TOC entry 4978 (class 0 OID 42922)
-- Dependencies: 398
-- Data for Name: crm_lead_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_lead_status_def (tenant_id, status, description, order_index, is_final) FROM stdin;
\.


--
-- TOC entry 4979 (class 0 OID 42931)
-- Dependencies: 399
-- Data for Name: crm_opp_stage_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_opp_stage_def (tenant_id, stage, description, order_index, is_final) FROM stdin;
\.


--
-- TOC entry 4950 (class 0 OID 42625)
-- Dependencies: 370
-- Data for Name: crm_opportunity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_opportunity (tenant_id, opp_id, lead_id, stage, est_value_cents, probability, next_action_at, status, created_date) FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 42905)
-- Dependencies: 396
-- Data for Name: crm_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_setup (tenant_id, require_contact_info, auto_convert_on_first_order) FROM stdin;
LaplataLunaria	t	f
\.


--
-- TOC entry 4977 (class 0 OID 42914)
-- Dependencies: 397
-- Data for Name: crm_source_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_source_def (tenant_id, source, is_active) FROM stdin;
\.


--
-- TOC entry 4930 (class 0 OID 42415)
-- Dependencies: 350
-- Data for Name: doc_numbering; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active) FROM stdin;
\.


--
-- TOC entry 4953 (class 0 OID 42655)
-- Dependencies: 373
-- Data for Name: fi_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_account (tenant_id, account_id, name, type, currency, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4954 (class 0 OID 42665)
-- Dependencies: 374
-- Data for Name: fi_invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_invoice (tenant_id, invoice_id, source_type, source_id, customer_id, vendor_id, amount_cents, due_date, status, created_date) FROM stdin;
\.


--
-- TOC entry 4955 (class 0 OID 42685)
-- Dependencies: 375
-- Data for Name: fi_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_payment (tenant_id, payment_id, invoice_id, account_id, amount_cents, payment_date, method, status, created_at) FROM stdin;
\.


--
-- TOC entry 4981 (class 0 OID 42950)
-- Dependencies: 401
-- Data for Name: fi_payment_method_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_payment_method_def (tenant_id, method, display_name, is_active) FROM stdin;
\.


--
-- TOC entry 4982 (class 0 OID 42958)
-- Dependencies: 402
-- Data for Name: fi_payment_terms_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_payment_terms_def (tenant_id, terms_code, description, days, is_active) FROM stdin;
LaplataLunaria	PIX	Pagamento via Pix	0	t
LaplataLunaria	TRANSF	Transferência Bancária	0	t
LaplataLunaria	BOLETO	Boleto Bancário	2	t
LaplataLunaria	CRED_VISTA	Cartão de Crédito à Vista	0	t
LaplataLunaria	CRED_PARC	Cartão de Crédito Parcelado	30	t
\.


--
-- TOC entry 4980 (class 0 OID 42940)
-- Dependencies: 400
-- Data for Name: fi_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_setup (tenant_id, currency, tax_inclusive, default_ar_account_id, default_ap_account_id, rounding_policy) FROM stdin;
LaplataLunaria	BRL	f	\N	\N	bankers
\.


--
-- TOC entry 4983 (class 0 OID 42966)
-- Dependencies: 403
-- Data for Name: fi_tax_code_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_tax_code_def (tenant_id, tax_code, description, rate_bp) FROM stdin;
\.


--
-- TOC entry 4956 (class 0 OID 42706)
-- Dependencies: 376
-- Data for Name: fi_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_transaction (tenant_id, transaction_id, account_id, type, amount_cents, ref_type, ref_id, date, created_at) FROM stdin;
\.


--
-- TOC entry 4986 (class 0 OID 42984)
-- Dependencies: 406
-- Data for Name: import_job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_job (tenant_id, job_id, job_type, status, total_records, processed_records, error_records, started_at, completed_at, created_at) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 42998)
-- Dependencies: 408
-- Data for Name: import_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_log (tenant_id, log_id, job_id, record_number, status, error_message, data_json, created_at) FROM stdin;
\.


--
-- TOC entry 4963 (class 0 OID 42793)
-- Dependencies: 383
-- Data for Name: mm_category_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_category_def (tenant_id, category, is_active) FROM stdin;
LaplataLunaria	Brinco	t
LaplataLunaria	Choker	t
LaplataLunaria	Kit	t
LaplataLunaria	Gargantilha	t
LaplataLunaria	Pulseira	t
\.


--
-- TOC entry 4964 (class 0 OID 42801)
-- Dependencies: 384
-- Data for Name: mm_classification_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_classification_def (tenant_id, classification, is_active) FROM stdin;
LaplataLunaria	Amuletos	t
LaplataLunaria	Elementar	t
LaplataLunaria	Ciclos	t
LaplataLunaria	Ancestral	t
\.


--
-- TOC entry 4966 (class 0 OID 42817)
-- Dependencies: 386
-- Data for Name: mm_currency_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_currency_def (tenant_id, currency, is_active) FROM stdin;
LaplataLunaria	BRL	t
LaplataLunaria	USD	t
LaplataLunaria	EUR	t
\.


--
-- TOC entry 4934 (class 0 OID 42442)
-- Dependencies: 354
-- Data for Name: mm_material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_material (tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, barcode, weight_grams, status, mm_pur_link, mm_vendor_id, created_at, commercial_name, unit_of_measure, dimensions, purity, color, finish, min_stock, max_stock, lead_time_days) FROM stdin;
LaplataLunaria	G_200	Vitalis	Gargantilha Árvore da Vida Zircônia Verde - P	Gargantilha	Ancestral	28453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_201	Vitalis	Gargantilha Árvore da Vida Zircônia Verde - M	Gargantilha	Ancestral	29173	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	K_183	Raízes & Ramos	Conjunto Árvore da Vida de Prata	Kit	Ancestral	45093	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_176	Nauriah	Brinco Círculo Cravejado Olho Grego de Prata	Brinco	Amuletos	19653	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_177	Nyra	Brinco Estrelas Liso de Prata	Brinco	Elementar	10853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_178	Senara	Brinco Infinito Cravejado com Borda de Prata	Brinco	Ciclos	24453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_179	Selune	Brinco Lua Cravejado Médio	Brinco	Elementar	20453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_180	Vigil	Brinco Olho Grego Azul Escuro Crav. Inglesa	Brinco	Amuletos	10853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_181	Eterna Sorte	Brinco Trevo Meio-Cravejado de Prata	Brinco	Amuletos	15173	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	C_182	Orakai	Choker 9 Olho Grego Pendurado Mista	Choker	Amuletos	31253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_184	Aeternus	Gargantilha Infinito Cravejado de Prata - P	Gargantilha	Ciclos	22453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_185	Aeternus	Gargantilha Infinito Cravejado de Prata - M	Gargantilha	Ciclos	23253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_186	Mão de Luz	Gargantilha Mão de Fatima Cravejado Vazado - P	Gargantilha	Amuletos	31253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	B_175	Símbolo	Brinco Argola Cravejado Trevo Resina Preto Misto	Brinco	Amuletos	24453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_192	Ciclos	Gargantilha Retângulo Lua Vazado de Prata - P	Gargantilha	Ciclos	19253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_189	Aura	Gargantilha Olho Grego Vazado Cravejado - P	Gargantilha	Amuletos	26853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_187	Mão de Luz	Gargantilha Mão de Fatima Cravejado Vazado - M	Gargantilha	Amuletos	32453	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_194	Ciclos	Gargantilha Retângulo Lua Vazado de Prata - G	Gargantilha	Ciclos	22853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_195	Helios	Gargantilha Retângulo Sol Vazado de Prata - P	Gargantilha	Elementar	19253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_190	Aura	Gargantilha Olho Grego Vazado Cravejado - M	Gargantilha	Amuletos	27653	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_191	Aura	Gargantilha Olho Grego Vazado Cravejado - G	Gargantilha	Amuletos	30053	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_188	Mão de Luz	Gargantilha Mão de Fatima Cravejado Vazado - G	Gargantilha	Amuletos	34853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_193	Ciclos	Gargantilha Retângulo Lua Vazado de Prata - M	Gargantilha	Ciclos	20053	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_196	Helios	Gargantilha Retângulo Sol Vazado de Prata - M	Gargantilha	Elementar	20053	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_197	Helios	Gargantilha Retângulo Sol Vazado de Prata - G	Gargantilha	Elementar	22853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_198	Guardiã da Noite	Gargantilha Trevo Preto Borda Trabalhado de Prata - P	Gargantilha	Amuletos	22053	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	G_199	Guardiã da Noite	Gargantilha Trevo Preto Borda Trabalhado de Prata - M	Gargantilha	Amuletos	22853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_202	Lunar	Pulseira 3 Lua Vazado Liso Pendurado de Prata	Pulseira	Elementar	18373	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_203	Trevo	Pulseira 3 Pontos de Luz Trevo 5mm Turmalina de Prata	Pulseira	Elementar	21013	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_204	Guardiãs	Pulseira 4 Olho Grego Pendurado Mista	Pulseira	Elementar	16853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_206	Vítreo	Pulseira Círculo Cravejado Olho Grego de Prata	Pulseira	Elementar	19653	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_205	Renova	Pulseira 5 Infinito Seperado de Prata	Pulseira	Ciclos	27253	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_207	Orion	Pulseira Infinito Liso de Prata	Pulseira	Elementar	18853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_208	Luz	Pulseira Mão de Fátima Hamsá de Prata	Pulseira	Amuletos	22053	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
LaplataLunaria	P_209	Florescer	Pulseira Árvore da Vida de Prata	Pulseira	Amuletos	24853	\N	\N	active	\N	\N	2025-09-18 07:23:45.29189+00	\N	unidade	\N	\N	\N	\N	0	1000	20
\.


--
-- TOC entry 4965 (class 0 OID 42809)
-- Dependencies: 385
-- Data for Name: mm_price_channel_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_price_channel_def (tenant_id, channel, is_active) FROM stdin;
\.


--
-- TOC entry 4935 (class 0 OID 42457)
-- Dependencies: 355
-- Data for Name: mm_purchase_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_purchase_order (tenant_id, mm_order, vendor_id, status, po_date, expected_delivery, notes, created_at, total_amount, currency) FROM stdin;
LaplataLunaria	PO-2025-001	SUP_00001	received	2025-09-18	2025-09-25	Carga inicial	2025-09-18 07:23:45.29189+00	1068920	BRL
\.


--
-- TOC entry 4937 (class 0 OID 42473)
-- Dependencies: 357
-- Data for Name: mm_purchase_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_purchase_order_item (tenant_id, po_item_id, mm_order, plant_id, mm_material, mm_qtt, unit_cost_cents, line_total_cents, notes, currency) FROM stdin;
LaplataLunaria	72	PO-2025-001	WH-001	B_175	14	4800	67200	\N	BRL
LaplataLunaria	73	PO-2025-001	WH-001	B_176	14	3600	50400	\N	BRL
LaplataLunaria	74	PO-2025-001	WH-001	B_177	14	1400	19600	\N	BRL
LaplataLunaria	75	PO-2025-001	WH-001	B_178	14	4800	67200	\N	BRL
LaplataLunaria	76	PO-2025-001	WH-001	B_179	14	3800	53200	\N	BRL
LaplataLunaria	77	PO-2025-001	WH-001	B_180	14	1400	19600	\N	BRL
LaplataLunaria	78	PO-2025-001	WH-001	B_181	14	2480	34720	\N	BRL
LaplataLunaria	79	PO-2025-001	WH-001	C_182	9	6500	58500	\N	BRL
LaplataLunaria	80	PO-2025-001	WH-001	K_183	5	9960	49800	\N	BRL
LaplataLunaria	81	PO-2025-001	WH-001	G_200	4	5800	23200	\N	BRL
LaplataLunaria	82	PO-2025-001	WH-001	G_201	5	5980	29900	\N	BRL
LaplataLunaria	83	PO-2025-001	WH-001	G_184	5	4300	21500	\N	BRL
LaplataLunaria	84	PO-2025-001	WH-001	G_185	5	4500	22500	\N	BRL
LaplataLunaria	85	PO-2025-001	WH-001	G_186	4	6500	26000	\N	BRL
LaplataLunaria	86	PO-2025-001	WH-001	G_187	4	6800	27200	\N	BRL
LaplataLunaria	87	PO-2025-001	WH-001	G_188	2	7400	14800	\N	BRL
LaplataLunaria	88	PO-2025-001	WH-001	G_189	4	5400	21600	\N	BRL
LaplataLunaria	89	PO-2025-001	WH-001	G_190	4	5600	22400	\N	BRL
LaplataLunaria	90	PO-2025-001	WH-001	G_191	2	6200	12400	\N	BRL
LaplataLunaria	91	PO-2025-001	WH-001	G_192	1	3500	3500	\N	BRL
LaplataLunaria	92	PO-2025-001	WH-001	G_193	5	3700	18500	\N	BRL
LaplataLunaria	93	PO-2025-001	WH-001	G_194	4	4400	17600	\N	BRL
LaplataLunaria	94	PO-2025-001	WH-001	G_195	1	3500	3500	\N	BRL
LaplataLunaria	95	PO-2025-001	WH-001	G_196	5	3700	18500	\N	BRL
LaplataLunaria	96	PO-2025-001	WH-001	G_197	3	4400	13200	\N	BRL
LaplataLunaria	97	PO-2025-001	WH-001	G_198	5	4200	21000	\N	BRL
LaplataLunaria	98	PO-2025-001	WH-001	G_199	5	4400	22000	\N	BRL
LaplataLunaria	99	PO-2025-001	WH-001	P_202	10	3280	32800	\N	BRL
LaplataLunaria	100	PO-2025-001	WH-001	P_203	10	3940	39400	\N	BRL
LaplataLunaria	101	PO-2025-001	WH-001	P_204	9	2900	26100	\N	BRL
LaplataLunaria	102	PO-2025-001	WH-001	P_205	10	5500	55000	\N	BRL
LaplataLunaria	103	PO-2025-001	WH-001	P_209	9	4900	44100	\N	BRL
LaplataLunaria	104	PO-2025-001	WH-001	P_206	10	3600	36000	\N	BRL
LaplataLunaria	105	PO-2025-001	WH-001	P_207	10	3400	34000	\N	BRL
LaplataLunaria	106	PO-2025-001	WH-001	P_208	10	4200	42000	\N	BRL
\.


--
-- TOC entry 4939 (class 0 OID 42495)
-- Dependencies: 359
-- Data for Name: mm_receiving; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_receiving (tenant_id, recv_id, mm_order, plant_id, mm_material, qty_received, received_at, received_by, status, notes) FROM stdin;
LaplataLunaria	1	PO-2025-001	WH-001	B_175	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	2	PO-2025-001	WH-001	B_176	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	3	PO-2025-001	WH-001	B_177	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	4	PO-2025-001	WH-001	B_178	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	5	PO-2025-001	WH-001	B_179	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	6	PO-2025-001	WH-001	B_180	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	7	PO-2025-001	WH-001	B_181	14	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	8	PO-2025-001	WH-001	C_182	9	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	9	PO-2025-001	WH-001	K_183	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	10	PO-2025-001	WH-001	G_200	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	11	PO-2025-001	WH-001	G_201	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	12	PO-2025-001	WH-001	G_184	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	13	PO-2025-001	WH-001	G_185	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	14	PO-2025-001	WH-001	G_186	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	15	PO-2025-001	WH-001	G_187	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	16	PO-2025-001	WH-001	G_188	2	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	17	PO-2025-001	WH-001	G_189	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	18	PO-2025-001	WH-001	G_190	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	19	PO-2025-001	WH-001	G_191	2	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	20	PO-2025-001	WH-001	G_192	1	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	21	PO-2025-001	WH-001	G_193	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	22	PO-2025-001	WH-001	G_194	4	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	23	PO-2025-001	WH-001	G_195	1	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	24	PO-2025-001	WH-001	G_196	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	25	PO-2025-001	WH-001	G_197	3	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	26	PO-2025-001	WH-001	G_198	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	27	PO-2025-001	WH-001	G_199	5	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	28	PO-2025-001	WH-001	P_202	10	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	29	PO-2025-001	WH-001	P_203	10	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	30	PO-2025-001	WH-001	P_204	9	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	31	PO-2025-001	WH-001	P_205	10	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	32	PO-2025-001	WH-001	P_209	9	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	33	PO-2025-001	WH-001	P_206	10	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	34	PO-2025-001	WH-001	P_207	10	2025-09-18 07:23:45.29189+00	\N	received	\N
LaplataLunaria	35	PO-2025-001	WH-001	P_208	10	2025-09-18 07:23:45.29189+00	\N	received	\N
\.


--
-- TOC entry 4962 (class 0 OID 42780)
-- Dependencies: 382
-- Data for Name: mm_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_setup (tenant_id, default_payment_terms, default_currency, default_wh_id, require_mat_type, require_mat_class, allow_zero_price, default_uom) FROM stdin;
LaplataLunaria	30	BRL	\N	t	t	f	unidade
\.


--
-- TOC entry 4968 (class 0 OID 42833)
-- Dependencies: 388
-- Data for Name: mm_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_status_def (tenant_id, object_type, status, description, is_final, order_index) FROM stdin;
LaplataLunaria	material	active	Material ativo	f	1
LaplataLunaria	material	archived	Material arquivado	t	99
LaplataLunaria	po	draft	Pedido em rascunho	f	1
LaplataLunaria	po	received	Pedido recebido	t	99
LaplataLunaria	receiving	pending	Recebimento pendente	f	1
LaplataLunaria	receiving	received	Recebimento concluído	t	99
\.


--
-- TOC entry 4933 (class 0 OID 42434)
-- Dependencies: 353
-- Data for Name: mm_vendor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_vendor (tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating, created_at, contact_person, address, city, state, zip_code, country, tax_id, payment_terms, rating, status) FROM stdin;
LaplataLunaria	SUP_00001	Silvercrown	sac.silvercrown@gmail.com	(44) 9184-4337	Paranavai	PR	A	2025-09-18 07:23:45.29189+00	\N	\N	\N	\N	\N	Brasil	\N	30	B	active
\.


--
-- TOC entry 4967 (class 0 OID 42825)
-- Dependencies: 387
-- Data for Name: mm_vendor_rating_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_vendor_rating_def (tenant_id, rating, is_active) FROM stdin;
LaplataLunaria	A	t
LaplataLunaria	B	t
LaplataLunaria	C	t
\.


--
-- TOC entry 4928 (class 0 OID 42399)
-- Dependencies: 348
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permission (tenant_id, role, resource, action, allowed) FROM stdin;
\.


--
-- TOC entry 4974 (class 0 OID 42889)
-- Dependencies: 394
-- Data for Name: sd_carrier_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_carrier_def (tenant_id, carrier_code, carrier_name, is_active) FROM stdin;
\.


--
-- TOC entry 4975 (class 0 OID 42897)
-- Dependencies: 395
-- Data for Name: sd_channel_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_channel_def (tenant_id, channel, is_active) FROM stdin;
\.


--
-- TOC entry 4972 (class 0 OID 42871)
-- Dependencies: 392
-- Data for Name: sd_order_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_order_status_def (tenant_id, status, description, is_final, order_index) FROM stdin;
LaplataLunaria	draft	Pedido em rascunho	f	1
LaplataLunaria	confirmed	Pedido confirmado	f	2
LaplataLunaria	shipped	Pedido enviado	f	3
LaplataLunaria	delivered	Pedido entregue	t	99
\.


--
-- TOC entry 4948 (class 0 OID 42600)
-- Dependencies: 368
-- Data for Name: sd_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_payment (tenant_id, payment_id, so_id, amount_cents, payment_date, payment_method, status, created_at) FROM stdin;
\.


--
-- TOC entry 4945 (class 0 OID 42554)
-- Dependencies: 365
-- Data for Name: sd_sales_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_sales_order (tenant_id, so_id, customer_id, status, order_date, expected_ship, total_cents, created_at) FROM stdin;
\.


--
-- TOC entry 4946 (class 0 OID 42570)
-- Dependencies: 366
-- Data for Name: sd_sales_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_sales_order_item (tenant_id, so_id, sku, quantity, unit_price_cents, line_total_cents, row_no) FROM stdin;
\.


--
-- TOC entry 4971 (class 0 OID 42860)
-- Dependencies: 391
-- Data for Name: sd_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_setup (tenant_id, backorder_policy, pricing_mode, default_channel, auto_reserve_on_confirm) FROM stdin;
LaplataLunaria	block	material	site	t
\.


--
-- TOC entry 4947 (class 0 OID 42586)
-- Dependencies: 367
-- Data for Name: sd_shipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_shipment (tenant_id, shipment_id, so_id, warehouse_id, ship_date, status, carrier, tracking_code, created_at) FROM stdin;
\.


--
-- TOC entry 4973 (class 0 OID 42880)
-- Dependencies: 393
-- Data for Name: sd_shipment_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_shipment_status_def (tenant_id, status, description, is_final, order_index) FROM stdin;
LaplataLunaria	pending	Aguardando envio	f	1
LaplataLunaria	in_transit	Em trânsito	f	2
LaplataLunaria	delivered	Entregue	t	99
\.


--
-- TOC entry 4926 (class 0 OID 42379)
-- Dependencies: 346
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant (tenant_id, display_name, locale, timezone, created_at) FROM stdin;
LaplataLunaria	La Plata Lunária	pt-BR	America/Sao_Paulo	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4927 (class 0 OID 42389)
-- Dependencies: 347
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profile (tenant_id, user_id, name, email, role, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4941 (class 0 OID 42525)
-- Dependencies: 361
-- Data for Name: wh_inventory_balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status) FROM stdin;
LaplataLunaria	WH-001	B_175	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_176	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_177	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_178	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_179	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_180	14	0	2025-09-18	active
LaplataLunaria	WH-001	B_181	14	0	2025-09-18	active
LaplataLunaria	WH-001	C_182	9	0	2025-09-18	active
LaplataLunaria	WH-001	K_183	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_200	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_201	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_184	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_185	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_186	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_187	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_188	2	0	2025-09-18	active
LaplataLunaria	WH-001	G_189	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_190	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_191	2	0	2025-09-18	active
LaplataLunaria	WH-001	G_192	1	0	2025-09-18	active
LaplataLunaria	WH-001	G_193	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_194	4	0	2025-09-18	active
LaplataLunaria	WH-001	G_195	1	0	2025-09-18	active
LaplataLunaria	WH-001	G_196	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_197	3	0	2025-09-18	active
LaplataLunaria	WH-001	G_198	5	0	2025-09-18	active
LaplataLunaria	WH-001	G_199	5	0	2025-09-18	active
LaplataLunaria	WH-001	P_202	10	0	2025-09-18	active
LaplataLunaria	WH-001	P_203	10	0	2025-09-18	active
LaplataLunaria	WH-001	P_204	9	0	2025-09-18	active
LaplataLunaria	WH-001	P_205	10	0	2025-09-18	active
LaplataLunaria	WH-001	P_209	9	0	2025-09-18	active
LaplataLunaria	WH-001	P_206	10	0	2025-09-18	active
LaplataLunaria	WH-001	P_207	10	0	2025-09-18	active
LaplataLunaria	WH-001	P_208	10	0	2025-09-18	active
\.


--
-- TOC entry 4943 (class 0 OID 42535)
-- Dependencies: 363
-- Data for Name: wh_inventory_ledger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_inventory_ledger (ledger_id, tenant_id, plant_id, mm_material, movement, qty, ref_type, ref_id, created_at) FROM stdin;
\.


--
-- TOC entry 4970 (class 0 OID 42852)
-- Dependencies: 390
-- Data for Name: wh_inventory_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_inventory_status_def (tenant_id, status, is_active) FROM stdin;
LaplataLunaria	active	t
LaplataLunaria	blocked	t
LaplataLunaria	counting	t
\.


--
-- TOC entry 4969 (class 0 OID 42842)
-- Dependencies: 389
-- Data for Name: wh_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_setup (tenant_id, default_plant_id, reserve_policy, negative_stock_allowed, picking_strategy) FROM stdin;
LaplataLunaria	WH-001	no_backorder	f	fifo
\.


--
-- TOC entry 4940 (class 0 OID 42515)
-- Dependencies: 360
-- Data for Name: wh_warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_warehouse (tenant_id, plant_id, name, is_default, created_at, address, city, state, zip_code, country, contact_person, phone, email) FROM stdin;
LaplataLunaria	WH-001	Depósito Principal	t	2025-09-18 07:23:45.29189+00	\N	\N	\N	\N	Brasil	\N	\N	\N
\.


--
-- TOC entry 4917 (class 0 OID 17025)
-- Dependencies: 333
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-09-15 13:52:48
20211116045059	2025-09-15 13:52:52
20211116050929	2025-09-15 13:52:56
20211116051442	2025-09-15 13:52:59
20211116212300	2025-09-15 13:53:03
20211116213355	2025-09-15 13:53:07
20211116213934	2025-09-15 13:53:10
20211116214523	2025-09-15 13:53:15
20211122062447	2025-09-15 13:53:18
20211124070109	2025-09-15 13:53:21
20211202204204	2025-09-15 13:53:25
20211202204605	2025-09-15 13:53:28
20211210212804	2025-09-15 13:53:39
20211228014915	2025-09-15 13:53:42
20220107221237	2025-09-15 13:53:46
20220228202821	2025-09-15 13:53:49
20220312004840	2025-09-15 13:53:52
20220603231003	2025-09-15 13:53:58
20220603232444	2025-09-15 13:54:02
20220615214548	2025-09-15 13:54:05
20220712093339	2025-09-15 13:54:09
20220908172859	2025-09-15 13:54:12
20220916233421	2025-09-15 13:54:15
20230119133233	2025-09-15 13:54:19
20230128025114	2025-09-15 13:54:23
20230128025212	2025-09-15 13:54:27
20230227211149	2025-09-15 13:54:30
20230228184745	2025-09-15 13:54:33
20230308225145	2025-09-15 13:54:37
20230328144023	2025-09-15 13:54:40
20231018144023	2025-09-15 13:54:44
20231204144023	2025-09-15 13:54:49
20231204144024	2025-09-15 13:54:53
20231204144025	2025-09-15 13:54:56
20240108234812	2025-09-15 13:54:59
20240109165339	2025-09-15 13:55:03
20240227174441	2025-09-15 13:55:09
20240311171622	2025-09-15 13:55:13
20240321100241	2025-09-15 13:55:21
20240401105812	2025-09-15 13:55:30
20240418121054	2025-09-15 13:55:34
20240523004032	2025-09-15 13:55:46
20240618124746	2025-09-15 13:55:49
20240801235015	2025-09-15 13:55:52
20240805133720	2025-09-15 13:55:56
20240827160934	2025-09-15 13:55:59
20240919163303	2025-09-15 13:56:04
20240919163305	2025-09-15 13:56:07
20241019105805	2025-09-15 13:56:11
20241030150047	2025-09-15 13:56:23
20241108114728	2025-09-15 13:56:27
20241121104152	2025-09-15 13:56:31
20241130184212	2025-09-15 13:56:35
20241220035512	2025-09-15 13:56:38
20241220123912	2025-09-15 13:56:41
20241224161212	2025-09-15 13:56:44
20250107150512	2025-09-15 13:56:48
20250110162412	2025-09-15 13:56:51
20250123174212	2025-09-15 13:56:55
20250128220012	2025-09-15 13:56:58
20250506224012	2025-09-15 13:57:00
20250523164012	2025-09-15 13:57:04
20250714121412	2025-09-15 13:57:07
\.


--
-- TOC entry 4921 (class 0 OID 17135)
-- Dependencies: 338
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4902 (class 0 OID 16546)
-- Dependencies: 315
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 4923 (class 0 OID 20086)
-- Dependencies: 343
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4904 (class 0 OID 16588)
-- Dependencies: 317
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-09-15 13:52:41.327416
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-09-15 13:52:41.357128
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-09-15 13:52:41.363873
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-09-15 13:52:41.426639
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-09-15 13:52:41.562089
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-09-15 13:52:41.568974
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-09-15 13:52:41.575821
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-09-15 13:52:41.585305
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-09-15 13:52:41.591786
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-09-15 13:52:41.597996
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-09-15 13:52:41.60494
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-09-15 13:52:41.611783
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-09-15 13:52:41.621652
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-09-15 13:52:41.64619
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-09-15 13:52:41.652444
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-09-15 13:52:41.676741
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-09-15 13:52:41.684619
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-09-15 13:52:41.690776
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-09-15 13:52:41.699385
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-09-15 13:52:41.708531
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-09-15 13:52:41.715187
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-09-15 13:52:41.723714
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-09-15 13:52:41.741947
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-09-15 13:52:41.783749
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-09-15 13:52:41.793592
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-09-15 13:52:41.801448
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-09-16 08:52:20.294374
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-09-16 08:52:20.608543
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-09-16 08:52:20.697879
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-09-16 08:52:20.788894
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-09-16 08:52:20.801911
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-09-16 08:52:20.809926
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-09-16 08:52:20.890944
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-09-16 08:52:20.989214
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-09-16 08:52:20.992596
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-09-16 08:52:21.098606
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-09-16 08:52:21.104082
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-09-16 08:52:21.194815
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-09-16 08:52:21.201804
\.


--
-- TOC entry 4903 (class 0 OID 16561)
-- Dependencies: 316
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- TOC entry 4922 (class 0 OID 20042)
-- Dependencies: 342
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4918 (class 0 OID 17062)
-- Dependencies: 334
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4919 (class 0 OID 17076)
-- Dependencies: 335
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4924 (class 0 OID 20102)
-- Dependencies: 344
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
20240101000001	{"-- Enable necessary extensions\nCREATE EXTENSION IF NOT EXISTS \\"uuid-ossp\\"","-- Create custom types\nCREATE TYPE user_role AS ENUM ('admin', 'manager', 'user', 'viewer')","CREATE TYPE material_type AS ENUM ('raw_material', 'finished_good', 'component', 'service')","CREATE TYPE material_class AS ENUM ('prata', 'ouro', 'acabamento', 'embalagem')","CREATE TYPE order_status AS ENUM ('draft', 'pending', 'approved', 'received', 'cancelled', 'shipped', 'delivered', 'invoiced')","CREATE TYPE customer_type AS ENUM ('PF', 'PJ')","CREATE TYPE payment_method AS ENUM ('pix', 'cartao', 'boleto', 'transferencia')","CREATE TYPE account_type AS ENUM ('caixa', 'banco')","CREATE TYPE transaction_type AS ENUM ('credito', 'debito')","CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST')","-- Setup & Security Tables\nCREATE TABLE tenant (\n    tenant_id TEXT PRIMARY KEY,\n    display_name TEXT NOT NULL,\n    locale TEXT DEFAULT 'pt-BR',\n    timezone TEXT DEFAULT 'America/Sao_Paulo',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE user_profile (\n    tenant_id TEXT NOT NULL,\n    user_id UUID PRIMARY KEY,\n    name TEXT NOT NULL,\n    email TEXT NOT NULL,\n    role user_role NOT NULL DEFAULT 'user',\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE role_permission (\n    tenant_id TEXT NOT NULL,\n    role user_role NOT NULL,\n    resource TEXT NOT NULL,\n    action TEXT NOT NULL,\n    allowed BOOLEAN DEFAULT FALSE,\n    PRIMARY KEY (tenant_id, role, resource, action)\n)","CREATE TABLE app_setting (\n    tenant_id TEXT NOT NULL,\n    key TEXT NOT NULL,\n    value TEXT,\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    PRIMARY KEY (tenant_id, key)\n)","CREATE TABLE doc_numbering (\n    tenant_id TEXT NOT NULL,\n    doc_type TEXT NOT NULL,\n    prefix TEXT NOT NULL,\n    format TEXT NOT NULL,\n    next_seq INTEGER DEFAULT 1,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, doc_type)\n)","CREATE TABLE audit_log (\n    audit_id BIGSERIAL PRIMARY KEY,\n    tenant_id TEXT NOT NULL,\n    table_name TEXT NOT NULL,\n    record_pk TEXT NOT NULL,\n    action TEXT NOT NULL,\n    diff_json JSONB,\n    actor_user UUID,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- MM - Materiais & Fornecedores\nCREATE TABLE mm_vendor (\n    tenant_id TEXT NOT NULL,\n    vendor_id TEXT PRIMARY KEY,\n    vendor_name TEXT NOT NULL,\n    email TEXT,\n    telefone TEXT,\n    cidade TEXT,\n    estado TEXT,\n    vendor_rating TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE mm_material (\n    tenant_id TEXT NOT NULL,\n    mm_material TEXT PRIMARY KEY,\n    mm_comercial TEXT,\n    mm_desc TEXT NOT NULL,\n    mm_mat_type material_type,\n    mm_mat_class material_class,\n    mm_price_cents INTEGER DEFAULT 0,\n    barcode TEXT,\n    weight_grams INTEGER,\n    status TEXT DEFAULT 'active',\n    mm_pur_link TEXT,\n    mm_vendor_id TEXT REFERENCES mm_vendor(vendor_id),\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE mm_purchase_order (\n    tenant_id TEXT NOT NULL,\n    mm_order TEXT PRIMARY KEY,\n    vendor_id TEXT NOT NULL REFERENCES mm_vendor(vendor_id),\n    status order_status DEFAULT 'draft',\n    po_date DATE DEFAULT CURRENT_DATE,\n    expected_delivery DATE,\n    notes TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE mm_purchase_order_item (\n    tenant_id TEXT NOT NULL,\n    po_item_id BIGSERIAL PRIMARY KEY,\n    mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order),\n    plant_id TEXT NOT NULL,\n    mm_material TEXT NOT NULL REFERENCES mm_material(mm_material),\n    mm_qtt NUMERIC NOT NULL DEFAULT 0,\n    unit_cost_cents INTEGER NOT NULL DEFAULT 0,\n    line_total_cents INTEGER NOT NULL DEFAULT 0,\n    notes TEXT\n)","CREATE TABLE mm_receiving (\n    tenant_id TEXT NOT NULL,\n    recv_id BIGSERIAL PRIMARY KEY,\n    mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order),\n    plant_id TEXT NOT NULL,\n    mm_material TEXT NOT NULL REFERENCES mm_material(mm_material),\n    qty_received NUMERIC NOT NULL DEFAULT 0,\n    received_at TIMESTAMPTZ DEFAULT NOW()\n)","-- WH - Depósitos & Estoque\nCREATE TABLE wh_warehouse (\n    tenant_id TEXT NOT NULL,\n    plant_id TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    is_default BOOLEAN DEFAULT FALSE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- Constraint to ensure only one default warehouse per tenant\nCREATE UNIQUE INDEX wh_warehouse_default_unique ON wh_warehouse (tenant_id) WHERE is_default = TRUE","CREATE TABLE wh_inventory_balance (\n    tenant_id TEXT NOT NULL,\n    plant_id TEXT NOT NULL,\n    mm_material TEXT NOT NULL,\n    on_hand_qty NUMERIC DEFAULT 0,\n    reserved_qty NUMERIC DEFAULT 0,\n    PRIMARY KEY (tenant_id, plant_id, mm_material)\n)","CREATE TABLE wh_inventory_ledger (\n    ledger_id BIGSERIAL PRIMARY KEY,\n    tenant_id TEXT NOT NULL,\n    plant_id TEXT NOT NULL,\n    mm_material TEXT NOT NULL,\n    movement movement_type NOT NULL,\n    qty NUMERIC NOT NULL,\n    ref_type TEXT,\n    ref_id TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- SD - Vendas\nCREATE TABLE crm_customer (\n    tenant_id TEXT NOT NULL,\n    customer_id TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    email TEXT,\n    telefone TEXT,\n    customer_type customer_type DEFAULT 'PF',\n    status TEXT DEFAULT 'active',\n    created_date DATE DEFAULT CURRENT_DATE\n)","CREATE TABLE sd_sales_order (\n    tenant_id TEXT NOT NULL,\n    so_id TEXT PRIMARY KEY,\n    customer_id TEXT NOT NULL REFERENCES crm_customer(customer_id),\n    status order_status DEFAULT 'draft',\n    order_date DATE DEFAULT CURRENT_DATE,\n    expected_ship DATE,\n    total_cents INTEGER DEFAULT 0,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE sd_sales_order_item (\n    tenant_id TEXT NOT NULL,\n    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),\n    sku TEXT NOT NULL,\n    quantity NUMERIC NOT NULL DEFAULT 0,\n    unit_price_cents INTEGER NOT NULL DEFAULT 0,\n    line_total_cents INTEGER NOT NULL DEFAULT 0,\n    row_no INTEGER DEFAULT 1,\n    PRIMARY KEY (tenant_id, so_id, sku, row_no)\n)","CREATE TABLE sd_shipment (\n    tenant_id TEXT NOT NULL,\n    shipment_id TEXT PRIMARY KEY,\n    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),\n    warehouse_id TEXT NOT NULL,\n    ship_date DATE,\n    status order_status DEFAULT 'pending',\n    carrier TEXT,\n    tracking_code TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE sd_payment (\n    tenant_id TEXT NOT NULL,\n    payment_id TEXT PRIMARY KEY,\n    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),\n    amount_cents INTEGER NOT NULL DEFAULT 0,\n    payment_date DATE DEFAULT CURRENT_DATE,\n    payment_method payment_method NOT NULL,\n    status order_status DEFAULT 'pending',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- CRM - Leads & Oportunidades\nCREATE TABLE crm_lead (\n    tenant_id TEXT NOT NULL,\n    lead_id TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    email TEXT,\n    phone TEXT,\n    source TEXT,\n    status TEXT DEFAULT 'novo',\n    score INTEGER,\n    owner_user UUID,\n    created_date DATE DEFAULT CURRENT_DATE\n)","CREATE TABLE crm_opportunity (\n    tenant_id TEXT NOT NULL,\n    opp_id TEXT PRIMARY KEY,\n    lead_id TEXT NOT NULL REFERENCES crm_lead(lead_id),\n    stage TEXT DEFAULT 'discovery',\n    est_value_cents INTEGER,\n    probability INTEGER,\n    next_action_at DATE,\n    status TEXT DEFAULT 'active',\n    created_date DATE DEFAULT CURRENT_DATE\n)","CREATE TABLE crm_interaction (\n    tenant_id TEXT NOT NULL,\n    interaction_id BIGSERIAL PRIMARY KEY,\n    lead_id TEXT NOT NULL REFERENCES crm_lead(lead_id),\n    channel TEXT NOT NULL,\n    content TEXT NOT NULL,\n    sentiment TEXT,\n    created_date DATE DEFAULT CURRENT_DATE\n)","-- FI - Financeiro\nCREATE TABLE fi_account (\n    tenant_id TEXT NOT NULL,\n    account_id TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    type account_type NOT NULL,\n    currency TEXT DEFAULT 'BRL',\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE fi_invoice (\n    tenant_id TEXT NOT NULL,\n    invoice_id TEXT PRIMARY KEY,\n    source_type TEXT NOT NULL,\n    source_id TEXT NOT NULL,\n    customer_id TEXT REFERENCES crm_customer(customer_id),\n    vendor_id TEXT REFERENCES mm_vendor(vendor_id),\n    amount_cents INTEGER NOT NULL DEFAULT 0,\n    due_date DATE,\n    status order_status DEFAULT 'pending',\n    created_date DATE DEFAULT CURRENT_DATE\n)","CREATE TABLE fi_payment (\n    tenant_id TEXT NOT NULL,\n    payment_id TEXT PRIMARY KEY,\n    invoice_id TEXT NOT NULL REFERENCES fi_invoice(invoice_id),\n    account_id TEXT NOT NULL REFERENCES fi_account(account_id),\n    amount_cents INTEGER NOT NULL DEFAULT 0,\n    payment_date DATE DEFAULT CURRENT_DATE,\n    method payment_method NOT NULL,\n    status order_status DEFAULT 'pending',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE fi_transaction (\n    tenant_id TEXT NOT NULL,\n    transaction_id TEXT PRIMARY KEY,\n    account_id TEXT NOT NULL REFERENCES fi_account(account_id),\n    type transaction_type NOT NULL,\n    amount_cents INTEGER NOT NULL DEFAULT 0,\n    ref_type TEXT,\n    ref_id TEXT,\n    date DATE DEFAULT CURRENT_DATE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- CO - Controladoria & Dashboard\nCREATE TABLE co_cost_center (\n    tenant_id TEXT NOT NULL,\n    cc_id TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    parent_cc_id TEXT REFERENCES co_cost_center(cc_id),\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE co_fiscal_period (\n    tenant_id TEXT NOT NULL,\n    period_id TEXT PRIMARY KEY,\n    start_date DATE NOT NULL,\n    end_date DATE NOT NULL,\n    status TEXT DEFAULT 'open',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE co_kpi_definition (\n    tenant_id TEXT NOT NULL,\n    kpi_key TEXT PRIMARY KEY,\n    name TEXT NOT NULL,\n    unit TEXT,\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE co_kpi_snapshot (\n    tenant_id TEXT NOT NULL,\n    kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key),\n    snapshot_at TIMESTAMPTZ NOT NULL,\n    value_number NUMERIC,\n    meta_json TEXT,\n    PRIMARY KEY (tenant_id, kpi_key, snapshot_at)\n)","CREATE TABLE co_dashboard_tile (\n    tenant_id TEXT NOT NULL,\n    tile_id TEXT PRIMARY KEY,\n    kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key),\n    title TEXT NOT NULL,\n    subtitle TEXT,\n    order_index INTEGER DEFAULT 0,\n    color TEXT,\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)"}	initial_schema
20240101000002	{"-- Setup Tables for each module\n\n-- MM - Materiais Setup\nCREATE TABLE mm_setup (\n    tenant_id TEXT NOT NULL,\n    default_payment_terms INTEGER DEFAULT 30,\n    default_currency TEXT DEFAULT 'BRL',\n    default_wh_id TEXT,\n    require_mat_type BOOLEAN DEFAULT TRUE,\n    require_mat_class BOOLEAN DEFAULT TRUE,\n    allow_zero_price BOOLEAN DEFAULT FALSE,\n    default_uom TEXT DEFAULT 'UN',\n    PRIMARY KEY (tenant_id)\n)","CREATE TABLE mm_category_def (\n    tenant_id TEXT NOT NULL,\n    category TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, category)\n)","CREATE TABLE mm_classification_def (\n    tenant_id TEXT NOT NULL,\n    classification TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, classification)\n)","CREATE TABLE mm_price_channel_def (\n    tenant_id TEXT NOT NULL,\n    channel TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, channel)\n)","CREATE TABLE mm_currency_def (\n    tenant_id TEXT NOT NULL,\n    currency TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, currency)\n)","CREATE TABLE mm_vendor_rating_def (\n    tenant_id TEXT NOT NULL,\n    rating TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, rating)\n)","CREATE TABLE mm_status_def (\n    tenant_id TEXT NOT NULL,\n    object_type TEXT NOT NULL,\n    status TEXT NOT NULL,\n    description TEXT,\n    is_final BOOLEAN DEFAULT FALSE,\n    order_index INTEGER DEFAULT 0,\n    PRIMARY KEY (tenant_id, object_type, status)\n)","-- WH - Depósitos Setup\nCREATE TABLE wh_setup (\n    tenant_id TEXT NOT NULL,\n    default_plant_id TEXT,\n    reserve_policy TEXT DEFAULT 'no_backorder',\n    negative_stock_allowed BOOLEAN DEFAULT FALSE,\n    picking_strategy TEXT DEFAULT 'fifo',\n    PRIMARY KEY (tenant_id)\n)","CREATE TABLE wh_inventory_status_def (\n    tenant_id TEXT NOT NULL,\n    status TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, status)\n)","-- SD - Vendas Setup\nCREATE TABLE sd_setup (\n    tenant_id TEXT NOT NULL,\n    backorder_policy TEXT DEFAULT 'block',\n    pricing_mode TEXT DEFAULT 'material',\n    default_channel TEXT DEFAULT 'site',\n    auto_reserve_on_confirm BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id)\n)","CREATE TABLE sd_order_status_def (\n    tenant_id TEXT NOT NULL,\n    status TEXT NOT NULL,\n    description TEXT,\n    is_final BOOLEAN DEFAULT FALSE,\n    order_index INTEGER DEFAULT 0,\n    PRIMARY KEY (tenant_id, status)\n)","CREATE TABLE sd_shipment_status_def (\n    tenant_id TEXT NOT NULL,\n    status TEXT NOT NULL,\n    description TEXT,\n    is_final BOOLEAN DEFAULT FALSE,\n    order_index INTEGER DEFAULT 0,\n    PRIMARY KEY (tenant_id, status)\n)","CREATE TABLE sd_carrier_def (\n    tenant_id TEXT NOT NULL,\n    carrier_code TEXT NOT NULL,\n    carrier_name TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, carrier_code)\n)","CREATE TABLE sd_channel_def (\n    tenant_id TEXT NOT NULL,\n    channel TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, channel)\n)","-- CRM - Leads Setup\nCREATE TABLE crm_setup (\n    tenant_id TEXT NOT NULL,\n    require_contact_info BOOLEAN DEFAULT TRUE,\n    auto_convert_on_first_order BOOLEAN DEFAULT FALSE,\n    PRIMARY KEY (tenant_id)\n)","CREATE TABLE crm_source_def (\n    tenant_id TEXT NOT NULL,\n    source TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, source)\n)","CREATE TABLE crm_lead_status_def (\n    tenant_id TEXT NOT NULL,\n    status TEXT NOT NULL,\n    description TEXT,\n    order_index INTEGER DEFAULT 0,\n    is_final BOOLEAN DEFAULT FALSE,\n    PRIMARY KEY (tenant_id, status)\n)","CREATE TABLE crm_opp_stage_def (\n    tenant_id TEXT NOT NULL,\n    stage TEXT NOT NULL,\n    description TEXT,\n    order_index INTEGER DEFAULT 0,\n    is_final BOOLEAN DEFAULT FALSE,\n    PRIMARY KEY (tenant_id, stage)\n)","-- FI - Financeiro Setup\nCREATE TABLE fi_setup (\n    tenant_id TEXT NOT NULL,\n    currency TEXT DEFAULT 'BRL',\n    tax_inclusive BOOLEAN DEFAULT FALSE,\n    default_ar_account_id TEXT,\n    default_ap_account_id TEXT,\n    rounding_policy TEXT DEFAULT 'bankers',\n    PRIMARY KEY (tenant_id)\n)","CREATE TABLE fi_payment_method_def (\n    tenant_id TEXT NOT NULL,\n    method TEXT NOT NULL,\n    display_name TEXT NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, method)\n)","CREATE TABLE fi_payment_terms_def (\n    tenant_id TEXT NOT NULL,\n    terms_code TEXT NOT NULL,\n    description TEXT,\n    days INTEGER NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    PRIMARY KEY (tenant_id, terms_code)\n)","CREATE TABLE fi_tax_code_def (\n    tenant_id TEXT NOT NULL,\n    tax_code TEXT NOT NULL,\n    description TEXT,\n    rate_bp INTEGER DEFAULT 0,\n    PRIMARY KEY (tenant_id, tax_code)\n)","-- CO - Controladoria Setup\nCREATE TABLE co_setup (\n    tenant_id TEXT NOT NULL,\n    timezone TEXT DEFAULT 'America/Sao_Paulo',\n    kpi_refresh_cron TEXT DEFAULT '0 */15 * * * *',\n    PRIMARY KEY (tenant_id)\n)","-- Import/Export Logs\nCREATE TABLE import_job (\n    tenant_id TEXT NOT NULL,\n    job_id BIGSERIAL PRIMARY KEY,\n    job_type TEXT NOT NULL,\n    status TEXT DEFAULT 'pending',\n    total_records INTEGER DEFAULT 0,\n    processed_records INTEGER DEFAULT 0,\n    error_records INTEGER DEFAULT 0,\n    started_at TIMESTAMPTZ,\n    completed_at TIMESTAMPTZ,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","CREATE TABLE import_log (\n    tenant_id TEXT NOT NULL,\n    log_id BIGSERIAL PRIMARY KEY,\n    job_id BIGINT NOT NULL REFERENCES import_job(job_id),\n    record_number INTEGER,\n    status TEXT NOT NULL,\n    error_message TEXT,\n    data_json JSONB,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)"}	setup_tables
20240101000003	{"-- Enable Row Level Security on all tables\nALTER TABLE tenant ENABLE ROW LEVEL SECURITY","ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY","ALTER TABLE role_permission ENABLE ROW LEVEL SECURITY","ALTER TABLE app_setting ENABLE ROW LEVEL SECURITY","ALTER TABLE doc_numbering ENABLE ROW LEVEL SECURITY","ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY","-- MM Tables\nALTER TABLE mm_vendor ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_material ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_purchase_order ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_purchase_order_item ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_receiving ENABLE ROW LEVEL SECURITY","-- WH Tables\nALTER TABLE wh_warehouse ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_balance ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_ledger ENABLE ROW LEVEL SECURITY","-- SD Tables\nALTER TABLE crm_customer ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_sales_order ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_sales_order_item ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_shipment ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_payment ENABLE ROW LEVEL SECURITY","-- CRM Tables\nALTER TABLE crm_lead ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_opportunity ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_interaction ENABLE ROW LEVEL SECURITY","-- FI Tables\nALTER TABLE fi_account ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_invoice ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_transaction ENABLE ROW LEVEL SECURITY","-- CO Tables\nALTER TABLE co_cost_center ENABLE ROW LEVEL SECURITY","ALTER TABLE co_fiscal_period ENABLE ROW LEVEL SECURITY","ALTER TABLE co_kpi_definition ENABLE ROW LEVEL SECURITY","ALTER TABLE co_kpi_snapshot ENABLE ROW LEVEL SECURITY","ALTER TABLE co_dashboard_tile ENABLE ROW LEVEL SECURITY","-- Setup Tables\nALTER TABLE mm_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_category_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_classification_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_price_channel_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_currency_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_vendor_rating_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_order_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_shipment_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_carrier_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_channel_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_source_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_lead_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_opp_stage_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment_method_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment_terms_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_tax_code_def ENABLE ROW LEVEL SECURITY","ALTER TABLE co_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE import_job ENABLE ROW LEVEL SECURITY","ALTER TABLE import_log ENABLE ROW LEVEL SECURITY","-- Create RLS policies for tenant isolation\n-- All policies follow the pattern: tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'\n\n-- Core tables policies\nCREATE POLICY \\"tenant_isolation_tenant\\" ON tenant\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_user_profile\\" ON user_profile\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_role_permission\\" ON role_permission\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_app_setting\\" ON app_setting\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_doc_numbering\\" ON doc_numbering\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_audit_log\\" ON audit_log\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- MM tables policies\nCREATE POLICY \\"tenant_isolation_mm_vendor\\" ON mm_vendor\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_material\\" ON mm_material\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_purchase_order\\" ON mm_purchase_order\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_purchase_order_item\\" ON mm_purchase_order_item\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_receiving\\" ON mm_receiving\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- WH tables policies\nCREATE POLICY \\"tenant_isolation_wh_warehouse\\" ON wh_warehouse\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_wh_inventory_balance\\" ON wh_inventory_balance\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_wh_inventory_ledger\\" ON wh_inventory_ledger\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- SD tables policies\nCREATE POLICY \\"tenant_isolation_crm_customer\\" ON crm_customer\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_sales_order\\" ON sd_sales_order\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_sales_order_item\\" ON sd_sales_order_item\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_shipment\\" ON sd_shipment\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_payment\\" ON sd_payment\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- CRM tables policies\nCREATE POLICY \\"tenant_isolation_crm_lead\\" ON crm_lead\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_opportunity\\" ON crm_opportunity\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_interaction\\" ON crm_interaction\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- FI tables policies\nCREATE POLICY \\"tenant_isolation_fi_account\\" ON fi_account\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_invoice\\" ON fi_invoice\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_payment\\" ON fi_payment\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_transaction\\" ON fi_transaction\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- CO tables policies\nCREATE POLICY \\"tenant_isolation_co_cost_center\\" ON co_cost_center\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_co_fiscal_period\\" ON co_fiscal_period\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_co_kpi_definition\\" ON co_kpi_definition\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_co_kpi_snapshot\\" ON co_kpi_snapshot\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_co_dashboard_tile\\" ON co_dashboard_tile\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","-- Setup tables policies\nCREATE POLICY \\"tenant_isolation_mm_setup\\" ON mm_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_category_def\\" ON mm_category_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_classification_def\\" ON mm_classification_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_price_channel_def\\" ON mm_price_channel_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_currency_def\\" ON mm_currency_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_vendor_rating_def\\" ON mm_vendor_rating_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_mm_status_def\\" ON mm_status_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_wh_setup\\" ON wh_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_wh_inventory_status_def\\" ON wh_inventory_status_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_setup\\" ON sd_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_order_status_def\\" ON sd_order_status_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_shipment_status_def\\" ON sd_shipment_status_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_carrier_def\\" ON sd_carrier_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_sd_channel_def\\" ON sd_channel_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_setup\\" ON crm_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_source_def\\" ON crm_source_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_lead_status_def\\" ON crm_lead_status_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_crm_opp_stage_def\\" ON crm_opp_stage_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_setup\\" ON fi_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_payment_method_def\\" ON fi_payment_method_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_payment_terms_def\\" ON fi_payment_terms_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_fi_tax_code_def\\" ON fi_tax_code_def\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_co_setup\\" ON co_setup\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_import_job\\" ON import_job\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')","CREATE POLICY \\"tenant_isolation_import_log\\" ON import_log\n    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')"}	rls_policies
20240101000004	{"-- Function to get next document number atomically\nCREATE OR REPLACE FUNCTION next_doc_number(\n    p_tenant_id TEXT,\n    p_doc_type TEXT\n) RETURNS TEXT AS $$\nDECLARE\n    v_next_seq INTEGER;\n    v_prefix TEXT;\n    v_format TEXT;\n    v_doc_number TEXT;\nBEGIN\n    -- Get the next sequence number atomically\n    UPDATE doc_numbering \n    SET next_seq = next_seq + 1\n    WHERE tenant_id = p_tenant_id \n      AND doc_type = p_doc_type \n      AND is_active = TRUE\n    RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;\n    \n    -- If no row was updated, create a new one\n    IF NOT FOUND THEN\n        INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)\n        VALUES (p_tenant_id, p_doc_type, p_doc_type, 'YYYYMM-SEQ6', 1, TRUE)\n        ON CONFLICT (tenant_id, doc_type) DO UPDATE SET\n            next_seq = doc_numbering.next_seq + 1,\n            is_active = TRUE\n        RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;\n    END IF;\n    \n    -- Format the document number\n    v_doc_number := v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(v_next_seq::TEXT, 6, '0');\n    \n    RETURN v_doc_number;\nEND;\n$$ LANGUAGE plpgsql","-- Function to update inventory balance\nCREATE OR REPLACE FUNCTION update_inventory_balance(\n    p_tenant_id TEXT,\n    p_plant_id TEXT,\n    p_mm_material TEXT,\n    p_qty_change NUMERIC,\n    p_movement_type TEXT\n) RETURNS VOID AS $$\nBEGIN\n    -- Update or insert inventory balance\n    INSERT INTO wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty)\n    VALUES (p_tenant_id, p_plant_id, p_mm_material, \n            CASE WHEN p_movement_type = 'IN' THEN p_qty_change ELSE 0 END,\n            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change ELSE 0 END)\n    ON CONFLICT (tenant_id, plant_id, mm_material) DO UPDATE SET\n        on_hand_qty = wh_inventory_balance.on_hand_qty + \n            CASE WHEN p_movement_type = 'IN' THEN p_qty_change\n                 WHEN p_movement_type = 'OUT' THEN -p_qty_change\n                 ELSE 0 END,\n        reserved_qty = wh_inventory_balance.reserved_qty + \n            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change\n                 WHEN p_movement_type = 'RELEASE' THEN -p_qty_change\n                 ELSE 0 END;\n    \n    -- Insert ledger entry\n    INSERT INTO wh_inventory_ledger (tenant_id, plant_id, mm_material, movement, qty, ref_type, ref_id)\n    VALUES (p_tenant_id, p_plant_id, p_mm_material, p_movement_type::movement_type, p_qty_change, 'MANUAL', 'SYSTEM');\nEND;\n$$ LANGUAGE plpgsql","-- Function to validate warehouse default constraint\nCREATE OR REPLACE FUNCTION validate_warehouse_default()\nRETURNS TRIGGER AS $$\nBEGIN\n    -- If setting is_default to true, ensure no other warehouse for this tenant is default\n    IF NEW.is_default = TRUE THEN\n        UPDATE wh_warehouse \n        SET is_default = FALSE \n        WHERE tenant_id = NEW.tenant_id \n          AND plant_id != NEW.plant_id \n          AND is_default = TRUE;\n    END IF;\n    \n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Trigger for warehouse default validation\nCREATE TRIGGER trg_validate_warehouse_default\n    BEFORE INSERT OR UPDATE ON wh_warehouse\n    FOR EACH ROW\n    EXECUTE FUNCTION validate_warehouse_default()","-- Function to calculate line totals for purchase order items\nCREATE OR REPLACE FUNCTION calculate_po_item_totals()\nRETURNS TRIGGER AS $$\nBEGIN\n    NEW.line_total_cents := NEW.mm_qtt * NEW.unit_cost_cents;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Trigger for purchase order item totals\nCREATE TRIGGER trg_calculate_po_item_totals\n    BEFORE INSERT OR UPDATE ON mm_purchase_order_item\n    FOR EACH ROW\n    EXECUTE FUNCTION calculate_po_item_totals()","-- Function to calculate line totals for sales order items\nCREATE OR REPLACE FUNCTION calculate_so_item_totals()\nRETURNS TRIGGER AS $$\nBEGIN\n    NEW.line_total_cents := NEW.quantity * NEW.unit_price_cents;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Trigger for sales order item totals\nCREATE TRIGGER trg_calculate_so_item_totals\n    BEFORE INSERT OR UPDATE ON sd_sales_order_item\n    FOR EACH ROW\n    EXECUTE FUNCTION calculate_so_item_totals()","-- Function to update sales order total\nCREATE OR REPLACE FUNCTION update_sales_order_total()\nRETURNS TRIGGER AS $$\nDECLARE\n    v_total_cents INTEGER;\nBEGIN\n    -- Calculate total from all items\n    SELECT COALESCE(SUM(line_total_cents), 0)\n    INTO v_total_cents\n    FROM sd_sales_order_item\n    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);\n    \n    -- Update the sales order total\n    UPDATE sd_sales_order\n    SET total_cents = v_total_cents\n    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);\n    \n    RETURN COALESCE(NEW, OLD);\nEND;\n$$ LANGUAGE plpgsql","-- Trigger for sales order total update\nCREATE TRIGGER trg_update_sales_order_total\n    AFTER INSERT OR UPDATE OR DELETE ON sd_sales_order_item\n    FOR EACH ROW\n    EXECUTE FUNCTION update_sales_order_total()","-- Function to create audit log entry\nCREATE OR REPLACE FUNCTION create_audit_log(\n    p_tenant_id TEXT,\n    p_table_name TEXT,\n    p_record_pk TEXT,\n    p_action TEXT,\n    p_diff_json JSONB,\n    p_actor_user UUID\n) RETURNS VOID AS $$\nBEGIN\n    INSERT INTO audit_log (tenant_id, table_name, record_pk, action, diff_json, actor_user)\n    VALUES (p_tenant_id, p_table_name, p_record_pk, p_action, p_diff_json, p_actor_user);\nEND;\n$$ LANGUAGE plpgsql","-- Function to refresh KPI snapshots\nCREATE OR REPLACE FUNCTION refresh_kpi_snapshots(p_tenant_id TEXT)\nRETURNS VOID AS $$\nDECLARE\n    v_orders_today INTEGER;\n    v_month_revenue_cents INTEGER;\n    v_active_leads INTEGER;\n    v_stock_critical_count INTEGER;\n    v_snapshot_at TIMESTAMPTZ := NOW();\nBEGIN\n    -- Orders today\n    SELECT COUNT(*)\n    INTO v_orders_today\n    FROM sd_sales_order\n    WHERE tenant_id = p_tenant_id\n      AND order_date = CURRENT_DATE;\n    \n    -- Month revenue\n    SELECT COALESCE(SUM(total_cents), 0)\n    INTO v_month_revenue_cents\n    FROM sd_sales_order\n    WHERE tenant_id = p_tenant_id\n      AND order_date >= DATE_TRUNC('month', CURRENT_DATE)\n      AND order_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';\n    \n    -- Active leads (last 7 days)\n    SELECT COUNT(*)\n    INTO v_active_leads\n    FROM crm_lead\n    WHERE tenant_id = p_tenant_id\n      AND created_date >= CURRENT_DATE - INTERVAL '7 days'\n      AND status != 'convertido';\n    \n    -- Stock critical count (assuming critical = on_hand_qty < 10)\n    SELECT COUNT(*)\n    INTO v_stock_critical_count\n    FROM wh_inventory_balance\n    WHERE tenant_id = p_tenant_id\n      AND on_hand_qty < 10;\n    \n    -- Insert/update KPI snapshots\n    INSERT INTO co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number)\n    VALUES \n        (p_tenant_id, 'kpi_orders_today', v_snapshot_at, v_orders_today),\n        (p_tenant_id, 'kpi_month_revenue_cents', v_snapshot_at, v_month_revenue_cents),\n        (p_tenant_id, 'kpi_active_leads', v_snapshot_at, v_active_leads),\n        (p_tenant_id, 'kpi_stock_critical_count', v_snapshot_at, v_stock_critical_count)\n    ON CONFLICT (tenant_id, kpi_key, snapshot_at) DO UPDATE SET\n        value_number = EXCLUDED.value_number;\nEND;\n$$ LANGUAGE plpgsql","-- Create indexes for performance\nCREATE INDEX idx_mm_purchase_order_item_tenant_order ON mm_purchase_order_item(tenant_id, mm_order)","CREATE INDEX idx_mm_receiving_tenant_order ON mm_receiving(tenant_id, mm_order)","CREATE INDEX idx_wh_inventory_balance_tenant_plant_material ON wh_inventory_balance(tenant_id, plant_id, mm_material)","CREATE INDEX idx_sd_sales_order_item_tenant_so ON sd_sales_order_item(tenant_id, so_id)","CREATE INDEX idx_co_kpi_snapshot_tenant_key_time ON co_kpi_snapshot(tenant_id, kpi_key, snapshot_at DESC)","CREATE INDEX idx_audit_log_tenant_table ON audit_log(tenant_id, table_name)","CREATE INDEX idx_audit_log_created_at ON audit_log(created_at)"}	functions_triggers
20240101000005	{"-- Simple Schema Standardization Migration\n-- Focus on essential changes only\n\n-- ========================================\n-- 1. Add missing columns for proper functionality\n-- ========================================\n\n-- Add commercial_name if it doesn't exist\nALTER TABLE mm_material ADD COLUMN IF NOT EXISTS commercial_name text","-- Add missing columns to wh_warehouse\nALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS address text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS city text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS state text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS zip_code text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS country text DEFAULT 'Brasil'","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS contact_person text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS phone text","ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS email text","-- Add missing columns to mm_vendor\nALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS contact_person text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS address text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS city text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS state text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS zip_code text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS country text DEFAULT 'Brasil'","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS tax_id text","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS payment_terms integer DEFAULT 30","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS rating text DEFAULT 'B'","ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'","-- Add missing columns to mm_material\nALTER TABLE mm_material ADD COLUMN IF NOT EXISTS unit_of_measure text DEFAULT 'unidade'","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS weight_grams numeric(10,2)","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS dimensions text","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS purity text","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS color text","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS finish text","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS min_stock integer DEFAULT 0","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS max_stock integer DEFAULT 1000","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS lead_time_days integer DEFAULT 7","ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'","-- Add missing columns to wh_inventory_balance\nALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS last_count_date date","ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'","-- Add quantity_available as computed column only if the required columns exist\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'quantity_on_hand') \n       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'quantity_reserved') THEN\n        ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS quantity_available integer GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED;\n    END IF;\nEND $$","-- Add missing columns to mm_purchase_order\nALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS total_amount bigint DEFAULT 0","ALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BRL'","ALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS notes text","-- Add missing columns to mm_purchase_order_item\nALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BRL'","ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS notes text","-- Add total_price as computed column only if the required columns exist\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'quantity') \n       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'unit_price') THEN\n        ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS total_price bigint GENERATED ALWAYS AS (quantity * unit_price) STORED;\n    END IF;\nEND $$","-- Add missing columns to mm_receiving\nALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS received_by text","ALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS status text DEFAULT 'received'","ALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS notes text","-- ========================================\n-- 2. Create essential indexes for Free Tier optimization\n-- ========================================\n\n-- Purchase Order indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'mm_order') THEN\n        CREATE INDEX IF NOT EXISTS ix_po_item_order ON mm_purchase_order_item(tenant_id, mm_order);\n    END IF;\n    \n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_receiving' AND column_name = 'mm_order') THEN\n        CREATE INDEX IF NOT EXISTS ix_receiving_order ON mm_receiving(tenant_id, mm_order);\n    END IF;\nEND $$","-- Inventory indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'sku') THEN\n        CREATE INDEX IF NOT EXISTS ix_inv_balance_key ON wh_inventory_balance(tenant_id, plant_id, sku);\n    END IF;\nEND $$","-- Sales Order indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sd_sales_order_item' AND column_name = 'so_id') THEN\n        CREATE INDEX IF NOT EXISTS ix_so_item_order ON sd_sales_order_item(tenant_id, so_id);\n    END IF;\nEND $$","-- KPI indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'co_kpi_snapshot' AND column_name = 'kpi_key') THEN\n        CREATE INDEX IF NOT EXISTS ix_kpi_snapshot ON co_kpi_snapshot(tenant_id, kpi_key, snapshot_at DESC);\n    END IF;\nEND $$","-- Customer indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_customer' AND column_name = 'customer_id') THEN\n        CREATE INDEX IF NOT EXISTS ix_customer ON crm_customer(tenant_id, customer_id);\n    END IF;\nEND $$","-- Material indexes (only if columns exist)\nDO $$ \nBEGIN\n    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_material' AND column_name = 'sku') THEN\n        CREATE INDEX IF NOT EXISTS ix_material ON mm_material(tenant_id, sku);\n    END IF;\nEND $$","-- ========================================\n-- 3. Add unique constraint for default warehouse per tenant\n-- ========================================\n\n-- Create unique index for default warehouse per tenant\nCREATE UNIQUE INDEX IF NOT EXISTS ux_wh_default_per_tenant\nON wh_warehouse(tenant_id) WHERE is_default = true","-- ========================================\n-- 4. Update function for document numbering\n-- ========================================\n\n-- Drop existing function if it exists\nDROP FUNCTION IF EXISTS next_doc_number(text, text)","CREATE OR REPLACE FUNCTION next_doc_number(p_tenant text, p_doc_type text)\nRETURNS text LANGUAGE plpgsql AS $$\nDECLARE\n  v_prefix text;\n  v_format text;\n  v_next integer;\n  v_num text;\nBEGIN\n  UPDATE doc_numbering\n     SET next_seq = next_seq + 1\n   WHERE tenant_id = p_tenant AND doc_type = p_doc_type AND is_active = true\n  RETURNING prefix, format, next_seq INTO v_prefix, v_format, v_next;\n\n  IF v_prefix IS NULL THEN\n    RAISE EXCEPTION 'doc_numbering missing for tenant=% and type=%', p_tenant, p_doc_type;\n  END IF;\n\n  -- Suporta formato 'YYYYMM-SEQ6'\n  v_num := to_char(now(), 'YYYYMM') || '-' || lpad(v_next::text, 6, '0');\n  RETURN v_prefix || v_num;\nEND $$","-- ========================================\n-- 5. Create triggers for calculated fields\n-- ========================================\n\n-- Trigger to update purchase order total when items change\nCREATE OR REPLACE FUNCTION trg_update_po_total()\nRETURNS TRIGGER AS $$\nBEGIN\n  UPDATE mm_purchase_order \n  SET total_amount = (\n    SELECT COALESCE(SUM(total_price), 0) \n    FROM mm_purchase_order_item \n    WHERE tenant_id = NEW.tenant_id AND mm_order = NEW.mm_order\n  )\n  WHERE tenant_id = NEW.tenant_id AND mm_order = NEW.mm_order;\n  \n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","DROP TRIGGER IF EXISTS trg_calculate_po_item_totals ON mm_purchase_order_item","CREATE TRIGGER trg_calculate_po_item_totals\n  AFTER INSERT OR UPDATE OR DELETE ON mm_purchase_order_item\n  FOR EACH ROW EXECUTE FUNCTION trg_update_po_total()","-- Trigger to validate only one default warehouse per tenant\nCREATE OR REPLACE FUNCTION trg_validate_warehouse_default()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF NEW.is_default = true THEN\n    UPDATE wh_warehouse \n    SET is_default = false \n    WHERE tenant_id = NEW.tenant_id AND warehouse_id != NEW.warehouse_id;\n  END IF;\n  \n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","DROP TRIGGER IF EXISTS trg_validate_warehouse_default ON wh_warehouse","CREATE TRIGGER trg_validate_warehouse_default\n  BEFORE INSERT OR UPDATE ON wh_warehouse\n  FOR EACH ROW EXECUTE FUNCTION trg_validate_warehouse_default()"}	schema_standardization
20240101000006	{"-- Complete RLS Policies for All Tables\n-- Enable RLS and create policies for all business and customizing tables\n\n-- ========================================\n-- Enable RLS on all tables\n-- ========================================\n\n-- Business tables\nALTER TABLE tenant ENABLE ROW LEVEL SECURITY","ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY","ALTER TABLE role_permission ENABLE ROW LEVEL SECURITY","ALTER TABLE app_setting ENABLE ROW LEVEL SECURITY","ALTER TABLE doc_numbering ENABLE ROW LEVEL SECURITY","ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY","ALTER TABLE import_job ENABLE ROW LEVEL SECURITY","ALTER TABLE import_log ENABLE ROW LEVEL SECURITY","-- MM (Materials Management)\nALTER TABLE mm_vendor ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_material ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_purchase_order ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_purchase_order_item ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_receiving ENABLE ROW LEVEL SECURITY","-- WH (Warehouse)\nALTER TABLE wh_warehouse ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_balance ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_ledger ENABLE ROW LEVEL SECURITY","-- SD (Sales & Distribution)\nALTER TABLE crm_customer ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_sales_order ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_sales_order_item ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_shipment ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_payment ENABLE ROW LEVEL SECURITY","-- CRM\nALTER TABLE crm_lead ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_opportunity ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_interaction ENABLE ROW LEVEL SECURITY","-- FI (Finance)\nALTER TABLE fi_account ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_invoice ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_transaction ENABLE ROW LEVEL SECURITY","-- CO (Controlling)\nALTER TABLE co_cost_center ENABLE ROW LEVEL SECURITY","ALTER TABLE co_fiscal_period ENABLE ROW LEVEL SECURITY","ALTER TABLE co_kpi_definition ENABLE ROW LEVEL SECURITY","ALTER TABLE co_kpi_snapshot ENABLE ROW LEVEL SECURITY","ALTER TABLE co_dashboard_tile ENABLE ROW LEVEL SECURITY","-- Setup tables\nALTER TABLE mm_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_setup ENABLE ROW LEVEL SECURITY","ALTER TABLE co_setup ENABLE ROW LEVEL SECURITY","-- Definition tables\nALTER TABLE mm_category_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_classification_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_price_channel_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_currency_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_vendor_rating_def ENABLE ROW LEVEL SECURITY","ALTER TABLE mm_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE wh_inventory_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_order_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_shipment_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_carrier_def ENABLE ROW LEVEL SECURITY","ALTER TABLE sd_channel_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_source_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_lead_status_def ENABLE ROW LEVEL SECURITY","ALTER TABLE crm_opp_stage_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment_method_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_payment_terms_def ENABLE ROW LEVEL SECURITY","ALTER TABLE fi_tax_code_def ENABLE ROW LEVEL SECURITY","-- ========================================\n-- Create RLS Policies for all tables\n-- ========================================\n\n-- Function to create standard RLS policies for a table\nCREATE OR REPLACE FUNCTION create_rls_policies(table_name text)\nRETURNS void AS $$\nBEGIN\n  EXECUTE format('\n    DROP POLICY IF EXISTS sel_%I ON %I;\n    CREATE POLICY sel_%I ON %I\n    FOR SELECT USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');\n  ', table_name, table_name, table_name, table_name);\n  \n  EXECUTE format('\n    DROP POLICY IF EXISTS ins_%I ON %I;\n    CREATE POLICY ins_%I ON %I\n    FOR INSERT WITH CHECK (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');\n  ', table_name, table_name, table_name, table_name);\n  \n  EXECUTE format('\n    DROP POLICY IF EXISTS upd_%I ON %I;\n    CREATE POLICY upd_%I ON %I\n    FOR UPDATE USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'')\n             WITH CHECK (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');\n  ', table_name, table_name, table_name, table_name);\n  \n  EXECUTE format('\n    DROP POLICY IF EXISTS del_%I ON %I;\n    CREATE POLICY del_%I ON %I\n    FOR DELETE USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');\n  ', table_name, table_name, table_name, table_name);\nEND;\n$$ LANGUAGE plpgsql","-- Apply RLS policies to all tables\nSELECT create_rls_policies('tenant')","SELECT create_rls_policies('user_profile')","SELECT create_rls_policies('role_permission')","SELECT create_rls_policies('app_setting')","SELECT create_rls_policies('doc_numbering')","SELECT create_rls_policies('audit_log')","SELECT create_rls_policies('import_job')","SELECT create_rls_policies('import_log')","-- MM tables\nSELECT create_rls_policies('mm_vendor')","SELECT create_rls_policies('mm_material')","SELECT create_rls_policies('mm_purchase_order')","SELECT create_rls_policies('mm_purchase_order_item')","SELECT create_rls_policies('mm_receiving')","-- WH tables\nSELECT create_rls_policies('wh_warehouse')","SELECT create_rls_policies('wh_inventory_balance')","SELECT create_rls_policies('wh_inventory_ledger')","-- SD tables\nSELECT create_rls_policies('crm_customer')","SELECT create_rls_policies('sd_sales_order')","SELECT create_rls_policies('sd_sales_order_item')","SELECT create_rls_policies('sd_shipment')","SELECT create_rls_policies('sd_payment')","-- CRM tables\nSELECT create_rls_policies('crm_lead')","SELECT create_rls_policies('crm_opportunity')","SELECT create_rls_policies('crm_interaction')","-- FI tables\nSELECT create_rls_policies('fi_account')","SELECT create_rls_policies('fi_invoice')","SELECT create_rls_policies('fi_payment')","SELECT create_rls_policies('fi_transaction')","-- CO tables\nSELECT create_rls_policies('co_cost_center')","SELECT create_rls_policies('co_fiscal_period')","SELECT create_rls_policies('co_kpi_definition')","SELECT create_rls_policies('co_kpi_snapshot')","SELECT create_rls_policies('co_dashboard_tile')","-- Setup tables\nSELECT create_rls_policies('mm_setup')","SELECT create_rls_policies('wh_setup')","SELECT create_rls_policies('sd_setup')","SELECT create_rls_policies('crm_setup')","SELECT create_rls_policies('fi_setup')","SELECT create_rls_policies('co_setup')","-- Definition tables\nSELECT create_rls_policies('mm_category_def')","SELECT create_rls_policies('mm_classification_def')","SELECT create_rls_policies('mm_price_channel_def')","SELECT create_rls_policies('mm_currency_def')","SELECT create_rls_policies('mm_vendor_rating_def')","SELECT create_rls_policies('mm_status_def')","SELECT create_rls_policies('wh_inventory_status_def')","SELECT create_rls_policies('sd_order_status_def')","SELECT create_rls_policies('sd_shipment_status_def')","SELECT create_rls_policies('sd_carrier_def')","SELECT create_rls_policies('sd_channel_def')","SELECT create_rls_policies('crm_source_def')","SELECT create_rls_policies('crm_lead_status_def')","SELECT create_rls_policies('crm_opp_stage_def')","SELECT create_rls_policies('fi_payment_method_def')","SELECT create_rls_policies('fi_payment_terms_def')","SELECT create_rls_policies('fi_tax_code_def')","-- Drop the helper function\nDROP FUNCTION create_rls_policies(text)"}	rls_policies_complete
\.


--
-- TOC entry 4925 (class 0 OID 20109)
-- Dependencies: 345
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- TOC entry 3876 (class 0 OID 16658)
-- Dependencies: 318
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 310
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 25, true);


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 351
-- Name: audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_audit_id_seq', 1, false);


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 371
-- Name: crm_interaction_interaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crm_interaction_interaction_id_seq', 1, false);


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 405
-- Name: import_job_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_job_job_id_seq', 1, false);


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 407
-- Name: import_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_log_log_id_seq', 1, false);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 356
-- Name: mm_purchase_order_item_po_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mm_purchase_order_item_po_item_id_seq', 106, true);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 358
-- Name: mm_receiving_recv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mm_receiving_recv_id_seq', 35, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 362
-- Name: wh_inventory_ledger_ledger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wh_inventory_ledger_ledger_id_seq', 1, false);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 337
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4151 (class 2606 OID 16827)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4106 (class 2606 OID 16531)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4174 (class 2606 OID 16933)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4130 (class 2606 OID 16951)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4132 (class 2606 OID 16961)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4104 (class 2606 OID 16524)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4153 (class 2606 OID 16820)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4149 (class 2606 OID 16808)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4141 (class 2606 OID 17001)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4143 (class 2606 OID 16795)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4184 (class 2606 OID 17022)
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- TOC entry 4187 (class 2606 OID 17020)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4178 (class 2606 OID 16986)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4098 (class 2606 OID 16514)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4101 (class 2606 OID 16738)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4163 (class 2606 OID 16867)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4165 (class 2606 OID 16865)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4170 (class 2606 OID 16881)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4109 (class 2606 OID 16537)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4136 (class 2606 OID 16759)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4160 (class 2606 OID 16848)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4155 (class 2606 OID 16839)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4091 (class 2606 OID 16921)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4093 (class 2606 OID 16501)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4217 (class 2606 OID 42414)
-- Name: app_setting app_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_setting
    ADD CONSTRAINT app_setting_pkey PRIMARY KEY (tenant_id, key);


--
-- TOC entry 4221 (class 2606 OID 42433)
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 4276 (class 2606 OID 42729)
-- Name: co_cost_center co_cost_center_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_cost_center
    ADD CONSTRAINT co_cost_center_pkey PRIMARY KEY (cc_id);


--
-- TOC entry 4286 (class 2606 OID 42773)
-- Name: co_dashboard_tile co_dashboard_tile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_dashboard_tile
    ADD CONSTRAINT co_dashboard_tile_pkey PRIMARY KEY (tile_id);


--
-- TOC entry 4278 (class 2606 OID 42743)
-- Name: co_fiscal_period co_fiscal_period_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_fiscal_period
    ADD CONSTRAINT co_fiscal_period_pkey PRIMARY KEY (period_id);


--
-- TOC entry 4280 (class 2606 OID 42751)
-- Name: co_kpi_definition co_kpi_definition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_kpi_definition
    ADD CONSTRAINT co_kpi_definition_pkey PRIMARY KEY (kpi_key);


--
-- TOC entry 4282 (class 2606 OID 42758)
-- Name: co_kpi_snapshot co_kpi_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_kpi_snapshot
    ADD CONSTRAINT co_kpi_snapshot_pkey PRIMARY KEY (tenant_id, kpi_key, snapshot_at);


--
-- TOC entry 4332 (class 2606 OID 42982)
-- Name: co_setup co_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_setup
    ADD CONSTRAINT co_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4249 (class 2606 OID 42553)
-- Name: crm_customer crm_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_customer
    ADD CONSTRAINT crm_customer_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 4266 (class 2606 OID 42649)
-- Name: crm_interaction crm_interaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_interaction
    ADD CONSTRAINT crm_interaction_pkey PRIMARY KEY (interaction_id);


--
-- TOC entry 4262 (class 2606 OID 42624)
-- Name: crm_lead crm_lead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_lead
    ADD CONSTRAINT crm_lead_pkey PRIMARY KEY (lead_id);


--
-- TOC entry 4320 (class 2606 OID 42930)
-- Name: crm_lead_status_def crm_lead_status_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_lead_status_def
    ADD CONSTRAINT crm_lead_status_def_pkey PRIMARY KEY (tenant_id, status);


--
-- TOC entry 4322 (class 2606 OID 42939)
-- Name: crm_opp_stage_def crm_opp_stage_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_opp_stage_def
    ADD CONSTRAINT crm_opp_stage_def_pkey PRIMARY KEY (tenant_id, stage);


--
-- TOC entry 4264 (class 2606 OID 42634)
-- Name: crm_opportunity crm_opportunity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_opportunity
    ADD CONSTRAINT crm_opportunity_pkey PRIMARY KEY (opp_id);


--
-- TOC entry 4316 (class 2606 OID 42913)
-- Name: crm_setup crm_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_setup
    ADD CONSTRAINT crm_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4318 (class 2606 OID 42921)
-- Name: crm_source_def crm_source_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_source_def
    ADD CONSTRAINT crm_source_def_pkey PRIMARY KEY (tenant_id, source);


--
-- TOC entry 4219 (class 2606 OID 42423)
-- Name: doc_numbering doc_numbering_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doc_numbering
    ADD CONSTRAINT doc_numbering_pkey PRIMARY KEY (tenant_id, doc_type);


--
-- TOC entry 4268 (class 2606 OID 42664)
-- Name: fi_account fi_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_account
    ADD CONSTRAINT fi_account_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4270 (class 2606 OID 42674)
-- Name: fi_invoice fi_invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_invoice
    ADD CONSTRAINT fi_invoice_pkey PRIMARY KEY (invoice_id);


--
-- TOC entry 4326 (class 2606 OID 42957)
-- Name: fi_payment_method_def fi_payment_method_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_payment_method_def
    ADD CONSTRAINT fi_payment_method_def_pkey PRIMARY KEY (tenant_id, method);


--
-- TOC entry 4272 (class 2606 OID 42695)
-- Name: fi_payment fi_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_payment
    ADD CONSTRAINT fi_payment_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4328 (class 2606 OID 42965)
-- Name: fi_payment_terms_def fi_payment_terms_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_payment_terms_def
    ADD CONSTRAINT fi_payment_terms_def_pkey PRIMARY KEY (tenant_id, terms_code);


--
-- TOC entry 4324 (class 2606 OID 42949)
-- Name: fi_setup fi_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_setup
    ADD CONSTRAINT fi_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4330 (class 2606 OID 42973)
-- Name: fi_tax_code_def fi_tax_code_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_tax_code_def
    ADD CONSTRAINT fi_tax_code_def_pkey PRIMARY KEY (tenant_id, tax_code);


--
-- TOC entry 4274 (class 2606 OID 42715)
-- Name: fi_transaction fi_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_transaction
    ADD CONSTRAINT fi_transaction_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 4334 (class 2606 OID 42996)
-- Name: import_job import_job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_job
    ADD CONSTRAINT import_job_pkey PRIMARY KEY (job_id);


--
-- TOC entry 4336 (class 2606 OID 43006)
-- Name: import_log import_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log
    ADD CONSTRAINT import_log_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4290 (class 2606 OID 42800)
-- Name: mm_category_def mm_category_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_category_def
    ADD CONSTRAINT mm_category_def_pkey PRIMARY KEY (tenant_id, category);


--
-- TOC entry 4292 (class 2606 OID 42808)
-- Name: mm_classification_def mm_classification_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_classification_def
    ADD CONSTRAINT mm_classification_def_pkey PRIMARY KEY (tenant_id, classification);


--
-- TOC entry 4296 (class 2606 OID 42824)
-- Name: mm_currency_def mm_currency_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_currency_def
    ADD CONSTRAINT mm_currency_def_pkey PRIMARY KEY (tenant_id, currency);


--
-- TOC entry 4227 (class 2606 OID 42451)
-- Name: mm_material mm_material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_material
    ADD CONSTRAINT mm_material_pkey PRIMARY KEY (mm_material);


--
-- TOC entry 4294 (class 2606 OID 42816)
-- Name: mm_price_channel_def mm_price_channel_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_price_channel_def
    ADD CONSTRAINT mm_price_channel_def_pkey PRIMARY KEY (tenant_id, channel);


--
-- TOC entry 4233 (class 2606 OID 42483)
-- Name: mm_purchase_order_item mm_purchase_order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order_item
    ADD CONSTRAINT mm_purchase_order_item_pkey PRIMARY KEY (po_item_id);


--
-- TOC entry 4229 (class 2606 OID 42466)
-- Name: mm_purchase_order mm_purchase_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order
    ADD CONSTRAINT mm_purchase_order_pkey PRIMARY KEY (mm_order);


--
-- TOC entry 4237 (class 2606 OID 42504)
-- Name: mm_receiving mm_receiving_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_receiving
    ADD CONSTRAINT mm_receiving_pkey PRIMARY KEY (recv_id);


--
-- TOC entry 4288 (class 2606 OID 42792)
-- Name: mm_setup mm_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_setup
    ADD CONSTRAINT mm_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4300 (class 2606 OID 42841)
-- Name: mm_status_def mm_status_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_status_def
    ADD CONSTRAINT mm_status_def_pkey PRIMARY KEY (tenant_id, object_type, status);


--
-- TOC entry 4225 (class 2606 OID 42441)
-- Name: mm_vendor mm_vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_vendor
    ADD CONSTRAINT mm_vendor_pkey PRIMARY KEY (vendor_id);


--
-- TOC entry 4298 (class 2606 OID 42832)
-- Name: mm_vendor_rating_def mm_vendor_rating_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_vendor_rating_def
    ADD CONSTRAINT mm_vendor_rating_def_pkey PRIMARY KEY (tenant_id, rating);


--
-- TOC entry 4215 (class 2606 OID 42406)
-- Name: role_permission role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (tenant_id, role, resource, action);


--
-- TOC entry 4312 (class 2606 OID 42896)
-- Name: sd_carrier_def sd_carrier_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_carrier_def
    ADD CONSTRAINT sd_carrier_def_pkey PRIMARY KEY (tenant_id, carrier_code);


--
-- TOC entry 4314 (class 2606 OID 42904)
-- Name: sd_channel_def sd_channel_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_channel_def
    ADD CONSTRAINT sd_channel_def_pkey PRIMARY KEY (tenant_id, channel);


--
-- TOC entry 4308 (class 2606 OID 42879)
-- Name: sd_order_status_def sd_order_status_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_order_status_def
    ADD CONSTRAINT sd_order_status_def_pkey PRIMARY KEY (tenant_id, status);


--
-- TOC entry 4260 (class 2606 OID 42610)
-- Name: sd_payment sd_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_payment
    ADD CONSTRAINT sd_payment_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4256 (class 2606 OID 42580)
-- Name: sd_sales_order_item sd_sales_order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_sales_order_item
    ADD CONSTRAINT sd_sales_order_item_pkey PRIMARY KEY (tenant_id, so_id, sku, row_no);


--
-- TOC entry 4252 (class 2606 OID 42564)
-- Name: sd_sales_order sd_sales_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_sales_order
    ADD CONSTRAINT sd_sales_order_pkey PRIMARY KEY (so_id);


--
-- TOC entry 4306 (class 2606 OID 42870)
-- Name: sd_setup sd_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_setup
    ADD CONSTRAINT sd_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4258 (class 2606 OID 42594)
-- Name: sd_shipment sd_shipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_shipment
    ADD CONSTRAINT sd_shipment_pkey PRIMARY KEY (shipment_id);


--
-- TOC entry 4310 (class 2606 OID 42888)
-- Name: sd_shipment_status_def sd_shipment_status_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_shipment_status_def
    ADD CONSTRAINT sd_shipment_status_def_pkey PRIMARY KEY (tenant_id, status);


--
-- TOC entry 4211 (class 2606 OID 42388)
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4213 (class 2606 OID 42398)
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4245 (class 2606 OID 42533)
-- Name: wh_inventory_balance wh_inventory_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_inventory_balance
    ADD CONSTRAINT wh_inventory_balance_pkey PRIMARY KEY (tenant_id, plant_id, mm_material);


--
-- TOC entry 4247 (class 2606 OID 42543)
-- Name: wh_inventory_ledger wh_inventory_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_inventory_ledger
    ADD CONSTRAINT wh_inventory_ledger_pkey PRIMARY KEY (ledger_id);


--
-- TOC entry 4304 (class 2606 OID 42859)
-- Name: wh_inventory_status_def wh_inventory_status_def_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_inventory_status_def
    ADD CONSTRAINT wh_inventory_status_def_pkey PRIMARY KEY (tenant_id, status);


--
-- TOC entry 4302 (class 2606 OID 42851)
-- Name: wh_setup wh_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_setup
    ADD CONSTRAINT wh_setup_pkey PRIMARY KEY (tenant_id);


--
-- TOC entry 4242 (class 2606 OID 42523)
-- Name: wh_warehouse wh_warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_warehouse
    ADD CONSTRAINT wh_warehouse_pkey PRIMARY KEY (plant_id);


--
-- TOC entry 4200 (class 2606 OID 17291)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4197 (class 2606 OID 17143)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4189 (class 2606 OID 17031)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4205 (class 2606 OID 20096)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4112 (class 2606 OID 16554)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4122 (class 2606 OID 16595)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4124 (class 2606 OID 16593)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4120 (class 2606 OID 16571)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4203 (class 2606 OID 20051)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 4194 (class 2606 OID 17085)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4192 (class 2606 OID 17070)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4207 (class 2606 OID 20108)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4209 (class 2606 OID 20115)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 4107 (class 1259 OID 16532)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4081 (class 1259 OID 16748)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4082 (class 1259 OID 16750)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4083 (class 1259 OID 16751)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4139 (class 1259 OID 16829)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4172 (class 1259 OID 16937)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4128 (class 1259 OID 16917)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 4128
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4133 (class 1259 OID 16745)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4175 (class 1259 OID 16934)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4176 (class 1259 OID 16935)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4147 (class 1259 OID 16940)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4144 (class 1259 OID 16801)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4145 (class 1259 OID 16946)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4182 (class 1259 OID 17023)
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- TOC entry 4185 (class 1259 OID 17024)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4179 (class 1259 OID 16993)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4180 (class 1259 OID 16992)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4181 (class 1259 OID 16994)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4084 (class 1259 OID 16752)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4085 (class 1259 OID 16749)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4094 (class 1259 OID 16515)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4095 (class 1259 OID 16516)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4096 (class 1259 OID 16744)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4099 (class 1259 OID 16831)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4102 (class 1259 OID 16936)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4166 (class 1259 OID 16873)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4167 (class 1259 OID 16938)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4168 (class 1259 OID 16888)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4171 (class 1259 OID 16887)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4134 (class 1259 OID 16939)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4137 (class 1259 OID 16830)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4158 (class 1259 OID 16855)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4161 (class 1259 OID 16854)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4156 (class 1259 OID 16840)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4157 (class 1259 OID 17002)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4146 (class 1259 OID 16999)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4138 (class 1259 OID 16828)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4086 (class 1259 OID 16908)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 4086
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4087 (class 1259 OID 16746)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4088 (class 1259 OID 16505)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4089 (class 1259 OID 16963)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4222 (class 1259 OID 43087)
-- Name: idx_audit_log_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_created_at ON public.audit_log USING btree (created_at);


--
-- TOC entry 4223 (class 1259 OID 43086)
-- Name: idx_audit_log_tenant_table; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_tenant_table ON public.audit_log USING btree (tenant_id, table_name);


--
-- TOC entry 4283 (class 1259 OID 43085)
-- Name: idx_co_kpi_snapshot_tenant_key_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_co_kpi_snapshot_tenant_key_time ON public.co_kpi_snapshot USING btree (tenant_id, kpi_key, snapshot_at DESC);


--
-- TOC entry 4230 (class 1259 OID 43081)
-- Name: idx_mm_purchase_order_item_tenant_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mm_purchase_order_item_tenant_order ON public.mm_purchase_order_item USING btree (tenant_id, mm_order);


--
-- TOC entry 4234 (class 1259 OID 43082)
-- Name: idx_mm_receiving_tenant_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mm_receiving_tenant_order ON public.mm_receiving USING btree (tenant_id, mm_order);


--
-- TOC entry 4253 (class 1259 OID 43084)
-- Name: idx_sd_sales_order_item_tenant_so; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sd_sales_order_item_tenant_so ON public.sd_sales_order_item USING btree (tenant_id, so_id);


--
-- TOC entry 4243 (class 1259 OID 43083)
-- Name: idx_wh_inventory_balance_tenant_plant_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wh_inventory_balance_tenant_plant_material ON public.wh_inventory_balance USING btree (tenant_id, plant_id, mm_material);


--
-- TOC entry 4250 (class 1259 OID 43107)
-- Name: ix_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_customer ON public.crm_customer USING btree (tenant_id, customer_id);


--
-- TOC entry 4284 (class 1259 OID 43106)
-- Name: ix_kpi_snapshot; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_kpi_snapshot ON public.co_kpi_snapshot USING btree (tenant_id, kpi_key, snapshot_at DESC);


--
-- TOC entry 4231 (class 1259 OID 43103)
-- Name: ix_po_item_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_po_item_order ON public.mm_purchase_order_item USING btree (tenant_id, mm_order);


--
-- TOC entry 4235 (class 1259 OID 43104)
-- Name: ix_receiving_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_receiving_order ON public.mm_receiving USING btree (tenant_id, mm_order);


--
-- TOC entry 4254 (class 1259 OID 43105)
-- Name: ix_so_item_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_so_item_order ON public.sd_sales_order_item USING btree (tenant_id, so_id);


--
-- TOC entry 4238 (class 1259 OID 43108)
-- Name: ux_wh_default_per_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_wh_default_per_tenant ON public.wh_warehouse USING btree (tenant_id) WHERE (is_default = true);


--
-- TOC entry 4239 (class 1259 OID 42524)
-- Name: wh_warehouse_default_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX wh_warehouse_default_unique ON public.wh_warehouse USING btree (tenant_id) WHERE (is_default = true);


--
-- TOC entry 4240 (class 1259 OID 43378)
-- Name: wh_warehouse_one_default_per_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX wh_warehouse_one_default_per_tenant ON public.wh_warehouse USING btree (tenant_id) WHERE (is_default = true);


--
-- TOC entry 4195 (class 1259 OID 17292)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4198 (class 1259 OID 17193)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 4110 (class 1259 OID 16560)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4113 (class 1259 OID 16582)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4190 (class 1259 OID 17096)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4114 (class 1259 OID 20069)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 4115 (class 1259 OID 17061)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4116 (class 1259 OID 20071)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 4201 (class 1259 OID 20072)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 4117 (class 1259 OID 16583)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4118 (class 1259 OID 20070)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 4382 (class 2620 OID 43111)
-- Name: mm_purchase_order_item trg_calculate_po_item_totals; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_calculate_po_item_totals AFTER INSERT OR DELETE OR UPDATE ON public.mm_purchase_order_item FOR EACH ROW EXECUTE FUNCTION public.trg_update_po_total();


--
-- TOC entry 4384 (class 2620 OID 43076)
-- Name: sd_sales_order_item trg_calculate_so_item_totals; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_calculate_so_item_totals BEFORE INSERT OR UPDATE ON public.sd_sales_order_item FOR EACH ROW EXECUTE FUNCTION public.calculate_so_item_totals();


--
-- TOC entry 4385 (class 2620 OID 43078)
-- Name: sd_sales_order_item trg_update_sales_order_total; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_sales_order_total AFTER INSERT OR DELETE OR UPDATE ON public.sd_sales_order_item FOR EACH ROW EXECUTE FUNCTION public.update_sales_order_total();


--
-- TOC entry 4383 (class 2620 OID 43354)
-- Name: wh_warehouse trg_validate_warehouse_default; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validate_warehouse_default BEFORE INSERT OR UPDATE OF is_default ON public.wh_warehouse FOR EACH ROW EXECUTE FUNCTION public.trg_validate_warehouse_default();


--
-- TOC entry 4379 (class 2620 OID 17148)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4374 (class 2620 OID 20079)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4375 (class 2620 OID 20067)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4376 (class 2620 OID 20065)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 4377 (class 2620 OID 20066)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- TOC entry 4380 (class 2620 OID 20075)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 4381 (class 2620 OID 20064)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4378 (class 2620 OID 17049)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4339 (class 2606 OID 16732)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4343 (class 2606 OID 16821)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4342 (class 2606 OID 16809)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4341 (class 2606 OID 16796)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4348 (class 2606 OID 16987)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4337 (class 2606 OID 16765)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4345 (class 2606 OID 16868)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4346 (class 2606 OID 16941)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4347 (class 2606 OID 16882)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4340 (class 2606 OID 16760)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4344 (class 2606 OID 16849)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4370 (class 2606 OID 42730)
-- Name: co_cost_center co_cost_center_parent_cc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_cost_center
    ADD CONSTRAINT co_cost_center_parent_cc_id_fkey FOREIGN KEY (parent_cc_id) REFERENCES public.co_cost_center(cc_id);


--
-- TOC entry 4372 (class 2606 OID 42774)
-- Name: co_dashboard_tile co_dashboard_tile_kpi_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_dashboard_tile
    ADD CONSTRAINT co_dashboard_tile_kpi_key_fkey FOREIGN KEY (kpi_key) REFERENCES public.co_kpi_definition(kpi_key);


--
-- TOC entry 4371 (class 2606 OID 42759)
-- Name: co_kpi_snapshot co_kpi_snapshot_kpi_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_kpi_snapshot
    ADD CONSTRAINT co_kpi_snapshot_kpi_key_fkey FOREIGN KEY (kpi_key) REFERENCES public.co_kpi_definition(kpi_key);


--
-- TOC entry 4364 (class 2606 OID 42650)
-- Name: crm_interaction crm_interaction_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_interaction
    ADD CONSTRAINT crm_interaction_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.crm_lead(lead_id);


--
-- TOC entry 4363 (class 2606 OID 42635)
-- Name: crm_opportunity crm_opportunity_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_opportunity
    ADD CONSTRAINT crm_opportunity_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.crm_lead(lead_id);


--
-- TOC entry 4365 (class 2606 OID 42675)
-- Name: fi_invoice fi_invoice_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_invoice
    ADD CONSTRAINT fi_invoice_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.crm_customer(customer_id);


--
-- TOC entry 4366 (class 2606 OID 42680)
-- Name: fi_invoice fi_invoice_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_invoice
    ADD CONSTRAINT fi_invoice_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.mm_vendor(vendor_id);


--
-- TOC entry 4367 (class 2606 OID 42701)
-- Name: fi_payment fi_payment_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_payment
    ADD CONSTRAINT fi_payment_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.fi_account(account_id);


--
-- TOC entry 4368 (class 2606 OID 42696)
-- Name: fi_payment fi_payment_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_payment
    ADD CONSTRAINT fi_payment_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.fi_invoice(invoice_id);


--
-- TOC entry 4369 (class 2606 OID 42716)
-- Name: fi_transaction fi_transaction_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fi_transaction
    ADD CONSTRAINT fi_transaction_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.fi_account(account_id);


--
-- TOC entry 4373 (class 2606 OID 43007)
-- Name: import_log import_log_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log
    ADD CONSTRAINT import_log_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.import_job(job_id);


--
-- TOC entry 4353 (class 2606 OID 42452)
-- Name: mm_material mm_material_mm_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_material
    ADD CONSTRAINT mm_material_mm_vendor_id_fkey FOREIGN KEY (mm_vendor_id) REFERENCES public.mm_vendor(vendor_id);


--
-- TOC entry 4355 (class 2606 OID 42489)
-- Name: mm_purchase_order_item mm_purchase_order_item_mm_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order_item
    ADD CONSTRAINT mm_purchase_order_item_mm_material_fkey FOREIGN KEY (mm_material) REFERENCES public.mm_material(mm_material);


--
-- TOC entry 4356 (class 2606 OID 42484)
-- Name: mm_purchase_order_item mm_purchase_order_item_mm_order_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order_item
    ADD CONSTRAINT mm_purchase_order_item_mm_order_fkey FOREIGN KEY (mm_order) REFERENCES public.mm_purchase_order(mm_order);


--
-- TOC entry 4354 (class 2606 OID 42467)
-- Name: mm_purchase_order mm_purchase_order_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_purchase_order
    ADD CONSTRAINT mm_purchase_order_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.mm_vendor(vendor_id);


--
-- TOC entry 4357 (class 2606 OID 42510)
-- Name: mm_receiving mm_receiving_mm_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_receiving
    ADD CONSTRAINT mm_receiving_mm_material_fkey FOREIGN KEY (mm_material) REFERENCES public.mm_material(mm_material);


--
-- TOC entry 4358 (class 2606 OID 42505)
-- Name: mm_receiving mm_receiving_mm_order_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mm_receiving
    ADD CONSTRAINT mm_receiving_mm_order_fkey FOREIGN KEY (mm_order) REFERENCES public.mm_purchase_order(mm_order);


--
-- TOC entry 4362 (class 2606 OID 42611)
-- Name: sd_payment sd_payment_so_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_payment
    ADD CONSTRAINT sd_payment_so_id_fkey FOREIGN KEY (so_id) REFERENCES public.sd_sales_order(so_id);


--
-- TOC entry 4359 (class 2606 OID 42565)
-- Name: sd_sales_order sd_sales_order_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_sales_order
    ADD CONSTRAINT sd_sales_order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.crm_customer(customer_id);


--
-- TOC entry 4360 (class 2606 OID 42581)
-- Name: sd_sales_order_item sd_sales_order_item_so_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_sales_order_item
    ADD CONSTRAINT sd_sales_order_item_so_id_fkey FOREIGN KEY (so_id) REFERENCES public.sd_sales_order(so_id);


--
-- TOC entry 4361 (class 2606 OID 42595)
-- Name: sd_shipment sd_shipment_so_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_shipment
    ADD CONSTRAINT sd_shipment_so_id_fkey FOREIGN KEY (so_id) REFERENCES public.sd_sales_order(so_id);


--
-- TOC entry 4338 (class 2606 OID 16572)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4352 (class 2606 OID 20052)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4349 (class 2606 OID 17071)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4350 (class 2606 OID 17091)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4351 (class 2606 OID 17086)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4538 (class 0 OID 16525)
-- Dependencies: 313
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4552 (class 0 OID 16927)
-- Dependencies: 330
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4543 (class 0 OID 16725)
-- Dependencies: 321
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4537 (class 0 OID 16518)
-- Dependencies: 312
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4547 (class 0 OID 16814)
-- Dependencies: 325
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4546 (class 0 OID 16802)
-- Dependencies: 324
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4545 (class 0 OID 16789)
-- Dependencies: 323
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4553 (class 0 OID 16977)
-- Dependencies: 331
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4536 (class 0 OID 16507)
-- Dependencies: 311
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4550 (class 0 OID 16856)
-- Dependencies: 328
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4551 (class 0 OID 16874)
-- Dependencies: 329
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4539 (class 0 OID 16533)
-- Dependencies: 314
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4544 (class 0 OID 16755)
-- Dependencies: 322
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4549 (class 0 OID 16841)
-- Dependencies: 327
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4548 (class 0 OID 16832)
-- Dependencies: 326
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4535 (class 0 OID 16495)
-- Dependencies: 309
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4562 (class 0 OID 42407)
-- Dependencies: 349
-- Name: app_setting; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.app_setting ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4564 (class 0 OID 42425)
-- Dependencies: 352
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4585 (class 0 OID 42721)
-- Dependencies: 377
-- Name: co_cost_center; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_cost_center ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4589 (class 0 OID 42764)
-- Dependencies: 381
-- Name: co_dashboard_tile; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_dashboard_tile ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4586 (class 0 OID 42735)
-- Dependencies: 378
-- Name: co_fiscal_period; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_fiscal_period ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4587 (class 0 OID 42744)
-- Dependencies: 379
-- Name: co_kpi_definition; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_kpi_definition ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4588 (class 0 OID 42752)
-- Dependencies: 380
-- Name: co_kpi_snapshot; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_kpi_snapshot ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4612 (class 0 OID 42974)
-- Dependencies: 404
-- Name: co_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.co_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4573 (class 0 OID 42544)
-- Dependencies: 364
-- Name: crm_customer; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_customer ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4580 (class 0 OID 42641)
-- Dependencies: 372
-- Name: crm_interaction; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_interaction ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4578 (class 0 OID 42616)
-- Dependencies: 369
-- Name: crm_lead; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_lead ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4606 (class 0 OID 42922)
-- Dependencies: 398
-- Name: crm_lead_status_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_lead_status_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4607 (class 0 OID 42931)
-- Dependencies: 399
-- Name: crm_opp_stage_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_opp_stage_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4579 (class 0 OID 42625)
-- Dependencies: 370
-- Name: crm_opportunity; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_opportunity ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4604 (class 0 OID 42905)
-- Dependencies: 396
-- Name: crm_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4605 (class 0 OID 42914)
-- Dependencies: 397
-- Name: crm_source_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.crm_source_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4688 (class 3256 OID 43131)
-- Name: app_setting del_app_setting; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_app_setting ON public.app_setting FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4696 (class 3256 OID 43139)
-- Name: audit_log del_audit_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_audit_log ON public.audit_log FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4788 (class 3256 OID 43231)
-- Name: co_cost_center del_co_cost_center; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_cost_center ON public.co_cost_center FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4804 (class 3256 OID 43247)
-- Name: co_dashboard_tile del_co_dashboard_tile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_dashboard_tile ON public.co_dashboard_tile FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4792 (class 3256 OID 43235)
-- Name: co_fiscal_period del_co_fiscal_period; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_fiscal_period ON public.co_fiscal_period FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4796 (class 3256 OID 43239)
-- Name: co_kpi_definition del_co_kpi_definition; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_kpi_definition ON public.co_kpi_definition FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4800 (class 3256 OID 43243)
-- Name: co_kpi_snapshot del_co_kpi_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_kpi_snapshot ON public.co_kpi_snapshot FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4828 (class 3256 OID 43271)
-- Name: co_setup del_co_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_co_setup ON public.co_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4740 (class 3256 OID 43183)
-- Name: crm_customer del_crm_customer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_customer ON public.crm_customer FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4768 (class 3256 OID 43211)
-- Name: crm_interaction del_crm_interaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_interaction ON public.crm_interaction FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4760 (class 3256 OID 43203)
-- Name: crm_lead del_crm_lead; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_lead ON public.crm_lead FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4880 (class 3256 OID 43323)
-- Name: crm_lead_status_def del_crm_lead_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_lead_status_def ON public.crm_lead_status_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4884 (class 3256 OID 43327)
-- Name: crm_opp_stage_def del_crm_opp_stage_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_opp_stage_def ON public.crm_opp_stage_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4764 (class 3256 OID 43207)
-- Name: crm_opportunity del_crm_opportunity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_opportunity ON public.crm_opportunity FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4820 (class 3256 OID 43263)
-- Name: crm_setup del_crm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_setup ON public.crm_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4876 (class 3256 OID 43319)
-- Name: crm_source_def del_crm_source_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_crm_source_def ON public.crm_source_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4692 (class 3256 OID 43135)
-- Name: doc_numbering del_doc_numbering; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_doc_numbering ON public.doc_numbering FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4772 (class 3256 OID 43215)
-- Name: fi_account del_fi_account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_account ON public.fi_account FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4776 (class 3256 OID 43219)
-- Name: fi_invoice del_fi_invoice; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_invoice ON public.fi_invoice FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4780 (class 3256 OID 43223)
-- Name: fi_payment del_fi_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_payment ON public.fi_payment FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4888 (class 3256 OID 43331)
-- Name: fi_payment_method_def del_fi_payment_method_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_payment_method_def ON public.fi_payment_method_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4892 (class 3256 OID 43335)
-- Name: fi_payment_terms_def del_fi_payment_terms_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_payment_terms_def ON public.fi_payment_terms_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4824 (class 3256 OID 43267)
-- Name: fi_setup del_fi_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_setup ON public.fi_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4616 (class 3256 OID 43339)
-- Name: fi_tax_code_def del_fi_tax_code_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_tax_code_def ON public.fi_tax_code_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4784 (class 3256 OID 43227)
-- Name: fi_transaction del_fi_transaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_fi_transaction ON public.fi_transaction FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4700 (class 3256 OID 43143)
-- Name: import_job del_import_job; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_import_job ON public.import_job FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4704 (class 3256 OID 43147)
-- Name: import_log del_import_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_import_log ON public.import_log FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4832 (class 3256 OID 43275)
-- Name: mm_category_def del_mm_category_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_category_def ON public.mm_category_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4836 (class 3256 OID 43279)
-- Name: mm_classification_def del_mm_classification_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_classification_def ON public.mm_classification_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4844 (class 3256 OID 43287)
-- Name: mm_currency_def del_mm_currency_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_currency_def ON public.mm_currency_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4712 (class 3256 OID 43155)
-- Name: mm_material del_mm_material; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_material ON public.mm_material FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4840 (class 3256 OID 43283)
-- Name: mm_price_channel_def del_mm_price_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_price_channel_def ON public.mm_price_channel_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4716 (class 3256 OID 43159)
-- Name: mm_purchase_order del_mm_purchase_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_purchase_order ON public.mm_purchase_order FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4720 (class 3256 OID 43163)
-- Name: mm_purchase_order_item del_mm_purchase_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_purchase_order_item ON public.mm_purchase_order_item FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4724 (class 3256 OID 43167)
-- Name: mm_receiving del_mm_receiving; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_receiving ON public.mm_receiving FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4808 (class 3256 OID 43251)
-- Name: mm_setup del_mm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_setup ON public.mm_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4852 (class 3256 OID 43295)
-- Name: mm_status_def del_mm_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_status_def ON public.mm_status_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4708 (class 3256 OID 43151)
-- Name: mm_vendor del_mm_vendor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_vendor ON public.mm_vendor FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4848 (class 3256 OID 43291)
-- Name: mm_vendor_rating_def del_mm_vendor_rating_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_mm_vendor_rating_def ON public.mm_vendor_rating_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4684 (class 3256 OID 43127)
-- Name: role_permission del_role_permission; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_role_permission ON public.role_permission FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4868 (class 3256 OID 43311)
-- Name: sd_carrier_def del_sd_carrier_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_carrier_def ON public.sd_carrier_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4872 (class 3256 OID 43315)
-- Name: sd_channel_def del_sd_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_channel_def ON public.sd_channel_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4860 (class 3256 OID 43303)
-- Name: sd_order_status_def del_sd_order_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_order_status_def ON public.sd_order_status_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4756 (class 3256 OID 43199)
-- Name: sd_payment del_sd_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_payment ON public.sd_payment FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4744 (class 3256 OID 43187)
-- Name: sd_sales_order del_sd_sales_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_sales_order ON public.sd_sales_order FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4748 (class 3256 OID 43191)
-- Name: sd_sales_order_item del_sd_sales_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_sales_order_item ON public.sd_sales_order_item FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4816 (class 3256 OID 43259)
-- Name: sd_setup del_sd_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_setup ON public.sd_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4752 (class 3256 OID 43195)
-- Name: sd_shipment del_sd_shipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_shipment ON public.sd_shipment FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4864 (class 3256 OID 43307)
-- Name: sd_shipment_status_def del_sd_shipment_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_sd_shipment_status_def ON public.sd_shipment_status_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4676 (class 3256 OID 43119)
-- Name: tenant del_tenant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_tenant ON public.tenant FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4680 (class 3256 OID 43123)
-- Name: user_profile del_user_profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_user_profile ON public.user_profile FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4732 (class 3256 OID 43175)
-- Name: wh_inventory_balance del_wh_inventory_balance; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_wh_inventory_balance ON public.wh_inventory_balance FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4736 (class 3256 OID 43179)
-- Name: wh_inventory_ledger del_wh_inventory_ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_wh_inventory_ledger ON public.wh_inventory_ledger FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4856 (class 3256 OID 43299)
-- Name: wh_inventory_status_def del_wh_inventory_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_wh_inventory_status_def ON public.wh_inventory_status_def FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4812 (class 3256 OID 43255)
-- Name: wh_setup del_wh_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_wh_setup ON public.wh_setup FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4728 (class 3256 OID 43171)
-- Name: wh_warehouse del_wh_warehouse; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY del_wh_warehouse ON public.wh_warehouse FOR DELETE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4563 (class 0 OID 42415)
-- Dependencies: 350
-- Name: doc_numbering; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.doc_numbering ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4581 (class 0 OID 42655)
-- Dependencies: 373
-- Name: fi_account; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_account ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4582 (class 0 OID 42665)
-- Dependencies: 374
-- Name: fi_invoice; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_invoice ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4583 (class 0 OID 42685)
-- Dependencies: 375
-- Name: fi_payment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_payment ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4609 (class 0 OID 42950)
-- Dependencies: 401
-- Name: fi_payment_method_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_payment_method_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4610 (class 0 OID 42958)
-- Dependencies: 402
-- Name: fi_payment_terms_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_payment_terms_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4608 (class 0 OID 42940)
-- Dependencies: 400
-- Name: fi_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4611 (class 0 OID 42966)
-- Dependencies: 403
-- Name: fi_tax_code_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_tax_code_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4584 (class 0 OID 42706)
-- Dependencies: 376
-- Name: fi_transaction; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fi_transaction ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4613 (class 0 OID 42984)
-- Dependencies: 406
-- Name: import_job; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.import_job ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4614 (class 0 OID 42998)
-- Dependencies: 408
-- Name: import_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.import_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4686 (class 3256 OID 43129)
-- Name: app_setting ins_app_setting; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_app_setting ON public.app_setting FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4694 (class 3256 OID 43137)
-- Name: audit_log ins_audit_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_audit_log ON public.audit_log FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4786 (class 3256 OID 43229)
-- Name: co_cost_center ins_co_cost_center; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_cost_center ON public.co_cost_center FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4802 (class 3256 OID 43245)
-- Name: co_dashboard_tile ins_co_dashboard_tile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_dashboard_tile ON public.co_dashboard_tile FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4790 (class 3256 OID 43233)
-- Name: co_fiscal_period ins_co_fiscal_period; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_fiscal_period ON public.co_fiscal_period FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4794 (class 3256 OID 43237)
-- Name: co_kpi_definition ins_co_kpi_definition; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_kpi_definition ON public.co_kpi_definition FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4798 (class 3256 OID 43241)
-- Name: co_kpi_snapshot ins_co_kpi_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_kpi_snapshot ON public.co_kpi_snapshot FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4826 (class 3256 OID 43269)
-- Name: co_setup ins_co_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_co_setup ON public.co_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4738 (class 3256 OID 43181)
-- Name: crm_customer ins_crm_customer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_customer ON public.crm_customer FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4766 (class 3256 OID 43209)
-- Name: crm_interaction ins_crm_interaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_interaction ON public.crm_interaction FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4758 (class 3256 OID 43201)
-- Name: crm_lead ins_crm_lead; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_lead ON public.crm_lead FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4878 (class 3256 OID 43321)
-- Name: crm_lead_status_def ins_crm_lead_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_lead_status_def ON public.crm_lead_status_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4882 (class 3256 OID 43325)
-- Name: crm_opp_stage_def ins_crm_opp_stage_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_opp_stage_def ON public.crm_opp_stage_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4762 (class 3256 OID 43205)
-- Name: crm_opportunity ins_crm_opportunity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_opportunity ON public.crm_opportunity FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4818 (class 3256 OID 43261)
-- Name: crm_setup ins_crm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_setup ON public.crm_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4874 (class 3256 OID 43317)
-- Name: crm_source_def ins_crm_source_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_crm_source_def ON public.crm_source_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4690 (class 3256 OID 43133)
-- Name: doc_numbering ins_doc_numbering; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_doc_numbering ON public.doc_numbering FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4770 (class 3256 OID 43213)
-- Name: fi_account ins_fi_account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_account ON public.fi_account FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4774 (class 3256 OID 43217)
-- Name: fi_invoice ins_fi_invoice; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_invoice ON public.fi_invoice FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4778 (class 3256 OID 43221)
-- Name: fi_payment ins_fi_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_payment ON public.fi_payment FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4886 (class 3256 OID 43329)
-- Name: fi_payment_method_def ins_fi_payment_method_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_payment_method_def ON public.fi_payment_method_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4890 (class 3256 OID 43333)
-- Name: fi_payment_terms_def ins_fi_payment_terms_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_payment_terms_def ON public.fi_payment_terms_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4822 (class 3256 OID 43265)
-- Name: fi_setup ins_fi_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_setup ON public.fi_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4894 (class 3256 OID 43337)
-- Name: fi_tax_code_def ins_fi_tax_code_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_tax_code_def ON public.fi_tax_code_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4782 (class 3256 OID 43225)
-- Name: fi_transaction ins_fi_transaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_fi_transaction ON public.fi_transaction FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4698 (class 3256 OID 43141)
-- Name: import_job ins_import_job; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_import_job ON public.import_job FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4702 (class 3256 OID 43145)
-- Name: import_log ins_import_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_import_log ON public.import_log FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4830 (class 3256 OID 43273)
-- Name: mm_category_def ins_mm_category_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_category_def ON public.mm_category_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4834 (class 3256 OID 43277)
-- Name: mm_classification_def ins_mm_classification_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_classification_def ON public.mm_classification_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4842 (class 3256 OID 43285)
-- Name: mm_currency_def ins_mm_currency_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_currency_def ON public.mm_currency_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4710 (class 3256 OID 43153)
-- Name: mm_material ins_mm_material; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_material ON public.mm_material FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4838 (class 3256 OID 43281)
-- Name: mm_price_channel_def ins_mm_price_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_price_channel_def ON public.mm_price_channel_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4714 (class 3256 OID 43157)
-- Name: mm_purchase_order ins_mm_purchase_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_purchase_order ON public.mm_purchase_order FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4718 (class 3256 OID 43161)
-- Name: mm_purchase_order_item ins_mm_purchase_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_purchase_order_item ON public.mm_purchase_order_item FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4722 (class 3256 OID 43165)
-- Name: mm_receiving ins_mm_receiving; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_receiving ON public.mm_receiving FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4806 (class 3256 OID 43249)
-- Name: mm_setup ins_mm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_setup ON public.mm_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4850 (class 3256 OID 43293)
-- Name: mm_status_def ins_mm_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_status_def ON public.mm_status_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4706 (class 3256 OID 43149)
-- Name: mm_vendor ins_mm_vendor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_vendor ON public.mm_vendor FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4846 (class 3256 OID 43289)
-- Name: mm_vendor_rating_def ins_mm_vendor_rating_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_mm_vendor_rating_def ON public.mm_vendor_rating_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4682 (class 3256 OID 43125)
-- Name: role_permission ins_role_permission; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_role_permission ON public.role_permission FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4866 (class 3256 OID 43309)
-- Name: sd_carrier_def ins_sd_carrier_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_carrier_def ON public.sd_carrier_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4870 (class 3256 OID 43313)
-- Name: sd_channel_def ins_sd_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_channel_def ON public.sd_channel_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4858 (class 3256 OID 43301)
-- Name: sd_order_status_def ins_sd_order_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_order_status_def ON public.sd_order_status_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4754 (class 3256 OID 43197)
-- Name: sd_payment ins_sd_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_payment ON public.sd_payment FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4742 (class 3256 OID 43185)
-- Name: sd_sales_order ins_sd_sales_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_sales_order ON public.sd_sales_order FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4746 (class 3256 OID 43189)
-- Name: sd_sales_order_item ins_sd_sales_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_sales_order_item ON public.sd_sales_order_item FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4814 (class 3256 OID 43257)
-- Name: sd_setup ins_sd_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_setup ON public.sd_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4750 (class 3256 OID 43193)
-- Name: sd_shipment ins_sd_shipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_shipment ON public.sd_shipment FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4862 (class 3256 OID 43305)
-- Name: sd_shipment_status_def ins_sd_shipment_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_sd_shipment_status_def ON public.sd_shipment_status_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4674 (class 3256 OID 43117)
-- Name: tenant ins_tenant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_tenant ON public.tenant FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4678 (class 3256 OID 43121)
-- Name: user_profile ins_user_profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_user_profile ON public.user_profile FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4730 (class 3256 OID 43173)
-- Name: wh_inventory_balance ins_wh_inventory_balance; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_wh_inventory_balance ON public.wh_inventory_balance FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4734 (class 3256 OID 43177)
-- Name: wh_inventory_ledger ins_wh_inventory_ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_wh_inventory_ledger ON public.wh_inventory_ledger FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4854 (class 3256 OID 43297)
-- Name: wh_inventory_status_def ins_wh_inventory_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_wh_inventory_status_def ON public.wh_inventory_status_def FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4810 (class 3256 OID 43253)
-- Name: wh_setup ins_wh_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_wh_setup ON public.wh_setup FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4726 (class 3256 OID 43169)
-- Name: wh_warehouse ins_wh_warehouse; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ins_wh_warehouse ON public.wh_warehouse FOR INSERT WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4591 (class 0 OID 42793)
-- Dependencies: 383
-- Name: mm_category_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_category_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4592 (class 0 OID 42801)
-- Dependencies: 384
-- Name: mm_classification_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_classification_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4594 (class 0 OID 42817)
-- Dependencies: 386
-- Name: mm_currency_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_currency_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4566 (class 0 OID 42442)
-- Dependencies: 354
-- Name: mm_material; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_material ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4593 (class 0 OID 42809)
-- Dependencies: 385
-- Name: mm_price_channel_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_price_channel_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4567 (class 0 OID 42457)
-- Dependencies: 355
-- Name: mm_purchase_order; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_purchase_order ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4568 (class 0 OID 42473)
-- Dependencies: 357
-- Name: mm_purchase_order_item; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_purchase_order_item ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4569 (class 0 OID 42495)
-- Dependencies: 359
-- Name: mm_receiving; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_receiving ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4590 (class 0 OID 42780)
-- Dependencies: 382
-- Name: mm_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4596 (class 0 OID 42833)
-- Dependencies: 388
-- Name: mm_status_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_status_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4565 (class 0 OID 42434)
-- Dependencies: 353
-- Name: mm_vendor; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_vendor ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4595 (class 0 OID 42825)
-- Dependencies: 387
-- Name: mm_vendor_rating_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.mm_vendor_rating_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4561 (class 0 OID 42399)
-- Dependencies: 348
-- Name: role_permission; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.role_permission ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4602 (class 0 OID 42889)
-- Dependencies: 394
-- Name: sd_carrier_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_carrier_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4603 (class 0 OID 42897)
-- Dependencies: 395
-- Name: sd_channel_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_channel_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4600 (class 0 OID 42871)
-- Dependencies: 392
-- Name: sd_order_status_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_order_status_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4577 (class 0 OID 42600)
-- Dependencies: 368
-- Name: sd_payment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_payment ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4574 (class 0 OID 42554)
-- Dependencies: 365
-- Name: sd_sales_order; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_sales_order ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4575 (class 0 OID 42570)
-- Dependencies: 366
-- Name: sd_sales_order_item; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_sales_order_item ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4599 (class 0 OID 42860)
-- Dependencies: 391
-- Name: sd_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4576 (class 0 OID 42586)
-- Dependencies: 367
-- Name: sd_shipment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_shipment ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4601 (class 0 OID 42880)
-- Dependencies: 393
-- Name: sd_shipment_status_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_shipment_status_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4685 (class 3256 OID 43128)
-- Name: app_setting sel_app_setting; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_app_setting ON public.app_setting FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4693 (class 3256 OID 43136)
-- Name: audit_log sel_audit_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_audit_log ON public.audit_log FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4785 (class 3256 OID 43228)
-- Name: co_cost_center sel_co_cost_center; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_cost_center ON public.co_cost_center FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4801 (class 3256 OID 43244)
-- Name: co_dashboard_tile sel_co_dashboard_tile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_dashboard_tile ON public.co_dashboard_tile FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4789 (class 3256 OID 43232)
-- Name: co_fiscal_period sel_co_fiscal_period; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_fiscal_period ON public.co_fiscal_period FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4793 (class 3256 OID 43236)
-- Name: co_kpi_definition sel_co_kpi_definition; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_kpi_definition ON public.co_kpi_definition FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4797 (class 3256 OID 43240)
-- Name: co_kpi_snapshot sel_co_kpi_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_kpi_snapshot ON public.co_kpi_snapshot FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4825 (class 3256 OID 43268)
-- Name: co_setup sel_co_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_co_setup ON public.co_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4737 (class 3256 OID 43180)
-- Name: crm_customer sel_crm_customer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_customer ON public.crm_customer FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4765 (class 3256 OID 43208)
-- Name: crm_interaction sel_crm_interaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_interaction ON public.crm_interaction FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4757 (class 3256 OID 43200)
-- Name: crm_lead sel_crm_lead; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_lead ON public.crm_lead FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4877 (class 3256 OID 43320)
-- Name: crm_lead_status_def sel_crm_lead_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_lead_status_def ON public.crm_lead_status_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4881 (class 3256 OID 43324)
-- Name: crm_opp_stage_def sel_crm_opp_stage_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_opp_stage_def ON public.crm_opp_stage_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4761 (class 3256 OID 43204)
-- Name: crm_opportunity sel_crm_opportunity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_opportunity ON public.crm_opportunity FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4817 (class 3256 OID 43260)
-- Name: crm_setup sel_crm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_setup ON public.crm_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4873 (class 3256 OID 43316)
-- Name: crm_source_def sel_crm_source_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_crm_source_def ON public.crm_source_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4689 (class 3256 OID 43132)
-- Name: doc_numbering sel_doc_numbering; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_doc_numbering ON public.doc_numbering FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4769 (class 3256 OID 43212)
-- Name: fi_account sel_fi_account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_account ON public.fi_account FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4773 (class 3256 OID 43216)
-- Name: fi_invoice sel_fi_invoice; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_invoice ON public.fi_invoice FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4777 (class 3256 OID 43220)
-- Name: fi_payment sel_fi_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_payment ON public.fi_payment FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4885 (class 3256 OID 43328)
-- Name: fi_payment_method_def sel_fi_payment_method_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_payment_method_def ON public.fi_payment_method_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4889 (class 3256 OID 43332)
-- Name: fi_payment_terms_def sel_fi_payment_terms_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_payment_terms_def ON public.fi_payment_terms_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4821 (class 3256 OID 43264)
-- Name: fi_setup sel_fi_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_setup ON public.fi_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4893 (class 3256 OID 43336)
-- Name: fi_tax_code_def sel_fi_tax_code_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_tax_code_def ON public.fi_tax_code_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4781 (class 3256 OID 43224)
-- Name: fi_transaction sel_fi_transaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_fi_transaction ON public.fi_transaction FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4697 (class 3256 OID 43140)
-- Name: import_job sel_import_job; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_import_job ON public.import_job FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4701 (class 3256 OID 43144)
-- Name: import_log sel_import_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_import_log ON public.import_log FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4829 (class 3256 OID 43272)
-- Name: mm_category_def sel_mm_category_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_category_def ON public.mm_category_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4833 (class 3256 OID 43276)
-- Name: mm_classification_def sel_mm_classification_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_classification_def ON public.mm_classification_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4841 (class 3256 OID 43284)
-- Name: mm_currency_def sel_mm_currency_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_currency_def ON public.mm_currency_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4709 (class 3256 OID 43152)
-- Name: mm_material sel_mm_material; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_material ON public.mm_material FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4837 (class 3256 OID 43280)
-- Name: mm_price_channel_def sel_mm_price_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_price_channel_def ON public.mm_price_channel_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4713 (class 3256 OID 43156)
-- Name: mm_purchase_order sel_mm_purchase_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_purchase_order ON public.mm_purchase_order FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4717 (class 3256 OID 43160)
-- Name: mm_purchase_order_item sel_mm_purchase_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_purchase_order_item ON public.mm_purchase_order_item FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4721 (class 3256 OID 43164)
-- Name: mm_receiving sel_mm_receiving; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_receiving ON public.mm_receiving FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4805 (class 3256 OID 43248)
-- Name: mm_setup sel_mm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_setup ON public.mm_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4849 (class 3256 OID 43292)
-- Name: mm_status_def sel_mm_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_status_def ON public.mm_status_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4705 (class 3256 OID 43148)
-- Name: mm_vendor sel_mm_vendor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_vendor ON public.mm_vendor FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4845 (class 3256 OID 43288)
-- Name: mm_vendor_rating_def sel_mm_vendor_rating_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_mm_vendor_rating_def ON public.mm_vendor_rating_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4681 (class 3256 OID 43124)
-- Name: role_permission sel_role_permission; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_role_permission ON public.role_permission FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4865 (class 3256 OID 43308)
-- Name: sd_carrier_def sel_sd_carrier_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_carrier_def ON public.sd_carrier_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4869 (class 3256 OID 43312)
-- Name: sd_channel_def sel_sd_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_channel_def ON public.sd_channel_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4857 (class 3256 OID 43300)
-- Name: sd_order_status_def sel_sd_order_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_order_status_def ON public.sd_order_status_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4753 (class 3256 OID 43196)
-- Name: sd_payment sel_sd_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_payment ON public.sd_payment FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4741 (class 3256 OID 43184)
-- Name: sd_sales_order sel_sd_sales_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_sales_order ON public.sd_sales_order FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4745 (class 3256 OID 43188)
-- Name: sd_sales_order_item sel_sd_sales_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_sales_order_item ON public.sd_sales_order_item FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4813 (class 3256 OID 43256)
-- Name: sd_setup sel_sd_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_setup ON public.sd_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4749 (class 3256 OID 43192)
-- Name: sd_shipment sel_sd_shipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_shipment ON public.sd_shipment FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4861 (class 3256 OID 43304)
-- Name: sd_shipment_status_def sel_sd_shipment_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_sd_shipment_status_def ON public.sd_shipment_status_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4673 (class 3256 OID 43116)
-- Name: tenant sel_tenant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_tenant ON public.tenant FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4677 (class 3256 OID 43120)
-- Name: user_profile sel_user_profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_user_profile ON public.user_profile FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4729 (class 3256 OID 43172)
-- Name: wh_inventory_balance sel_wh_inventory_balance; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_wh_inventory_balance ON public.wh_inventory_balance FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4733 (class 3256 OID 43176)
-- Name: wh_inventory_ledger sel_wh_inventory_ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_wh_inventory_ledger ON public.wh_inventory_ledger FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4853 (class 3256 OID 43296)
-- Name: wh_inventory_status_def sel_wh_inventory_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_wh_inventory_status_def ON public.wh_inventory_status_def FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4809 (class 3256 OID 43252)
-- Name: wh_setup sel_wh_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_wh_setup ON public.wh_setup FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4725 (class 3256 OID 43168)
-- Name: wh_warehouse sel_wh_warehouse; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY sel_wh_warehouse ON public.wh_warehouse FOR SELECT USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4559 (class 0 OID 42379)
-- Dependencies: 346
-- Name: tenant; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tenant ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4620 (class 3256 OID 43015)
-- Name: app_setting tenant_isolation_app_setting; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_app_setting ON public.app_setting USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4622 (class 3256 OID 43017)
-- Name: audit_log tenant_isolation_audit_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_audit_log ON public.audit_log USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4643 (class 3256 OID 43038)
-- Name: co_cost_center tenant_isolation_co_cost_center; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_cost_center ON public.co_cost_center USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4647 (class 3256 OID 43042)
-- Name: co_dashboard_tile tenant_isolation_co_dashboard_tile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_dashboard_tile ON public.co_dashboard_tile USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4644 (class 3256 OID 43039)
-- Name: co_fiscal_period tenant_isolation_co_fiscal_period; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_fiscal_period ON public.co_fiscal_period USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4645 (class 3256 OID 43040)
-- Name: co_kpi_definition tenant_isolation_co_kpi_definition; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_kpi_definition ON public.co_kpi_definition USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4646 (class 3256 OID 43041)
-- Name: co_kpi_snapshot tenant_isolation_co_kpi_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_kpi_snapshot ON public.co_kpi_snapshot USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4670 (class 3256 OID 43065)
-- Name: co_setup tenant_isolation_co_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_co_setup ON public.co_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4631 (class 3256 OID 43026)
-- Name: crm_customer tenant_isolation_crm_customer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_customer ON public.crm_customer USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4638 (class 3256 OID 43033)
-- Name: crm_interaction tenant_isolation_crm_interaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_interaction ON public.crm_interaction USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4636 (class 3256 OID 43031)
-- Name: crm_lead tenant_isolation_crm_lead; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_lead ON public.crm_lead USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4664 (class 3256 OID 43059)
-- Name: crm_lead_status_def tenant_isolation_crm_lead_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_lead_status_def ON public.crm_lead_status_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4665 (class 3256 OID 43060)
-- Name: crm_opp_stage_def tenant_isolation_crm_opp_stage_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_opp_stage_def ON public.crm_opp_stage_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4637 (class 3256 OID 43032)
-- Name: crm_opportunity tenant_isolation_crm_opportunity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_opportunity ON public.crm_opportunity USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4662 (class 3256 OID 43057)
-- Name: crm_setup tenant_isolation_crm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_setup ON public.crm_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4663 (class 3256 OID 43058)
-- Name: crm_source_def tenant_isolation_crm_source_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_crm_source_def ON public.crm_source_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4621 (class 3256 OID 43016)
-- Name: doc_numbering tenant_isolation_doc_numbering; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_doc_numbering ON public.doc_numbering USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4639 (class 3256 OID 43034)
-- Name: fi_account tenant_isolation_fi_account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_account ON public.fi_account USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4640 (class 3256 OID 43035)
-- Name: fi_invoice tenant_isolation_fi_invoice; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_invoice ON public.fi_invoice USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4641 (class 3256 OID 43036)
-- Name: fi_payment tenant_isolation_fi_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_payment ON public.fi_payment USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4667 (class 3256 OID 43062)
-- Name: fi_payment_method_def tenant_isolation_fi_payment_method_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_payment_method_def ON public.fi_payment_method_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4668 (class 3256 OID 43063)
-- Name: fi_payment_terms_def tenant_isolation_fi_payment_terms_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_payment_terms_def ON public.fi_payment_terms_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4666 (class 3256 OID 43061)
-- Name: fi_setup tenant_isolation_fi_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_setup ON public.fi_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4669 (class 3256 OID 43064)
-- Name: fi_tax_code_def tenant_isolation_fi_tax_code_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_tax_code_def ON public.fi_tax_code_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4642 (class 3256 OID 43037)
-- Name: fi_transaction tenant_isolation_fi_transaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_fi_transaction ON public.fi_transaction USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4671 (class 3256 OID 43066)
-- Name: import_job tenant_isolation_import_job; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_import_job ON public.import_job USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4672 (class 3256 OID 43067)
-- Name: import_log tenant_isolation_import_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_import_log ON public.import_log USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4649 (class 3256 OID 43044)
-- Name: mm_category_def tenant_isolation_mm_category_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_category_def ON public.mm_category_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4650 (class 3256 OID 43045)
-- Name: mm_classification_def tenant_isolation_mm_classification_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_classification_def ON public.mm_classification_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4652 (class 3256 OID 43047)
-- Name: mm_currency_def tenant_isolation_mm_currency_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_currency_def ON public.mm_currency_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4624 (class 3256 OID 43019)
-- Name: mm_material tenant_isolation_mm_material; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_material ON public.mm_material USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4651 (class 3256 OID 43046)
-- Name: mm_price_channel_def tenant_isolation_mm_price_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_price_channel_def ON public.mm_price_channel_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4625 (class 3256 OID 43020)
-- Name: mm_purchase_order tenant_isolation_mm_purchase_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_purchase_order ON public.mm_purchase_order USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4626 (class 3256 OID 43021)
-- Name: mm_purchase_order_item tenant_isolation_mm_purchase_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_purchase_order_item ON public.mm_purchase_order_item USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4627 (class 3256 OID 43022)
-- Name: mm_receiving tenant_isolation_mm_receiving; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_receiving ON public.mm_receiving USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4648 (class 3256 OID 43043)
-- Name: mm_setup tenant_isolation_mm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_setup ON public.mm_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4654 (class 3256 OID 43049)
-- Name: mm_status_def tenant_isolation_mm_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_status_def ON public.mm_status_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4623 (class 3256 OID 43018)
-- Name: mm_vendor tenant_isolation_mm_vendor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_vendor ON public.mm_vendor USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4653 (class 3256 OID 43048)
-- Name: mm_vendor_rating_def tenant_isolation_mm_vendor_rating_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_mm_vendor_rating_def ON public.mm_vendor_rating_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4619 (class 3256 OID 43014)
-- Name: role_permission tenant_isolation_role_permission; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_role_permission ON public.role_permission USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4660 (class 3256 OID 43055)
-- Name: sd_carrier_def tenant_isolation_sd_carrier_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_carrier_def ON public.sd_carrier_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4661 (class 3256 OID 43056)
-- Name: sd_channel_def tenant_isolation_sd_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_channel_def ON public.sd_channel_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4658 (class 3256 OID 43053)
-- Name: sd_order_status_def tenant_isolation_sd_order_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_order_status_def ON public.sd_order_status_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4635 (class 3256 OID 43030)
-- Name: sd_payment tenant_isolation_sd_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_payment ON public.sd_payment USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4632 (class 3256 OID 43027)
-- Name: sd_sales_order tenant_isolation_sd_sales_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_sales_order ON public.sd_sales_order USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4633 (class 3256 OID 43028)
-- Name: sd_sales_order_item tenant_isolation_sd_sales_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_sales_order_item ON public.sd_sales_order_item USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4657 (class 3256 OID 43052)
-- Name: sd_setup tenant_isolation_sd_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_setup ON public.sd_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4634 (class 3256 OID 43029)
-- Name: sd_shipment tenant_isolation_sd_shipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_shipment ON public.sd_shipment USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4659 (class 3256 OID 43054)
-- Name: sd_shipment_status_def tenant_isolation_sd_shipment_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_sd_shipment_status_def ON public.sd_shipment_status_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4617 (class 3256 OID 43012)
-- Name: tenant tenant_isolation_tenant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_tenant ON public.tenant USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4618 (class 3256 OID 43013)
-- Name: user_profile tenant_isolation_user_profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_user_profile ON public.user_profile USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4629 (class 3256 OID 43024)
-- Name: wh_inventory_balance tenant_isolation_wh_inventory_balance; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_wh_inventory_balance ON public.wh_inventory_balance USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4630 (class 3256 OID 43025)
-- Name: wh_inventory_ledger tenant_isolation_wh_inventory_ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_wh_inventory_ledger ON public.wh_inventory_ledger USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4656 (class 3256 OID 43051)
-- Name: wh_inventory_status_def tenant_isolation_wh_inventory_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_wh_inventory_status_def ON public.wh_inventory_status_def USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4655 (class 3256 OID 43050)
-- Name: wh_setup tenant_isolation_wh_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_wh_setup ON public.wh_setup USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4628 (class 3256 OID 43023)
-- Name: wh_warehouse tenant_isolation_wh_warehouse; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY tenant_isolation_wh_warehouse ON public.wh_warehouse USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4687 (class 3256 OID 43130)
-- Name: app_setting upd_app_setting; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_app_setting ON public.app_setting FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4695 (class 3256 OID 43138)
-- Name: audit_log upd_audit_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_audit_log ON public.audit_log FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4787 (class 3256 OID 43230)
-- Name: co_cost_center upd_co_cost_center; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_cost_center ON public.co_cost_center FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4803 (class 3256 OID 43246)
-- Name: co_dashboard_tile upd_co_dashboard_tile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_dashboard_tile ON public.co_dashboard_tile FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4791 (class 3256 OID 43234)
-- Name: co_fiscal_period upd_co_fiscal_period; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_fiscal_period ON public.co_fiscal_period FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4795 (class 3256 OID 43238)
-- Name: co_kpi_definition upd_co_kpi_definition; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_kpi_definition ON public.co_kpi_definition FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4799 (class 3256 OID 43242)
-- Name: co_kpi_snapshot upd_co_kpi_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_kpi_snapshot ON public.co_kpi_snapshot FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4827 (class 3256 OID 43270)
-- Name: co_setup upd_co_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_co_setup ON public.co_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4739 (class 3256 OID 43182)
-- Name: crm_customer upd_crm_customer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_customer ON public.crm_customer FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4767 (class 3256 OID 43210)
-- Name: crm_interaction upd_crm_interaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_interaction ON public.crm_interaction FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4759 (class 3256 OID 43202)
-- Name: crm_lead upd_crm_lead; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_lead ON public.crm_lead FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4879 (class 3256 OID 43322)
-- Name: crm_lead_status_def upd_crm_lead_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_lead_status_def ON public.crm_lead_status_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4883 (class 3256 OID 43326)
-- Name: crm_opp_stage_def upd_crm_opp_stage_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_opp_stage_def ON public.crm_opp_stage_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4763 (class 3256 OID 43206)
-- Name: crm_opportunity upd_crm_opportunity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_opportunity ON public.crm_opportunity FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4819 (class 3256 OID 43262)
-- Name: crm_setup upd_crm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_setup ON public.crm_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4875 (class 3256 OID 43318)
-- Name: crm_source_def upd_crm_source_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_crm_source_def ON public.crm_source_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4691 (class 3256 OID 43134)
-- Name: doc_numbering upd_doc_numbering; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_doc_numbering ON public.doc_numbering FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4771 (class 3256 OID 43214)
-- Name: fi_account upd_fi_account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_account ON public.fi_account FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4775 (class 3256 OID 43218)
-- Name: fi_invoice upd_fi_invoice; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_invoice ON public.fi_invoice FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4779 (class 3256 OID 43222)
-- Name: fi_payment upd_fi_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_payment ON public.fi_payment FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4887 (class 3256 OID 43330)
-- Name: fi_payment_method_def upd_fi_payment_method_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_payment_method_def ON public.fi_payment_method_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4891 (class 3256 OID 43334)
-- Name: fi_payment_terms_def upd_fi_payment_terms_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_payment_terms_def ON public.fi_payment_terms_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4823 (class 3256 OID 43266)
-- Name: fi_setup upd_fi_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_setup ON public.fi_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4615 (class 3256 OID 43338)
-- Name: fi_tax_code_def upd_fi_tax_code_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_tax_code_def ON public.fi_tax_code_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4783 (class 3256 OID 43226)
-- Name: fi_transaction upd_fi_transaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_fi_transaction ON public.fi_transaction FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4699 (class 3256 OID 43142)
-- Name: import_job upd_import_job; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_import_job ON public.import_job FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4703 (class 3256 OID 43146)
-- Name: import_log upd_import_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_import_log ON public.import_log FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4831 (class 3256 OID 43274)
-- Name: mm_category_def upd_mm_category_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_category_def ON public.mm_category_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4835 (class 3256 OID 43278)
-- Name: mm_classification_def upd_mm_classification_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_classification_def ON public.mm_classification_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4843 (class 3256 OID 43286)
-- Name: mm_currency_def upd_mm_currency_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_currency_def ON public.mm_currency_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4711 (class 3256 OID 43154)
-- Name: mm_material upd_mm_material; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_material ON public.mm_material FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4839 (class 3256 OID 43282)
-- Name: mm_price_channel_def upd_mm_price_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_price_channel_def ON public.mm_price_channel_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4715 (class 3256 OID 43158)
-- Name: mm_purchase_order upd_mm_purchase_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_purchase_order ON public.mm_purchase_order FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4719 (class 3256 OID 43162)
-- Name: mm_purchase_order_item upd_mm_purchase_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_purchase_order_item ON public.mm_purchase_order_item FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4723 (class 3256 OID 43166)
-- Name: mm_receiving upd_mm_receiving; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_receiving ON public.mm_receiving FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4807 (class 3256 OID 43250)
-- Name: mm_setup upd_mm_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_setup ON public.mm_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4851 (class 3256 OID 43294)
-- Name: mm_status_def upd_mm_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_status_def ON public.mm_status_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4707 (class 3256 OID 43150)
-- Name: mm_vendor upd_mm_vendor; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_vendor ON public.mm_vendor FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4847 (class 3256 OID 43290)
-- Name: mm_vendor_rating_def upd_mm_vendor_rating_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_mm_vendor_rating_def ON public.mm_vendor_rating_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4683 (class 3256 OID 43126)
-- Name: role_permission upd_role_permission; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_role_permission ON public.role_permission FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4867 (class 3256 OID 43310)
-- Name: sd_carrier_def upd_sd_carrier_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_carrier_def ON public.sd_carrier_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4871 (class 3256 OID 43314)
-- Name: sd_channel_def upd_sd_channel_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_channel_def ON public.sd_channel_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4859 (class 3256 OID 43302)
-- Name: sd_order_status_def upd_sd_order_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_order_status_def ON public.sd_order_status_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4755 (class 3256 OID 43198)
-- Name: sd_payment upd_sd_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_payment ON public.sd_payment FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4743 (class 3256 OID 43186)
-- Name: sd_sales_order upd_sd_sales_order; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_sales_order ON public.sd_sales_order FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4747 (class 3256 OID 43190)
-- Name: sd_sales_order_item upd_sd_sales_order_item; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_sales_order_item ON public.sd_sales_order_item FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4815 (class 3256 OID 43258)
-- Name: sd_setup upd_sd_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_setup ON public.sd_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4751 (class 3256 OID 43194)
-- Name: sd_shipment upd_sd_shipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_shipment ON public.sd_shipment FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4863 (class 3256 OID 43306)
-- Name: sd_shipment_status_def upd_sd_shipment_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_sd_shipment_status_def ON public.sd_shipment_status_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4675 (class 3256 OID 43118)
-- Name: tenant upd_tenant; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_tenant ON public.tenant FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4679 (class 3256 OID 43122)
-- Name: user_profile upd_user_profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_user_profile ON public.user_profile FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4731 (class 3256 OID 43174)
-- Name: wh_inventory_balance upd_wh_inventory_balance; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_wh_inventory_balance ON public.wh_inventory_balance FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4735 (class 3256 OID 43178)
-- Name: wh_inventory_ledger upd_wh_inventory_ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_wh_inventory_ledger ON public.wh_inventory_ledger FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4855 (class 3256 OID 43298)
-- Name: wh_inventory_status_def upd_wh_inventory_status_def; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_wh_inventory_status_def ON public.wh_inventory_status_def FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4811 (class 3256 OID 43254)
-- Name: wh_setup upd_wh_setup; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_wh_setup ON public.wh_setup FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4727 (class 3256 OID 43170)
-- Name: wh_warehouse upd_wh_warehouse; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY upd_wh_warehouse ON public.wh_warehouse FOR UPDATE USING ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text))) WITH CHECK ((tenant_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'tenant_id'::text)));


--
-- TOC entry 4560 (class 0 OID 42389)
-- Dependencies: 347
-- Name: user_profile; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4571 (class 0 OID 42525)
-- Dependencies: 361
-- Name: wh_inventory_balance; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wh_inventory_balance ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4572 (class 0 OID 42535)
-- Dependencies: 363
-- Name: wh_inventory_ledger; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wh_inventory_ledger ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4598 (class 0 OID 42852)
-- Dependencies: 390
-- Name: wh_inventory_status_def; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wh_inventory_status_def ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4597 (class 0 OID 42842)
-- Dependencies: 389
-- Name: wh_setup; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wh_setup ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4570 (class 0 OID 42515)
-- Dependencies: 360
-- Name: wh_warehouse; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wh_warehouse ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4556 (class 0 OID 17277)
-- Dependencies: 341
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4540 (class 0 OID 16546)
-- Dependencies: 315
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4558 (class 0 OID 20086)
-- Dependencies: 343
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4542 (class 0 OID 16588)
-- Dependencies: 317
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4541 (class 0 OID 16561)
-- Dependencies: 316
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4557 (class 0 OID 20042)
-- Dependencies: 342
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4554 (class 0 OID 17062)
-- Dependencies: 334
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4555 (class 0 OID 17076)
-- Dependencies: 335
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4895 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 29
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 23
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 9
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 30
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 32
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 473
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 443
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 436
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 435
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 444
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 447
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 441
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 478
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 437
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 423
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 422
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 424
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 466
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 460
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 464
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 465
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 452
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 453
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 455
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 448
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 449
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 476
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 477
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 430
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 431
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 432
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 433
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 434
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 425
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 426
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 428
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 427
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 429
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 421
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 530
-- Name: FUNCTION calculate_po_item_totals(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_po_item_totals() TO anon;
GRANT ALL ON FUNCTION public.calculate_po_item_totals() TO authenticated;
GRANT ALL ON FUNCTION public.calculate_po_item_totals() TO service_role;


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 531
-- Name: FUNCTION calculate_so_item_totals(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_so_item_totals() TO anon;
GRANT ALL ON FUNCTION public.calculate_so_item_totals() TO authenticated;
GRANT ALL ON FUNCTION public.calculate_so_item_totals() TO service_role;


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 533
-- Name: FUNCTION create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid) TO anon;
GRANT ALL ON FUNCTION public.create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid) TO authenticated;
GRANT ALL ON FUNCTION public.create_audit_log(p_tenant_id text, p_table_name text, p_record_pk text, p_action text, p_diff_json jsonb, p_actor_user uuid) TO service_role;


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 535
-- Name: FUNCTION next_doc_number(p_tenant text, p_doc_type text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.next_doc_number(p_tenant text, p_doc_type text) TO anon;
GRANT ALL ON FUNCTION public.next_doc_number(p_tenant text, p_doc_type text) TO authenticated;
GRANT ALL ON FUNCTION public.next_doc_number(p_tenant text, p_doc_type text) TO service_role;


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 534
-- Name: FUNCTION refresh_kpi_snapshots(p_tenant_id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.refresh_kpi_snapshots(p_tenant_id text) TO anon;
GRANT ALL ON FUNCTION public.refresh_kpi_snapshots(p_tenant_id text) TO authenticated;
GRANT ALL ON FUNCTION public.refresh_kpi_snapshots(p_tenant_id text) TO service_role;


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 536
-- Name: FUNCTION trg_update_po_total(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_update_po_total() TO anon;
GRANT ALL ON FUNCTION public.trg_update_po_total() TO authenticated;
GRANT ALL ON FUNCTION public.trg_update_po_total() TO service_role;


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 538
-- Name: FUNCTION trg_update_po_total_on_delete(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_update_po_total_on_delete() TO anon;
GRANT ALL ON FUNCTION public.trg_update_po_total_on_delete() TO authenticated;
GRANT ALL ON FUNCTION public.trg_update_po_total_on_delete() TO service_role;


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 537
-- Name: FUNCTION trg_validate_warehouse_default(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_validate_warehouse_default() TO anon;
GRANT ALL ON FUNCTION public.trg_validate_warehouse_default() TO authenticated;
GRANT ALL ON FUNCTION public.trg_validate_warehouse_default() TO service_role;


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 528
-- Name: FUNCTION update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text) TO anon;
GRANT ALL ON FUNCTION public.update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text) TO authenticated;
GRANT ALL ON FUNCTION public.update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text) TO service_role;


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 532
-- Name: FUNCTION update_sales_order_total(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_sales_order_total() TO anon;
GRANT ALL ON FUNCTION public.update_sales_order_total() TO authenticated;
GRANT ALL ON FUNCTION public.update_sales_order_total() TO service_role;


--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 529
-- Name: FUNCTION validate_warehouse_default(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.validate_warehouse_default() TO anon;
GRANT ALL ON FUNCTION public.validate_warehouse_default() TO authenticated;
GRANT ALL ON FUNCTION public.validate_warehouse_default() TO service_role;


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 507
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 509
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 505
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 504
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 510
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 503
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 512
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 502
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 506
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 511
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 483
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 484
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 321
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 325
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 323
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 331
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 311
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 310
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 307
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE app_setting; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.app_setting TO anon;
GRANT ALL ON TABLE public.app_setting TO authenticated;
GRANT ALL ON TABLE public.app_setting TO service_role;


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE audit_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_log TO anon;
GRANT ALL ON TABLE public.audit_log TO authenticated;
GRANT ALL ON TABLE public.audit_log TO service_role;


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 351
-- Name: SEQUENCE audit_log_audit_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.audit_log_audit_id_seq TO anon;
GRANT ALL ON SEQUENCE public.audit_log_audit_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.audit_log_audit_id_seq TO service_role;


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE co_cost_center; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_cost_center TO anon;
GRANT ALL ON TABLE public.co_cost_center TO authenticated;
GRANT ALL ON TABLE public.co_cost_center TO service_role;


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 381
-- Name: TABLE co_dashboard_tile; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_dashboard_tile TO anon;
GRANT ALL ON TABLE public.co_dashboard_tile TO authenticated;
GRANT ALL ON TABLE public.co_dashboard_tile TO service_role;


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 378
-- Name: TABLE co_fiscal_period; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_fiscal_period TO anon;
GRANT ALL ON TABLE public.co_fiscal_period TO authenticated;
GRANT ALL ON TABLE public.co_fiscal_period TO service_role;


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 379
-- Name: TABLE co_kpi_definition; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_kpi_definition TO anon;
GRANT ALL ON TABLE public.co_kpi_definition TO authenticated;
GRANT ALL ON TABLE public.co_kpi_definition TO service_role;


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE co_kpi_snapshot; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_kpi_snapshot TO anon;
GRANT ALL ON TABLE public.co_kpi_snapshot TO authenticated;
GRANT ALL ON TABLE public.co_kpi_snapshot TO service_role;


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 404
-- Name: TABLE co_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.co_setup TO anon;
GRANT ALL ON TABLE public.co_setup TO authenticated;
GRANT ALL ON TABLE public.co_setup TO service_role;


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE crm_customer; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_customer TO anon;
GRANT ALL ON TABLE public.crm_customer TO authenticated;
GRANT ALL ON TABLE public.crm_customer TO service_role;


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE crm_interaction; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_interaction TO anon;
GRANT ALL ON TABLE public.crm_interaction TO authenticated;
GRANT ALL ON TABLE public.crm_interaction TO service_role;


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 371
-- Name: SEQUENCE crm_interaction_interaction_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crm_interaction_interaction_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crm_interaction_interaction_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crm_interaction_interaction_id_seq TO service_role;


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE crm_lead; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_lead TO anon;
GRANT ALL ON TABLE public.crm_lead TO authenticated;
GRANT ALL ON TABLE public.crm_lead TO service_role;


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 398
-- Name: TABLE crm_lead_status_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_lead_status_def TO anon;
GRANT ALL ON TABLE public.crm_lead_status_def TO authenticated;
GRANT ALL ON TABLE public.crm_lead_status_def TO service_role;


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 399
-- Name: TABLE crm_opp_stage_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_opp_stage_def TO anon;
GRANT ALL ON TABLE public.crm_opp_stage_def TO authenticated;
GRANT ALL ON TABLE public.crm_opp_stage_def TO service_role;


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE crm_opportunity; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_opportunity TO anon;
GRANT ALL ON TABLE public.crm_opportunity TO authenticated;
GRANT ALL ON TABLE public.crm_opportunity TO service_role;


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE crm_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_setup TO anon;
GRANT ALL ON TABLE public.crm_setup TO authenticated;
GRANT ALL ON TABLE public.crm_setup TO service_role;


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 397
-- Name: TABLE crm_source_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_source_def TO anon;
GRANT ALL ON TABLE public.crm_source_def TO authenticated;
GRANT ALL ON TABLE public.crm_source_def TO service_role;


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE doc_numbering; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.doc_numbering TO anon;
GRANT ALL ON TABLE public.doc_numbering TO authenticated;
GRANT ALL ON TABLE public.doc_numbering TO service_role;


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE fi_account; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_account TO anon;
GRANT ALL ON TABLE public.fi_account TO authenticated;
GRANT ALL ON TABLE public.fi_account TO service_role;


--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 374
-- Name: TABLE fi_invoice; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_invoice TO anon;
GRANT ALL ON TABLE public.fi_invoice TO authenticated;
GRANT ALL ON TABLE public.fi_invoice TO service_role;


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 375
-- Name: TABLE fi_payment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_payment TO anon;
GRANT ALL ON TABLE public.fi_payment TO authenticated;
GRANT ALL ON TABLE public.fi_payment TO service_role;


--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 401
-- Name: TABLE fi_payment_method_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_payment_method_def TO anon;
GRANT ALL ON TABLE public.fi_payment_method_def TO authenticated;
GRANT ALL ON TABLE public.fi_payment_method_def TO service_role;


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 402
-- Name: TABLE fi_payment_terms_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_payment_terms_def TO anon;
GRANT ALL ON TABLE public.fi_payment_terms_def TO authenticated;
GRANT ALL ON TABLE public.fi_payment_terms_def TO service_role;


--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 400
-- Name: TABLE fi_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_setup TO anon;
GRANT ALL ON TABLE public.fi_setup TO authenticated;
GRANT ALL ON TABLE public.fi_setup TO service_role;


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 403
-- Name: TABLE fi_tax_code_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_tax_code_def TO anon;
GRANT ALL ON TABLE public.fi_tax_code_def TO authenticated;
GRANT ALL ON TABLE public.fi_tax_code_def TO service_role;


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 376
-- Name: TABLE fi_transaction; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fi_transaction TO anon;
GRANT ALL ON TABLE public.fi_transaction TO authenticated;
GRANT ALL ON TABLE public.fi_transaction TO service_role;


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 406
-- Name: TABLE import_job; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_job TO anon;
GRANT ALL ON TABLE public.import_job TO authenticated;
GRANT ALL ON TABLE public.import_job TO service_role;


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 405
-- Name: SEQUENCE import_job_job_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.import_job_job_id_seq TO anon;
GRANT ALL ON SEQUENCE public.import_job_job_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.import_job_job_id_seq TO service_role;


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 408
-- Name: TABLE import_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_log TO anon;
GRANT ALL ON TABLE public.import_log TO authenticated;
GRANT ALL ON TABLE public.import_log TO service_role;


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 407
-- Name: SEQUENCE import_log_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.import_log_log_id_seq TO anon;
GRANT ALL ON SEQUENCE public.import_log_log_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.import_log_log_id_seq TO service_role;


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE mm_category_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_category_def TO anon;
GRANT ALL ON TABLE public.mm_category_def TO authenticated;
GRANT ALL ON TABLE public.mm_category_def TO service_role;


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 384
-- Name: TABLE mm_classification_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_classification_def TO anon;
GRANT ALL ON TABLE public.mm_classification_def TO authenticated;
GRANT ALL ON TABLE public.mm_classification_def TO service_role;


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE mm_currency_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_currency_def TO anon;
GRANT ALL ON TABLE public.mm_currency_def TO authenticated;
GRANT ALL ON TABLE public.mm_currency_def TO service_role;


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE mm_material; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_material TO anon;
GRANT ALL ON TABLE public.mm_material TO authenticated;
GRANT ALL ON TABLE public.mm_material TO service_role;


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 385
-- Name: TABLE mm_price_channel_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_price_channel_def TO anon;
GRANT ALL ON TABLE public.mm_price_channel_def TO authenticated;
GRANT ALL ON TABLE public.mm_price_channel_def TO service_role;


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE mm_purchase_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_purchase_order TO anon;
GRANT ALL ON TABLE public.mm_purchase_order TO authenticated;
GRANT ALL ON TABLE public.mm_purchase_order TO service_role;


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE mm_purchase_order_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_purchase_order_item TO anon;
GRANT ALL ON TABLE public.mm_purchase_order_item TO authenticated;
GRANT ALL ON TABLE public.mm_purchase_order_item TO service_role;


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 356
-- Name: SEQUENCE mm_purchase_order_item_po_item_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.mm_purchase_order_item_po_item_id_seq TO anon;
GRANT ALL ON SEQUENCE public.mm_purchase_order_item_po_item_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.mm_purchase_order_item_po_item_id_seq TO service_role;


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE mm_receiving; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_receiving TO anon;
GRANT ALL ON TABLE public.mm_receiving TO authenticated;
GRANT ALL ON TABLE public.mm_receiving TO service_role;


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 358
-- Name: SEQUENCE mm_receiving_recv_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.mm_receiving_recv_id_seq TO anon;
GRANT ALL ON SEQUENCE public.mm_receiving_recv_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.mm_receiving_recv_id_seq TO service_role;


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 382
-- Name: TABLE mm_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_setup TO anon;
GRANT ALL ON TABLE public.mm_setup TO authenticated;
GRANT ALL ON TABLE public.mm_setup TO service_role;


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE mm_status_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_status_def TO anon;
GRANT ALL ON TABLE public.mm_status_def TO authenticated;
GRANT ALL ON TABLE public.mm_status_def TO service_role;


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE mm_vendor; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_vendor TO anon;
GRANT ALL ON TABLE public.mm_vendor TO authenticated;
GRANT ALL ON TABLE public.mm_vendor TO service_role;


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE mm_vendor_rating_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mm_vendor_rating_def TO anon;
GRANT ALL ON TABLE public.mm_vendor_rating_def TO authenticated;
GRANT ALL ON TABLE public.mm_vendor_rating_def TO service_role;


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE role_permission; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role_permission TO anon;
GRANT ALL ON TABLE public.role_permission TO authenticated;
GRANT ALL ON TABLE public.role_permission TO service_role;


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 394
-- Name: TABLE sd_carrier_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_carrier_def TO anon;
GRANT ALL ON TABLE public.sd_carrier_def TO authenticated;
GRANT ALL ON TABLE public.sd_carrier_def TO service_role;


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 395
-- Name: TABLE sd_channel_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_channel_def TO anon;
GRANT ALL ON TABLE public.sd_channel_def TO authenticated;
GRANT ALL ON TABLE public.sd_channel_def TO service_role;


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE sd_order_status_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_order_status_def TO anon;
GRANT ALL ON TABLE public.sd_order_status_def TO authenticated;
GRANT ALL ON TABLE public.sd_order_status_def TO service_role;


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE sd_payment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_payment TO anon;
GRANT ALL ON TABLE public.sd_payment TO authenticated;
GRANT ALL ON TABLE public.sd_payment TO service_role;


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE sd_sales_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_sales_order TO anon;
GRANT ALL ON TABLE public.sd_sales_order TO authenticated;
GRANT ALL ON TABLE public.sd_sales_order TO service_role;


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE sd_sales_order_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_sales_order_item TO anon;
GRANT ALL ON TABLE public.sd_sales_order_item TO authenticated;
GRANT ALL ON TABLE public.sd_sales_order_item TO service_role;


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE sd_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_setup TO anon;
GRANT ALL ON TABLE public.sd_setup TO authenticated;
GRANT ALL ON TABLE public.sd_setup TO service_role;


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE sd_shipment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_shipment TO anon;
GRANT ALL ON TABLE public.sd_shipment TO authenticated;
GRANT ALL ON TABLE public.sd_shipment TO service_role;


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 393
-- Name: TABLE sd_shipment_status_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sd_shipment_status_def TO anon;
GRANT ALL ON TABLE public.sd_shipment_status_def TO authenticated;
GRANT ALL ON TABLE public.sd_shipment_status_def TO service_role;


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE tenant; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tenant TO anon;
GRANT ALL ON TABLE public.tenant TO authenticated;
GRANT ALL ON TABLE public.tenant TO service_role;


--
-- TOC entry 5200 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE user_profile; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_profile TO anon;
GRANT ALL ON TABLE public.user_profile TO authenticated;
GRANT ALL ON TABLE public.user_profile TO service_role;


--
-- TOC entry 5201 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE wh_inventory_balance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wh_inventory_balance TO anon;
GRANT ALL ON TABLE public.wh_inventory_balance TO authenticated;
GRANT ALL ON TABLE public.wh_inventory_balance TO service_role;


--
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 409
-- Name: TABLE v_material_overview; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_material_overview TO anon;
GRANT ALL ON TABLE public.v_material_overview TO authenticated;
GRANT ALL ON TABLE public.v_material_overview TO service_role;


--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE wh_inventory_ledger; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wh_inventory_ledger TO anon;
GRANT ALL ON TABLE public.wh_inventory_ledger TO authenticated;
GRANT ALL ON TABLE public.wh_inventory_ledger TO service_role;


--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 362
-- Name: SEQUENCE wh_inventory_ledger_ledger_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.wh_inventory_ledger_ledger_id_seq TO anon;
GRANT ALL ON SEQUENCE public.wh_inventory_ledger_ledger_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.wh_inventory_ledger_ledger_id_seq TO service_role;


--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE wh_inventory_status_def; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wh_inventory_status_def TO anon;
GRANT ALL ON TABLE public.wh_inventory_status_def TO authenticated;
GRANT ALL ON TABLE public.wh_inventory_status_def TO service_role;


--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE wh_setup; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wh_setup TO anon;
GRANT ALL ON TABLE public.wh_setup TO authenticated;
GRANT ALL ON TABLE public.wh_setup TO service_role;


--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE wh_warehouse; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wh_warehouse TO anon;
GRANT ALL ON TABLE public.wh_warehouse TO authenticated;
GRANT ALL ON TABLE public.wh_warehouse TO service_role;


--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 337
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 315
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 335
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 319
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2689 (class 826 OID 16603)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2690 (class 826 OID 16604)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2688 (class 826 OID 16602)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2699 (class 826 OID 16682)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2698 (class 826 OID 16681)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2697 (class 826 OID 16680)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2702 (class 826 OID 16637)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2701 (class 826 OID 16636)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2700 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2694 (class 826 OID 16617)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2696 (class 826 OID 16616)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2695 (class 826 OID 16615)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2681 (class 826 OID 16490)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2682 (class 826 OID 16491)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2680 (class 826 OID 16489)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2684 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2679 (class 826 OID 16488)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2683 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2692 (class 826 OID 16607)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2693 (class 826 OID 16608)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2691 (class 826 OID 16606)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2687 (class 826 OID 16545)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2686 (class 826 OID 16544)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2685 (class 826 OID 16543)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3869 (class 3466 OID 16621)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 3874 (class 3466 OID 16700)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 3868 (class 3466 OID 16619)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 3875 (class 3466 OID 16703)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 3870 (class 3466 OID 16622)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 3871 (class 3466 OID 16623)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2025-09-19 11:17:49

--
-- PostgreSQL database dump complete
--

\unrestrict FqJhdNF4pBnc4YQQRYuDQLvZkPYfi6dvAJrjay0BNRuzJaZQKtlshcCSbVBFlBR

