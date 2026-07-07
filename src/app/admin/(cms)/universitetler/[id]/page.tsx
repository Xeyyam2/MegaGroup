import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UniversityForm } from "../UniversityForm";

const FEE_KEYS = [
  "tuition_min_usd", "tuition_max_usd",
  "dorm_min_usd", "dorm_max_usd",
  "food_min_usd", "food_max_usd",
  "transport_min_usd", "transport_max_usd",
  "personal_min_usd", "personal_max_usd",
] as const;

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: countries } = await supabase.from("countries").select("slug, name_az").order("name_az");
  const { data: uni } = await supabase.from("universities").select("*").eq("id", id).single();
  if (!uni) notFound();

  const slug = uni.slug as string;
  const [{ data: faculties }, { data: fees }] = await Promise.all([
    supabase.from("faculties").select("*").eq("university_slug", slug).order("sort_order"),
    supabase.from("university_fees").select("*").eq("university_slug", slug).maybeSingle(),
  ]);

  const feeFields: Record<string, number> = Object.fromEntries(
    FEE_KEYS.map((k) => [k, (fees as Record<string, any> | null)?.[k] ?? 0]),
  );

  return (
    <UniversityForm
      mode="edit"
      id={id}
      slug={slug}
      countries={countries ?? []}
      initial={uni}
      faculties={faculties ?? []}
      fees={feeFields}
    />
  );
}