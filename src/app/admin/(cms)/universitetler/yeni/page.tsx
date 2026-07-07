import { createClient } from "@/lib/supabase/server";
import { UniversityForm } from "../UniversityForm";

export default async function NewUniversityPage() {
  const supabase = await createClient();
  const { data: countries } = await supabase.from("countries").select("slug, name_az").order("name_az");
  return <UniversityForm mode="create" countries={countries ?? []} />;
}