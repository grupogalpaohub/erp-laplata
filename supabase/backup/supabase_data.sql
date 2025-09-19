--
-- PostgreSQL database dump
--

\restrict VifAihHjSGMLAPwDyv2jbBBXMq5LyyBxRZzBcRA9aFvYeL8hBUyP17u03vt2kA0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-19 11:18:41

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
-- TOC entry 4696 (class 0 OID 16525)
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
-- TOC entry 4710 (class 0 OID 16927)
-- Dependencies: 330
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
789d27e9-d16c-457c-ae24-bf6388e023a7	469e7d8c-3439-4423-82df-d89a8b80f1ee	29910286-b4bd-456e-9cd5-4bf977127fa6	s256	cVgZCUexCn3TU4y2k7cm5-2ooDwPFaGJu-yevE_WuWA	google	ya29.a0AQQ_BDQoYY8kXzm_DyOsAQOdTwMLKBV1XTSS7DPYv8gQvgVe1b3Bj7i-aZuWFFxOZLW6SNe0RE0MG_kNH6KmgeNe7H7z1TEu0pqznIhA3HZkxFNPihbiFoEsCmnqojjOg7AbAk4n5eo4mE0SZVTjKxThLwkA7UlvFTsf2XrKw9PKNvTNYKwrDE9G2kqqR4fxDiTaX8_VaCgYKAUcSARYSFQHGX2MiKwyRRdfohvrIU8yenCg-vw0207		2025-09-19 05:27:54.462655+00	2025-09-19 05:27:57.874349+00	oauth	2025-09-19 05:27:57.874286+00
c42f0f02-8069-4d4a-af73-dfbef583316b	469e7d8c-3439-4423-82df-d89a8b80f1ee	d5cfcee1-6645-4875-82bb-17b38c925853	s256	y-VlXYYjw9fU1Bk3KNzf04FvFAgCnC94qWNbzZ1AC1c	google	ya29.a0AQQ_BDRGmyaFqR5CS7S7_sN6629J12J6ESV9YnVTk6aLMj2k6EEhXRAz6IenPkbW6oStUS9GwF6GM8_5C3BPNGul6qYrU4ecZnA0seXMMmqCswkIEVrBESsAxzkQDmx-lp7z6h0t7SZUEov_qgbr-YhbMfp1LfiK5AYn37Z2AsRngTpUdzy2sQ8rsW5dlUvpkyFqmqlTaCgYKAVMSARYSFQHGX2MiSpPltcEv_enVxTnQubJKiQ0207		2025-09-19 06:22:30.739568+00	2025-09-19 06:22:34.121708+00	oauth	2025-09-19 06:22:34.121653+00
85a87e09-44c8-48d1-af68-3eabb0cae204	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	72b7d997-e2ee-4dc7-ade3-4962d7caf043	s256	zRw8n-o9U8T2oZYKer2PurhVNdd-_TZclsW-ih4cnus	google	ya29.a0AQQ_BDSx4P6Ka2JQN7HKVz5863sSo2zfrseR8VOL_mI8460LeIHc-YuTYzVS-H9kH7q-oVy6njXfZ0udB052T-sgOLHsdsefGr141r21WEKQqspqB2ct0FygWnQB3Difc9Sbo6gz4d4EF9oAbxoOupT3pgNbdx6v90IabRc08a-ZXSlJHp0iFroNoSP7B6G6CBUuGNcaCgYKAWASARISFQHGX2MiMRYg2xMhHPwkWIO3hLAIAQ0206		2025-09-19 06:25:33.180085+00	2025-09-19 06:26:00.493687+00	oauth	2025-09-19 06:26:00.49364+00
\.


--
-- TOC entry 4692 (class 0 OID 16495)
-- Dependencies: 309
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	469e7d8c-3439-4423-82df-d89a8b80f1ee	authenticated	authenticated	grupogalpaohub@gmail.com	\N	2025-09-17 16:42:01.684878+00	\N		\N		\N			\N	2025-09-19 09:03:32.604924+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112058218087376291100", "name": "Grupo Galpão Hub", "email": "grupogalpaohub@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "full_name": "Grupo Galpão Hub", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "provider_id": "112058218087376291100", "email_verified": true, "phone_verified": false}	\N	2025-09-17 16:42:01.608625+00	2025-09-19 09:03:32.611671+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	authenticated	authenticated	rodrigo.g.seabra@gmail.com	\N	2025-09-19 06:26:00.487785+00	\N		\N		\N			\N	\N	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "101048769697429146013", "name": "Rodrigo Gomes", "email": "rodrigo.g.seabra@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "full_name": "Rodrigo Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "provider_id": "101048769697429146013", "email_verified": true, "phone_verified": false}	\N	2025-09-19 06:26:00.450462+00	2025-09-19 06:26:00.489273+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d95b59ee-d2e9-4beb-b280-acb47271caa6	authenticated	authenticated	laplatalunaria@gmail.com	\N	2025-09-19 06:09:03.408074+00	\N		\N		\N			\N	2025-09-19 08:56:43.473254+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112328035603960513181", "name": "La Plata Lunaria", "email": "laplatalunaria@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "full_name": "La Plata Lunaria", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "provider_id": "112328035603960513181", "email_verified": true, "phone_verified": false}	\N	2025-09-19 06:09:03.384287+00	2025-09-19 08:56:43.477474+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4701 (class 0 OID 16725)
-- Dependencies: 321
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
101048769697429146013	41d9c9b3-1160-4d1c-b984-a87efbe9b1b3	{"iss": "https://accounts.google.com", "sub": "101048769697429146013", "name": "Rodrigo Gomes", "email": "rodrigo.g.seabra@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "full_name": "Rodrigo Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdFIbDlKqgGKW36XASAT4YOJ2_LWZugIv4uBj6hpXpPSxGtg=s96-c", "provider_id": "101048769697429146013", "email_verified": true, "phone_verified": false}	google	2025-09-19 06:26:00.470924+00	2025-09-19 06:26:00.470982+00	2025-09-19 06:26:00.470982+00	0cb5ed10-0817-487c-80b6-afb14f24486e
112328035603960513181	d95b59ee-d2e9-4beb-b280-acb47271caa6	{"iss": "https://accounts.google.com", "sub": "112328035603960513181", "name": "La Plata Lunaria", "email": "laplatalunaria@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "full_name": "La Plata Lunaria", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocItCPrPRO0EDKYWAzgw08oRO5G6a-zyRei3ZHqw1xjbMxywxT4=s96-c", "provider_id": "112328035603960513181", "email_verified": true, "phone_verified": false}	google	2025-09-19 06:09:03.402496+00	2025-09-19 06:09:03.402548+00	2025-09-19 08:56:43.469086+00	98c821a1-ecc4-4748-b96a-2155d92aefee
112058218087376291100	469e7d8c-3439-4423-82df-d89a8b80f1ee	{"iss": "https://accounts.google.com", "sub": "112058218087376291100", "name": "Grupo Galpão Hub", "email": "grupogalpaohub@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "full_name": "Grupo Galpão Hub", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocInOr7hk6fs-UX4Zz6fTwgxVUiEfoYS2mjIBq1Cbj1mP0pUG9Q=s96-c", "provider_id": "112058218087376291100", "email_verified": true, "phone_verified": false}	google	2025-09-17 16:42:01.662653+00	2025-09-17 16:42:01.662713+00	2025-09-19 09:03:32.598945+00	6f01b0cf-90a0-4d85-8fa4-3228000875c3
\.


--
-- TOC entry 4695 (class 0 OID 16518)
-- Dependencies: 312
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4702 (class 0 OID 16755)
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
-- TOC entry 4705 (class 0 OID 16814)
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
-- TOC entry 4703 (class 0 OID 16789)
-- Dependencies: 323
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- TOC entry 4704 (class 0 OID 16802)
-- Dependencies: 324
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4712 (class 0 OID 17009)
-- Dependencies: 332
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4711 (class 0 OID 16977)
-- Dependencies: 331
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4694 (class 0 OID 16507)
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
-- TOC entry 4706 (class 0 OID 16832)
-- Dependencies: 326
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4708 (class 0 OID 16856)
-- Dependencies: 328
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4709 (class 0 OID 16874)
-- Dependencies: 329
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4697 (class 0 OID 16533)
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
-- TOC entry 4707 (class 0 OID 16841)
-- Dependencies: 327
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4725 (class 0 OID 42407)
-- Dependencies: 349
-- Data for Name: app_setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_setting (tenant_id, key, value, updated_at) FROM stdin;
\.


--
-- TOC entry 4728 (class 0 OID 42425)
-- Dependencies: 352
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (audit_id, tenant_id, table_name, record_pk, action, diff_json, actor_user, created_at) FROM stdin;
\.


--
-- TOC entry 4753 (class 0 OID 42721)
-- Dependencies: 377
-- Data for Name: co_cost_center; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_cost_center (tenant_id, cc_id, name, parent_cc_id, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4755 (class 0 OID 42744)
-- Dependencies: 379
-- Data for Name: co_kpi_definition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_kpi_definition (tenant_id, kpi_key, name, unit, description, created_at) FROM stdin;
LaplataLunaria	SALES_TODAY	Vendas Hoje	BRL	Total de vendas do dia	2025-09-18 06:25:50.843452+00
LaplataLunaria	ORDERS_OPEN	Pedidos Abertos	Qtd	Número de pedidos em aberto	2025-09-18 06:25:50.843452+00
LaplataLunaria	INVENTORY_VALUE	Valor do Estoque	BRL	Valor total dos materiais em estoque	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4757 (class 0 OID 42764)
-- Dependencies: 381
-- Data for Name: co_dashboard_tile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_dashboard_tile (tenant_id, tile_id, kpi_key, title, subtitle, order_index, color, is_active, created_at) FROM stdin;
LaplataLunaria	TILE01	SALES_TODAY	Vendas Hoje	Resumo diário	1	#4CAF50	t	2025-09-18 06:25:50.843452+00
LaplataLunaria	TILE02	ORDERS_OPEN	Pedidos Abertos	Situação comercial	2	#2196F3	t	2025-09-18 06:25:50.843452+00
LaplataLunaria	TILE03	INVENTORY_VALUE	Valor do Estoque	Resumo logístico	3	#FFC107	t	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4754 (class 0 OID 42735)
-- Dependencies: 378
-- Data for Name: co_fiscal_period; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_fiscal_period (tenant_id, period_id, start_date, end_date, status, created_at) FROM stdin;
\.


--
-- TOC entry 4756 (class 0 OID 42752)
-- Dependencies: 380
-- Data for Name: co_kpi_snapshot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number, meta_json) FROM stdin;
\.


--
-- TOC entry 4780 (class 0 OID 42974)
-- Dependencies: 404
-- Data for Name: co_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_setup (tenant_id, timezone, kpi_refresh_cron) FROM stdin;
LaplataLunaria	America/Sao_Paulo	0 */15 * * * *
\.


--
-- TOC entry 4740 (class 0 OID 42544)
-- Dependencies: 364
-- Data for Name: crm_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_customer (tenant_id, customer_id, name, email, telefone, customer_type, status, created_date) FROM stdin;
\.


--
-- TOC entry 4745 (class 0 OID 42616)
-- Dependencies: 369
-- Data for Name: crm_lead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_lead (tenant_id, lead_id, name, email, phone, source, status, score, owner_user, created_date) FROM stdin;
\.


--
-- TOC entry 4748 (class 0 OID 42641)
-- Dependencies: 372
-- Data for Name: crm_interaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_interaction (tenant_id, interaction_id, lead_id, channel, content, sentiment, created_date) FROM stdin;
\.


--
-- TOC entry 4774 (class 0 OID 42922)
-- Dependencies: 398
-- Data for Name: crm_lead_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_lead_status_def (tenant_id, status, description, order_index, is_final) FROM stdin;
\.


--
-- TOC entry 4775 (class 0 OID 42931)
-- Dependencies: 399
-- Data for Name: crm_opp_stage_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_opp_stage_def (tenant_id, stage, description, order_index, is_final) FROM stdin;
\.


--
-- TOC entry 4746 (class 0 OID 42625)
-- Dependencies: 370
-- Data for Name: crm_opportunity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_opportunity (tenant_id, opp_id, lead_id, stage, est_value_cents, probability, next_action_at, status, created_date) FROM stdin;
\.


--
-- TOC entry 4772 (class 0 OID 42905)
-- Dependencies: 396
-- Data for Name: crm_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_setup (tenant_id, require_contact_info, auto_convert_on_first_order) FROM stdin;
LaplataLunaria	t	f
\.


--
-- TOC entry 4773 (class 0 OID 42914)
-- Dependencies: 397
-- Data for Name: crm_source_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_source_def (tenant_id, source, is_active) FROM stdin;
\.


--
-- TOC entry 4726 (class 0 OID 42415)
-- Dependencies: 350
-- Data for Name: doc_numbering; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active) FROM stdin;
\.


--
-- TOC entry 4749 (class 0 OID 42655)
-- Dependencies: 373
-- Data for Name: fi_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_account (tenant_id, account_id, name, type, currency, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4729 (class 0 OID 42434)
-- Dependencies: 353
-- Data for Name: mm_vendor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_vendor (tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating, created_at, contact_person, address, city, state, zip_code, country, tax_id, payment_terms, rating, status) FROM stdin;
LaplataLunaria	SUP_00001	Silvercrown	sac.silvercrown@gmail.com	(44) 9184-4337	Paranavai	PR	A	2025-09-18 07:23:45.29189+00	\N	\N	\N	\N	\N	Brasil	\N	30	B	active
\.


--
-- TOC entry 4750 (class 0 OID 42665)
-- Dependencies: 374
-- Data for Name: fi_invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_invoice (tenant_id, invoice_id, source_type, source_id, customer_id, vendor_id, amount_cents, due_date, status, created_date) FROM stdin;
\.


--
-- TOC entry 4751 (class 0 OID 42685)
-- Dependencies: 375
-- Data for Name: fi_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_payment (tenant_id, payment_id, invoice_id, account_id, amount_cents, payment_date, method, status, created_at) FROM stdin;
\.


--
-- TOC entry 4777 (class 0 OID 42950)
-- Dependencies: 401
-- Data for Name: fi_payment_method_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_payment_method_def (tenant_id, method, display_name, is_active) FROM stdin;
\.


--
-- TOC entry 4778 (class 0 OID 42958)
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
-- TOC entry 4776 (class 0 OID 42940)
-- Dependencies: 400
-- Data for Name: fi_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_setup (tenant_id, currency, tax_inclusive, default_ar_account_id, default_ap_account_id, rounding_policy) FROM stdin;
LaplataLunaria	BRL	f	\N	\N	bankers
\.


--
-- TOC entry 4779 (class 0 OID 42966)
-- Dependencies: 403
-- Data for Name: fi_tax_code_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_tax_code_def (tenant_id, tax_code, description, rate_bp) FROM stdin;
\.


--
-- TOC entry 4752 (class 0 OID 42706)
-- Dependencies: 376
-- Data for Name: fi_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fi_transaction (tenant_id, transaction_id, account_id, type, amount_cents, ref_type, ref_id, date, created_at) FROM stdin;
\.


--
-- TOC entry 4782 (class 0 OID 42984)
-- Dependencies: 406
-- Data for Name: import_job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_job (tenant_id, job_id, job_type, status, total_records, processed_records, error_records, started_at, completed_at, created_at) FROM stdin;
\.


--
-- TOC entry 4784 (class 0 OID 42998)
-- Dependencies: 408
-- Data for Name: import_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_log (tenant_id, log_id, job_id, record_number, status, error_message, data_json, created_at) FROM stdin;
\.


--
-- TOC entry 4759 (class 0 OID 42793)
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
-- TOC entry 4760 (class 0 OID 42801)
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
-- TOC entry 4762 (class 0 OID 42817)
-- Dependencies: 386
-- Data for Name: mm_currency_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_currency_def (tenant_id, currency, is_active) FROM stdin;
LaplataLunaria	BRL	t
LaplataLunaria	USD	t
LaplataLunaria	EUR	t
\.


--
-- TOC entry 4730 (class 0 OID 42442)
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
-- TOC entry 4761 (class 0 OID 42809)
-- Dependencies: 385
-- Data for Name: mm_price_channel_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_price_channel_def (tenant_id, channel, is_active) FROM stdin;
\.


--
-- TOC entry 4731 (class 0 OID 42457)
-- Dependencies: 355
-- Data for Name: mm_purchase_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_purchase_order (tenant_id, mm_order, vendor_id, status, po_date, expected_delivery, notes, created_at, total_amount, currency) FROM stdin;
LaplataLunaria	PO-2025-001	SUP_00001	received	2025-09-18	2025-09-25	Carga inicial	2025-09-18 07:23:45.29189+00	1068920	BRL
\.


--
-- TOC entry 4733 (class 0 OID 42473)
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
-- TOC entry 4735 (class 0 OID 42495)
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
-- TOC entry 4758 (class 0 OID 42780)
-- Dependencies: 382
-- Data for Name: mm_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_setup (tenant_id, default_payment_terms, default_currency, default_wh_id, require_mat_type, require_mat_class, allow_zero_price, default_uom) FROM stdin;
LaplataLunaria	30	BRL	\N	t	t	f	unidade
\.


--
-- TOC entry 4764 (class 0 OID 42833)
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
-- TOC entry 4763 (class 0 OID 42825)
-- Dependencies: 387
-- Data for Name: mm_vendor_rating_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mm_vendor_rating_def (tenant_id, rating, is_active) FROM stdin;
LaplataLunaria	A	t
LaplataLunaria	B	t
LaplataLunaria	C	t
\.


--
-- TOC entry 4724 (class 0 OID 42399)
-- Dependencies: 348
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permission (tenant_id, role, resource, action, allowed) FROM stdin;
\.


--
-- TOC entry 4770 (class 0 OID 42889)
-- Dependencies: 394
-- Data for Name: sd_carrier_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_carrier_def (tenant_id, carrier_code, carrier_name, is_active) FROM stdin;
\.


--
-- TOC entry 4771 (class 0 OID 42897)
-- Dependencies: 395
-- Data for Name: sd_channel_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_channel_def (tenant_id, channel, is_active) FROM stdin;
\.


--
-- TOC entry 4768 (class 0 OID 42871)
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
-- TOC entry 4741 (class 0 OID 42554)
-- Dependencies: 365
-- Data for Name: sd_sales_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_sales_order (tenant_id, so_id, customer_id, status, order_date, expected_ship, total_cents, created_at) FROM stdin;
\.


--
-- TOC entry 4744 (class 0 OID 42600)
-- Dependencies: 368
-- Data for Name: sd_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_payment (tenant_id, payment_id, so_id, amount_cents, payment_date, payment_method, status, created_at) FROM stdin;
\.


--
-- TOC entry 4742 (class 0 OID 42570)
-- Dependencies: 366
-- Data for Name: sd_sales_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_sales_order_item (tenant_id, so_id, sku, quantity, unit_price_cents, line_total_cents, row_no) FROM stdin;
\.


--
-- TOC entry 4767 (class 0 OID 42860)
-- Dependencies: 391
-- Data for Name: sd_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_setup (tenant_id, backorder_policy, pricing_mode, default_channel, auto_reserve_on_confirm) FROM stdin;
LaplataLunaria	block	material	site	t
\.


--
-- TOC entry 4743 (class 0 OID 42586)
-- Dependencies: 367
-- Data for Name: sd_shipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_shipment (tenant_id, shipment_id, so_id, warehouse_id, ship_date, status, carrier, tracking_code, created_at) FROM stdin;
\.


--
-- TOC entry 4769 (class 0 OID 42880)
-- Dependencies: 393
-- Data for Name: sd_shipment_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_shipment_status_def (tenant_id, status, description, is_final, order_index) FROM stdin;
LaplataLunaria	pending	Aguardando envio	f	1
LaplataLunaria	in_transit	Em trânsito	f	2
LaplataLunaria	delivered	Entregue	t	99
\.


--
-- TOC entry 4722 (class 0 OID 42379)
-- Dependencies: 346
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant (tenant_id, display_name, locale, timezone, created_at) FROM stdin;
LaplataLunaria	La Plata Lunária	pt-BR	America/Sao_Paulo	2025-09-18 06:25:50.843452+00
\.


--
-- TOC entry 4723 (class 0 OID 42389)
-- Dependencies: 347
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profile (tenant_id, user_id, name, email, role, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4737 (class 0 OID 42525)
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
-- TOC entry 4739 (class 0 OID 42535)
-- Dependencies: 363
-- Data for Name: wh_inventory_ledger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_inventory_ledger (ledger_id, tenant_id, plant_id, mm_material, movement, qty, ref_type, ref_id, created_at) FROM stdin;
\.


--
-- TOC entry 4766 (class 0 OID 42852)
-- Dependencies: 390
-- Data for Name: wh_inventory_status_def; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_inventory_status_def (tenant_id, status, is_active) FROM stdin;
LaplataLunaria	active	t
LaplataLunaria	blocked	t
LaplataLunaria	counting	t
\.


--
-- TOC entry 4765 (class 0 OID 42842)
-- Dependencies: 389
-- Data for Name: wh_setup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_setup (tenant_id, default_plant_id, reserve_policy, negative_stock_allowed, picking_strategy) FROM stdin;
LaplataLunaria	WH-001	no_backorder	f	fifo
\.


--
-- TOC entry 4736 (class 0 OID 42515)
-- Dependencies: 360
-- Data for Name: wh_warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_warehouse (tenant_id, plant_id, name, is_default, created_at, address, city, state, zip_code, country, contact_person, phone, email) FROM stdin;
LaplataLunaria	WH-001	Depósito Principal	t	2025-09-18 07:23:45.29189+00	\N	\N	\N	\N	Brasil	\N	\N	\N
\.


--
-- TOC entry 4713 (class 0 OID 17025)
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
-- TOC entry 4717 (class 0 OID 17135)
-- Dependencies: 338
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4698 (class 0 OID 16546)
-- Dependencies: 315
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 4719 (class 0 OID 20086)
-- Dependencies: 343
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4700 (class 0 OID 16588)
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
-- TOC entry 4699 (class 0 OID 16561)
-- Dependencies: 316
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- TOC entry 4718 (class 0 OID 20042)
-- Dependencies: 342
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4714 (class 0 OID 17062)
-- Dependencies: 334
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4715 (class 0 OID 17076)
-- Dependencies: 335
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4720 (class 0 OID 20102)
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
-- TOC entry 4721 (class 0 OID 20109)
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
-- TOC entry 4790 (class 0 OID 0)
-- Dependencies: 310
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 25, true);


--
-- TOC entry 4791 (class 0 OID 0)
-- Dependencies: 351
-- Name: audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_audit_id_seq', 1, false);


--
-- TOC entry 4792 (class 0 OID 0)
-- Dependencies: 371
-- Name: crm_interaction_interaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crm_interaction_interaction_id_seq', 1, false);


--
-- TOC entry 4793 (class 0 OID 0)
-- Dependencies: 405
-- Name: import_job_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_job_job_id_seq', 1, false);


--
-- TOC entry 4794 (class 0 OID 0)
-- Dependencies: 407
-- Name: import_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_log_log_id_seq', 1, false);


--
-- TOC entry 4795 (class 0 OID 0)
-- Dependencies: 356
-- Name: mm_purchase_order_item_po_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mm_purchase_order_item_po_item_id_seq', 106, true);


--
-- TOC entry 4796 (class 0 OID 0)
-- Dependencies: 358
-- Name: mm_receiving_recv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mm_receiving_recv_id_seq', 35, true);


--
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 362
-- Name: wh_inventory_ledger_ledger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wh_inventory_ledger_ledger_id_seq', 1, false);


--
-- TOC entry 4798 (class 0 OID 0)
-- Dependencies: 337
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


-- Completed on 2025-09-19 11:19:17

--
-- PostgreSQL database dump complete
--

\unrestrict VifAihHjSGMLAPwDyv2jbBBXMq5LyyBxRZzBcRA9aFvYeL8hBUyP17u03vt2kA0

