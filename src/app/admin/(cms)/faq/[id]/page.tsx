import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqForm } from "../FaqForm";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").eq("id", id).single();
  if (!data) notFound();
  return <FaqForm mode="edit" id={id} initial={data} />;
}