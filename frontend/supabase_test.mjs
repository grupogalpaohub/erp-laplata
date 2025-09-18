import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const test = async () => {
  const { data, error } = await client.from("mm_material").select("sku").limit(1);
  if (error) {
    console.error("❌ Erro Supabase:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Supabase respondeu:", data);
    process.exit(0);
  }
};
test();
