"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteApplicationButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const { deleteApplication } = await import("./actions");
    await deleteApplication(id);
    router.refresh();
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
