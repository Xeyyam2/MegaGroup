"use client";
import { useTransition } from "react";
import { deleteFaq } from "./actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export function DeleteFaqButton({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  return (
    <ConfirmDelete
      itemName={name}
      onConfirm={() => startTransition(async () => { await deleteFaq(id); })}
    />
  );
}