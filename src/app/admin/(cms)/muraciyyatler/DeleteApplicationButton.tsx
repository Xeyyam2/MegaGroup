"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteApplication } from "./actions";

export function DeleteApplicationButton({ id }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const res = await deleteApplication(id);
    if ("error" in res && res.error) {
      toast.error(res.error);
    } else {
      toast.success("Müraciət silindi");
      router.refresh();
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-400 hover:underline"
      >
        Sil
      </button>
    );
  }
  return (
    <span className="space-x-2">
      <button onClick={handleDelete} className="text-sm text-red-400 hover:underline">
        Təsdiqlə
      </button>
      <button onClick={() => setConfirming(false)} className="text-sm text-foreground/60 hover:underline">
        Ləğv
      </button>
    </span>
  );
}
