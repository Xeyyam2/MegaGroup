"use client";
import { useTransition } from "react";
import { deleteCountry } from "./actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export function DeleteCountryButton({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  return (
    <ConfirmDelete
      itemName={name}
      onConfirm={() => startTransition(async () => { await deleteCountry(id); })}
    />
  );
}