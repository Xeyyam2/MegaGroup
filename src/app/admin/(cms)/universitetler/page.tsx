import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UniversitiesTable } from "./UniversitiesTable";

export default async function UniversitiesList() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("*").order("name_az");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Universitetlər</h1>
        <Link
          href="/admin/universitetler/yeni"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          + Yeni Universitet
        </Link>
      </div>

      <UniversitiesTable universities={(data ?? []) as any} />
    </div>
  );
}
