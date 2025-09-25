// app/mm/materials/new/page.tsx (Server Component)
import { requireSession } from "@/lib/auth/requireSession";
import { MaterialForm } from "./ui/MaterialForm";

export default async function NewMaterialPage() {
  await requireSession();
  return <MaterialForm />;
}