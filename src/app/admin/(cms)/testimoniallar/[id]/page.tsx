import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TestimonialForm } from "../TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).single();
  if (!data) notFound();
  return <TestimonialForm mode="edit" id={id} initial={data} />;
}