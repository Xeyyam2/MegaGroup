"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCountry } from "./actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export function DeleteCountryButton({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  return (
    <ConfirmDelete
      itemName={name}
      onConfirm={() =>
        startTransition(async () => {
          const res = await deleteCountry(id);
          if ("error" in res && res.error) toast.error(res.error);
          else toast.success("Ölkə silindi");
        })
      }
    />
  );
}
