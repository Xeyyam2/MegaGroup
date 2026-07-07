import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationStatusSelect } from "../ApplicationStatusSelect";

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString("az-AZ");
  } catch {
    return d;
  }
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("applications").select("*").eq("id", id).single();
  if (!data) notFound();

  const fields = [
    { label: "Ad Soyad", value: data.full_name },
    { label: "Telefon", value: <a href={`tel:${data.phone}`} className="text-brand-primary hover:underline">{data.phone}</a> },
    { label: "Email", value: data.email ? <a href={`mailto:${data.email}`} className="text-brand-primary hover:underline">{data.email}</a> : "—" },
    { label: "Maraqlanan ölkə", value: data.country_interest || "—" },
    { label: "Attestat (40-100)", value: data.attestat_avg ?? "—" },
    { label: "Tarix", value: formatDate(data.created_at) },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Müraciət detalı</h1>
        <Link href="/admin/muraciyyatler" className="text-sm text-foreground/60 hover:text-brand-primary">
          ← Geri
        </Link>
      </div>

      <div className="glass max-w-2xl rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Əlaqə məlumatları</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/60">Status:</span>
            <ApplicationStatusSelect id={id} initialStatus={data.status} />
          </div>
        </div>

        <dl className="space-y-3">
          {fields.map((f) => (
            <div key={f.label as string} className="flex gap-3 border-b border-white/5 pb-3">
              <dt className="w-48 shrink-0 text-sm text-foreground/60">{f.label}</dt>
              <dd className="text-sm text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>

        {data.message && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground/60">Mesaj</h3>
            <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground">
              {data.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
