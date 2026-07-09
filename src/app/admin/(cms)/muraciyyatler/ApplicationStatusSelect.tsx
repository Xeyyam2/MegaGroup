"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { APPLICATION_STATUSES } from "@/lib/validations/application.schema";
import { updateApplicationStatus } from "./actions";
// APPLICATION_STATUSES tək mənbədən: application.schema.ts

const STATUS_LABELS: Record<string, string> = {
  yeni: "Yeni",
  goruldu: "Görüldü",
  qebul_edildi: "Qəbul edildi",
  imtina: "İmtina",
};

export function ApplicationStatusSelect({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    setSaving(true);
    const res = await updateApplicationStatus(id, next);
    setSaving(false);
    if ("error" in res && res.error) {
      toast.error(res.error);
      setStatus(initialStatus);
    } else {
      toast.success("Status yeniləndi");
      router.refresh();
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
    >
      {APPLICATION_STATUSES.map((value) => (
        <option key={value} value={value} className="bg-slate-900">
          {STATUS_LABELS[value] ?? value}
        </option>
      ))}
    </select>
  );
}
