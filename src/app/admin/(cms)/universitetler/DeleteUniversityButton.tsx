"use client";
import { useTransition } from "react";
import { deleteUniversity } from "./actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export function DeleteUniversityButton({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  return (
    <ConfirmDelete
      itemName={name}
      onConfirm={() => startTransition(async () => { await deleteUniversity(id); })}
    />
  );
}